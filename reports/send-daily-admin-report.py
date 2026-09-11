#!/usr/bin/env python3
"""Khaemenes daily administrative email report.

Standard library only.

Immediate:
- Mentor Matrix health.

When the secure account backend is connected:
- new family accounts;
- new learner accounts;
- learners needing attention;
- adult/guardian contact roster;
- optional student contact roster;
- upcoming birthdays (month/day only for learners).

Automatic birthday wishes are intentionally NOT enabled here.
"""

from __future__ import annotations

import argparse
import csv
import html
import io
import json
import os
import re
import smtplib
import ssl
import urllib.error
import urllib.request
from datetime import date, datetime, timedelta, timezone
from email.message import EmailMessage
from email.utils import format_datetime
from pathlib import Path
from typing import Any


def env(name: str, default: str = "") -> str:
    return os.environ.get(name, default).strip()


def env_bool(name: str, default: bool = False) -> bool:
    return env(name, "true" if default else "false").lower() in {"1", "true", "yes", "on"}


def env_int(name: str, default: int) -> int:
    try:
        return int(env(name, str(default)))
    except Exception:
        return default


def parse_dt(value: Any) -> datetime | None:
    if not value:
        return None
    try:
        dt = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    except Exception:
        return None


def load_json(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def fetch_account_payload(url: str, token: str) -> tuple[dict | None, str]:
    if not url:
        return None, "not-connected"

    headers = {
        "Accept": "application/json",
        "User-Agent": "Khaemenes-Daily-Admin-Report/1.0",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"

    request = urllib.request.Request(url, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(request, timeout=25) as response:
            return json.loads(response.read().decode("utf-8")), "connected"
    except urllib.error.HTTPError as exc:
        return None, f"http-{exc.code}"
    except Exception as exc:
        return None, f"error-{type(exc).__name__}"


def recent(items: list[dict], hours: int = 24) -> list[dict]:
    cutoff = datetime.now(timezone.utc) - timedelta(hours=hours)
    rows = []
    for item in items or []:
        created = parse_dt(item.get("createdAt"))
        if created and created >= cutoff:
            rows.append(item)
    return rows


def birthday_month_day(item: dict) -> tuple[int, int] | None:
    birthday = item.get("birthday")
    if isinstance(birthday, dict):
        try:
            month = int(birthday.get("month"))
            day = int(birthday.get("day"))
            date(2000, month, day)
            return month, day
        except Exception:
            return None

    value = item.get("birthdayMonthDay")
    if isinstance(value, str):
        match = re.match(r"^(\d{1,2})-(\d{1,2})$", value.strip())
        if match:
            try:
                month, day = map(int, match.groups())
                date(2000, month, day)
                return month, day
            except Exception:
                return None
    return None


def days_until(month: int, day: int, today: date) -> int:
    year = today.year

    def candidate_for(y: int) -> date:
        try:
            return date(y, month, day)
        except ValueError:
            if month == 2 and day == 29:
                return date(y, 2, 28)
            raise

    candidate = candidate_for(year)
    if candidate < today:
        candidate = candidate_for(year + 1)
    return (candidate - today).days


def upcoming_birthdays(payload: dict, window_days: int) -> list[dict]:
    today = datetime.now(timezone.utc).date()
    rows = []

    for kind, collection in (
        ("adult", payload.get("adults", [])),
        ("learner", payload.get("learners", [])),
    ):
        for item in collection or []:
            md = birthday_month_day(item)
            if not md:
                continue
            remaining = days_until(md[0], md[1], today)
            if 0 <= remaining <= window_days:
                rows.append({
                    "kind": kind,
                    "displayName": item.get("displayName") or item.get("nickname") or "Account holder",
                    "month": md[0],
                    "day": md[1],
                    "daysUntil": remaining,
                    "birthdayWishesOptIn": bool(item.get("birthdayWishesOptIn", False)),
                    "guardianBirthdayConsent": bool(item.get("guardianBirthdayConsent", False)),
                })

    return sorted(rows, key=lambda x: (x["daysUntil"], x["kind"], x["displayName"].lower()))


def learner_attention(payload: dict, inactive_days: int, mastery_threshold: float) -> list[dict]:
    learners = {
        str(x.get("learnerId")): x
        for x in payload.get("learners", []) or []
        if x.get("learnerId")
    }

    grouped: dict[str, list[dict]] = {}
    for row in payload.get("progress", []) or []:
        learner_id = str(row.get("learnerId", ""))
        if learner_id:
            grouped.setdefault(learner_id, []).append(row)

    now = datetime.now(timezone.utc)
    output = []

    for learner_id, records in grouped.items():
        learner = learners.get(learner_id, {})
        reasons: list[str] = []
        max_overdue = 0
        latest_activity = None

        for row in records:
            course = row.get("courseTitle") or row.get("courseId") or "course"

            overdue = int(row.get("overdueAssignments", 0) or 0)
            max_overdue = max(max_overdue, overdue)
            if overdue:
                reasons.append(f"{overdue} overdue assignment(s) in {course}")

            expected = int(row.get("expectedAssignments", 0) or 0)
            completed = int(row.get("completedAssignments", 0) or 0)
            if expected >= 3 and completed / expected < 0.80:
                reasons.append(f"completion below 80% in {course}")

            scored_items = int(row.get("scoredItems", 0) or 0)
            mastery = row.get("masteryAverage")
            try:
                mastery_value = float(mastery)
            except Exception:
                mastery_value = None
            if mastery_value is not None and scored_items >= 2 and mastery_value < mastery_threshold:
                reasons.append(f"mastery average {mastery_value:.0f}% in {course}")

            activity = parse_dt(row.get("lastActivityAt") or row.get("updatedAt"))
            if activity and (latest_activity is None or activity > latest_activity):
                latest_activity = activity

        inactive = None
        if latest_activity:
            inactive = (now - latest_activity).days
            if inactive >= inactive_days:
                reasons.append(f"no recorded activity for {inactive} day(s)")

        reasons = list(dict.fromkeys(reasons))
        if not reasons:
            continue

        severity = "attention"
        if max_overdue >= 5 or (inactive is not None and inactive >= 14):
            severity = "high-attention"

        output.append({
            "learnerId": learner_id,
            "displayName": learner.get("nickname") or learner.get("displayName") or "Learner",
            "stage": learner.get("stage", ""),
            "severity": severity,
            "reasons": " | ".join(reasons),
            "lastActivityAt": latest_activity.isoformat() if latest_activity else "",
        })

    return sorted(output, key=lambda x: (0 if x["severity"] == "high-attention" else 1, x["displayName"].lower()))


def adult_roster(payload: dict) -> list[dict]:
    rows = []
    for adult in payload.get("adults", []) or []:
        email = str(adult.get("email", "")).strip()
        if email:
            rows.append({
                "displayName": adult.get("displayName", ""),
                "email": email,
                "role": adult.get("role", ""),
                "emailVerified": bool(adult.get("emailVerified", False)),
                "contactOptIn": bool(adult.get("contactOptIn", False)),
                "createdAt": adult.get("createdAt", ""),
            })
    return sorted(rows, key=lambda x: (x["displayName"].lower(), x["email"].lower()))


def student_roster(payload: dict) -> list[dict]:
    rows = []
    for learner in payload.get("learners", []) or []:
        email = str(learner.get("email", "")).strip()
        if email:
            rows.append({
                "displayName": learner.get("nickname") or learner.get("displayName") or "Learner",
                "email": email,
                "stage": learner.get("stage", ""),
                "emailVerified": bool(learner.get("emailVerified", False)),
                "guardianContactConsent": bool(learner.get("guardianContactConsent", False)),
                "createdAt": learner.get("createdAt", ""),
            })
    return sorted(rows, key=lambda x: (x["displayName"].lower(), x["email"].lower()))


def csv_bytes(rows: list[dict]) -> bytes:
    if not rows:
        return b""
    buffer = io.StringIO()
    writer = csv.DictWriter(buffer, fieldnames=list(rows[0].keys()))
    writer.writeheader()
    writer.writerows(rows)
    return buffer.getvalue().encode("utf-8")


def issue_text(issue: dict) -> str:
    anchor = (
        issue.get("repository")
        or issue.get("resourceId")
        or issue.get("sourceId")
        or issue.get("url")
        or ""
    )
    return str(issue.get("message") or issue.get("type") or "Finding") + (f" — {anchor}" if anchor else "")


def build_report(matrix: dict, account: dict | None, account_status: str) -> tuple[str, str, str, dict]:
    account = account or {"families": [], "adults": [], "learners": [], "progress": []}

    new_families = recent(account.get("families", []))
    new_learners = recent(account.get("learners", []))
    attention = learner_attention(
        account,
        env_int("REPORT_ATTENTION_INACTIVE_DAYS", 7),
        float(env("REPORT_ATTENTION_MASTERY_THRESHOLD", "80") or 80),
    )
    birthdays = upcoming_birthdays(account, env_int("REPORT_BIRTHDAY_WINDOW_DAYS", 14))
    adults = adult_roster(account)
    students = student_roster(account)

    summary = matrix.get("summary", {}) or {}
    metrics = matrix.get("metrics", {}) or {}
    issues = matrix.get("issues", []) or []
    status = str(summary.get("status", "UNKNOWN"))
    errors = [x for x in issues if x.get("severity") == "error"]
    warnings = [x for x in issues if x.get("severity") == "warning"]
    stale = [x for x in issues if "stale-registry" in str(x.get("type", "")).lower()]
    broken = [x for x in issues if "broken" in str(x.get("type", "")).lower()]
    unmanifested = [x for x in issues if "unmanifested" in str(x.get("type", "")).lower()]

    today = datetime.now().strftime("%Y-%m-%d")
    subject = (
        f"[Khaemenes Admin] {today} · {len(new_families)} new families · "
        f"{len(new_learners)} new learners · {len(attention)} attention · Matrix {status}"
    )

    text_lines = [
        "Khaemenes Academy · Daily Administrative Report",
        f"Date: {today}",
        "",
        "ACCOUNT ACTIVITY",
        f"Account backend: {account_status}",
        f"New families (24h): {len(new_families)}",
        f"New learners (24h): {len(new_learners)}",
        f"Learners needing attention: {len(attention)}",
        f"Adult/guardian email contacts: {len(adults)}",
        f"Student email contacts: {len(students)}",
        f"Upcoming birthdays ({env_int('REPORT_BIRTHDAY_WINDOW_DAYS', 14)} days): {len(birthdays)}",
        "",
    ]

    if new_families:
        text_lines.append("NEW FAMILIES")
        for row in new_families:
            text_lines.append(f"- {row.get('displayName') or row.get('familyId') or 'Family'}")
        text_lines.append("")

    if new_learners:
        text_lines.append("NEW LEARNERS")
        for row in new_learners:
            text_lines.append(
                f"- {row.get('nickname') or row.get('displayName') or 'Learner'} · {row.get('stage','')}"
            )
        text_lines.append("")

    if attention:
        text_lines.append("LEARNERS NEEDING ATTENTION")
        for row in attention:
            text_lines.append(
                f"- {row['displayName']} ({row['stage']}) · {row['severity']} · {row['reasons']}"
            )
        text_lines.append("")

    if birthdays:
        text_lines.append("UPCOMING BIRTHDAYS")
        for row in birthdays:
            text_lines.append(
                f"- {row['displayName']} · {row['month']:02d}/{row['day']:02d} · in {row['daysUntil']} day(s)"
            )
        text_lines.append("")

    text_lines += [
        "MENTOR MATRIX",
        f"Status: {status}",
        f"Errors: {len(errors)}",
        f"Warnings: {len(warnings)}",
        f"Repositories: {metrics.get('repositories', 0)}",
        f"Resources: {metrics.get('resources', 0)}",
        f"Objectives: {metrics.get('objectives', 0)}",
        f"URLs checked: {metrics.get('urlsChecked', 0)}",
        f"Stale-registry findings: {len(stale)}",
        f"Broken-route findings: {len(broken)}",
        f"Unmanifested findings: {len(unmanifested)}",
        "",
    ]

    if errors:
        text_lines.append("TOP MATRIX ERRORS")
        text_lines.extend(f"- {issue_text(x)}" for x in errors[:10])
        text_lines.append("")

    if warnings:
        text_lines.append("TOP MATRIX WARNINGS")
        text_lines.extend(f"- {issue_text(x)}" for x in warnings[:10])
        text_lines.append("")

    text_lines += [
        "PRIVACY",
        "- Learner birthdays are shown as month/day only.",
        "- Exact learner birth years/ages are not placed in this email.",
        "- Automatic birthday wishes are not enabled.",
        "- Student contact roster attachment is disabled by default.",
    ]

    text_body = "\n".join(text_lines)

    def esc(value: Any) -> str:
        return html.escape(str(value if value is not None else ""))

    def html_rows(rows: list[dict], columns: list[str]) -> str:
        if not rows:
            return '<tr><td colspan="4" style="color:#667382;padding:8px">None.</td></tr>'
        rendered = []
        for row in rows[:20]:
            rendered.append(
                "<tr>"
                + "".join(
                    f'<td style="padding:8px;border-bottom:1px solid #e7eaed">{esc(row.get(col,""))}</td>'
                    for col in columns
                )
                + "</tr>"
            )
        return "".join(rendered)

    attention_view = [
        {
            "name": row["displayName"],
            "stage": row["stage"],
            "level": row["severity"],
            "why": row["reasons"],
        }
        for row in attention
    ]
    birthday_view = [
        {
            "name": row["displayName"],
            "kind": row["kind"],
            "date": f"{row['month']:02d}/{row['day']:02d}",
            "when": "today" if row["daysUntil"] == 0 else f"in {row['daysUntil']} day(s)",
        }
        for row in birthdays
    ]

    matrix_color = "#257a4b" if status == "PASS" else "#a76a14" if "WARNING" in status else "#a63b3b"

    html_body = f"""<!doctype html>
<html><body style="margin:0;background:#f3f5f6;color:#172638;font:15px/1.55 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif">
<div style="max-width:820px;margin:0 auto;padding:26px 14px">
<section style="background:#071523;color:#f7f2e8;border-radius:18px;padding:28px">
<div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#d6b46d">Khaemenes Academy · Private Administration</div>
<h1 style="font:500 34px/1.05 Georgia,serif;margin:10px 0 12px">Daily Administrative Report</h1>
<p style="color:#b8c5cd;margin:0">{esc(today)} · Account backend: {esc(account_status)}</p>
</section>

<section style="background:white;border:1px solid #e1e6e9;border-radius:18px;padding:22px;margin-top:14px">
<h2 style="font:500 24px Georgia,serif;margin-top:0">Account activity</h2>
<table style="width:100%;border-collapse:collapse">
<tr><td>New families · 24h</td><td style="text-align:right"><strong>{len(new_families)}</strong></td></tr>
<tr><td>New learners · 24h</td><td style="text-align:right"><strong>{len(new_learners)}</strong></td></tr>
<tr><td>Learners needing attention</td><td style="text-align:right"><strong>{len(attention)}</strong></td></tr>
<tr><td>Adult/guardian email contacts</td><td style="text-align:right"><strong>{len(adults)}</strong></td></tr>
<tr><td>Student email contacts</td><td style="text-align:right"><strong>{len(students)}</strong></td></tr>
<tr><td>Upcoming birthdays</td><td style="text-align:right"><strong>{len(birthdays)}</strong></td></tr>
</table>
</section>

<section style="background:white;border:1px solid #e1e6e9;border-radius:18px;padding:22px;margin-top:14px">
<h2 style="font:500 24px Georgia,serif;margin-top:0">Learners needing attention</h2>
<table style="width:100%;border-collapse:collapse">
<tr style="color:#667382"><th align="left">Learner</th><th align="left">Stage</th><th align="left">Level</th><th align="left">Why</th></tr>
{html_rows(attention_view, ["name","stage","level","why"])}
</table>
</section>

<section style="background:white;border:1px solid #e1e6e9;border-radius:18px;padding:22px;margin-top:14px">
<h2 style="font:500 24px Georgia,serif;margin-top:0">Upcoming birthdays</h2>
<p style="color:#667382">Learner birth years and ages are intentionally omitted.</p>
<table style="width:100%;border-collapse:collapse">
<tr style="color:#667382"><th align="left">Name</th><th align="left">Account</th><th align="left">Month/day</th><th align="left">When</th></tr>
{html_rows(birthday_view, ["name","kind","date","when"])}
</table>
</section>

<section style="background:white;border:1px solid #e1e6e9;border-radius:18px;padding:22px;margin-top:14px">
<h2 style="font:500 24px Georgia,serif;margin-top:0">Mentor Matrix</h2>
<span style="display:inline-block;padding:5px 9px;border-radius:999px;background:{matrix_color};color:white;font-weight:700">{esc(status)}</span>
<table style="width:100%;border-collapse:collapse;margin-top:12px">
<tr><td>Errors</td><td style="text-align:right"><strong>{len(errors)}</strong></td></tr>
<tr><td>Warnings</td><td style="text-align:right"><strong>{len(warnings)}</strong></td></tr>
<tr><td>Stale registry findings</td><td style="text-align:right"><strong>{len(stale)}</strong></td></tr>
<tr><td>Broken route findings</td><td style="text-align:right"><strong>{len(broken)}</strong></td></tr>
<tr><td>Unmanifested findings</td><td style="text-align:right"><strong>{len(unmanifested)}</strong></td></tr>
</table>
</section>

<p style="font-size:12px;color:#697784;text-align:center;margin:20px 12px">
Private administrative report · automatic birthday wishes are not enabled · student-contact roster is disabled by default.
</p>
</div></body></html>"""

    derived = {
        "newFamilies": new_families,
        "newLearners": new_learners,
        "attention": attention,
        "birthdays": birthdays,
        "adultRoster": adults,
        "studentRoster": students,
    }
    return subject, text_body, html_body, derived


def attach_csv(msg: EmailMessage, rows: list[dict], filename: str, outdir: Path) -> None:
    data = csv_bytes(rows)
    if not data:
        return
    (outdir / filename).write_bytes(data)
    msg.add_attachment(data, maintype="text", subtype="csv", filename=filename)


def send_email(
    subject: str,
    text_body: str,
    html_body: str,
    matrix_path: Path,
    derived: dict,
    outdir: Path,
) -> None:
    host = env("REPORT_SMTP_HOST")
    port = env_int("REPORT_SMTP_PORT", 587)
    username = env("REPORT_SMTP_USERNAME")
    password = env("REPORT_SMTP_PASSWORD")
    sender = env("REPORT_SMTP_FROM") or username
    recipients = [x.strip() for x in env("REPORT_TO").split(",") if x.strip()]
    security = env("REPORT_SMTP_SECURITY", "starttls").lower()

    missing = []
    if not host:
        missing.append("REPORT_SMTP_HOST")
    if not sender:
        missing.append("REPORT_SMTP_FROM or REPORT_SMTP_USERNAME")
    if not recipients:
        missing.append("REPORT_TO")
    if username and not password:
        missing.append("REPORT_SMTP_PASSWORD")
    if missing:
        raise RuntimeError("Missing email configuration: " + ", ".join(missing))

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = ", ".join(recipients)
    msg["Date"] = format_datetime(datetime.now(timezone.utc))
    msg.set_content(text_body)
    msg.add_alternative(html_body, subtype="html")

    if matrix_path.exists():
        msg.add_attachment(
            matrix_path.read_bytes(),
            maintype="application",
            subtype="json",
            filename="mentor-matrix-report.json",
        )

    if env_bool("REPORT_ATTACH_ADULT_ROSTER", True):
        attach_csv(msg, derived["adultRoster"], "adult-guardian-contact-roster.csv", outdir)

    if env_bool("REPORT_ATTACH_STUDENT_ROSTER", False):
        consented = [x for x in derived["studentRoster"] if x.get("guardianContactConsent")]
        attach_csv(msg, consented, "student-contact-roster.csv", outdir)

    attach_csv(msg, derived["attention"], "learner-attention.csv", outdir)
    attach_csv(msg, derived["birthdays"], "upcoming-birthdays.csv", outdir)

    context = ssl.create_default_context()
    if security == "ssl":
        with smtplib.SMTP_SSL(host, port, context=context, timeout=30) as smtp:
            if username:
                smtp.login(username, password)
            smtp.send_message(msg)
    else:
        with smtplib.SMTP(host, port, timeout=30) as smtp:
            smtp.ehlo()
            if security != "plain":
                smtp.starttls(context=context)
                smtp.ehlo()
            if username:
                smtp.login(username, password)
            smtp.send_message(msg)


def write_step_summary(matrix: dict, account_status: str, derived: dict) -> None:
    target = env("GITHUB_STEP_SUMMARY")
    if not target:
        return
    summary = matrix.get("summary", {}) or {}
    lines = [
        "## Khaemenes Daily Administrative Report",
        "",
        f"**Matrix:** {summary.get('status','UNKNOWN')} — {summary.get('error',0)} errors / {summary.get('warning',0)} warnings",
        f"**Account backend:** {account_status}",
        f"**New families:** {len(derived['newFamilies'])}",
        f"**New learners:** {len(derived['newLearners'])}",
        f"**Learners needing attention:** {len(derived['attention'])}",
        f"**Upcoming birthdays:** {len(derived['birthdays'])}",
        "",
    ]
    with open(target, "a", encoding="utf-8") as handle:
        handle.write("\n".join(lines))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--matrix", required=True, type=Path)
    parser.add_argument("--account-json", type=Path, default=None)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if args.matrix.exists():
        matrix = load_json(args.matrix)
    else:
        matrix = {
            "summary": {"status": "FAIL", "error": 1, "warning": 0, "info": 0},
            "metrics": {},
            "issues": [{
                "severity": "error",
                "type": "matrix-report-missing",
                "message": "Matrix report was not produced.",
            }],
        }

    if args.account_json:
        account = load_json(args.account_json)
        account_status = "fixture/local-input"
    else:
        account, account_status = fetch_account_payload(
            env("REPORT_ACCOUNT_API_URL"),
            env("REPORT_ACCOUNT_API_TOKEN"),
        )

    subject, text_body, html_body, derived = build_report(matrix, account, account_status)

    outdir = Path(env("RUNNER_TEMP", "/tmp")) / "khaemenes-daily-report"
    outdir.mkdir(parents=True, exist_ok=True)
    (outdir / "daily-report.txt").write_text(text_body, encoding="utf-8")
    (outdir / "daily-report.html").write_text(html_body, encoding="utf-8")

    write_step_summary(matrix, account_status, derived)

    if args.dry_run:
        print(subject)
        print(text_body)
        return 0

    send_email(subject, text_body, html_body, args.matrix, derived, outdir)
    print("Daily Khaemenes administrative report sent.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
