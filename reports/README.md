# Daily Khaemenes Administrative Email

## Daily sections

### Works immediately
- Mentor Matrix status
- errors / warnings
- stale registry findings
- broken recommendable routes
- unmanifested-repository findings

### Appears when the secure account backend is connected
- new families in the last 24 hours
- new learner accounts in the last 24 hours
- learners needing attention
- adult/guardian contact roster
- optional student contact roster
- upcoming birthdays

The current Khaemenes family registry is browser-local. GitHub Actions cannot read a user's localStorage, so family/student counts cannot be centralized until the secure account service exists.

## Learner-attention rules

The first report flags a learner when one or more of these are true:

- one or more overdue assignments;
- fewer than 80% of expected assignments completed when at least 3 are expected;
- mastery average below 80% across at least 2 scored items;
- no recorded activity for 7 or more days.

`high-attention` is used when:
- 5 or more assignments are overdue; or
- no recorded activity exists for 14 or more days.

These are private administrative signals, not automatic academic judgments.

## Contact rosters

Default:
- adult/guardian roster: attached;
- student roster: disabled.

If the student roster is intentionally enabled, only rows with `guardianContactConsent=true` are attached.

`contactOptIn` is kept separate from an email address so future general announcements/newsletters can honor consent.

## Birthdays

Default window: 14 days.

Learners are shown by display name + month/day only. Birth year is not needed by this report.

Automatic birthday wishes are reserved for a later opt-in feature. See `FUTURE_BIRTHDAY_WISHES.md`.

## GitHub Actions Secrets

Repository:
`vervenveda/vervenveda.github.io`

Open:
Settings → Secrets and variables → Actions → New repository secret

Required for email:
- `REPORT_TO`
- `REPORT_SMTP_HOST`
- `REPORT_SMTP_PORT`
- `REPORT_SMTP_USERNAME`
- `REPORT_SMTP_PASSWORD`
- `REPORT_SMTP_FROM`
- `REPORT_SMTP_SECURITY`

Set `REPORT_TO` to the private Proton address you provided in chat.

Do not place SMTP passwords in HTML, JavaScript, Python source, repository variables, or commits.

Later, when the secure account service exists:
- `REPORT_ACCOUNT_API_URL`
- `REPORT_ACCOUNT_API_TOKEN`

Until then, the email will state:
`Account backend: not-connected`

## Schedule

Daily at **7:30 AM America/New_York**, plus manual `workflow_dispatch`.

## First test

After upload and SMTP-secret configuration:

GitHub → Actions → Daily Khaemenes Admin Report → Run workflow

The Matrix step intentionally uses `continue-on-error`; the report should still email you when the Matrix discovers problems.
