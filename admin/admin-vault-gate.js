/*
  Verve N Veda Admin Vault Gate v1.0.0
  Reusable browser-local nested security gate for Admin Mini AGI vaults.

  Design goals:
  - Match the existing Admin Portal 10-digit numeric gate model.
  - Preserve the existing first-use initialization behavior.
  - Store salted PBKDF2-SHA256 verifier records, never plaintext changed passcodes.
  - Keep each vault's credential record, failed-attempt count, and session isolated.
  - Support lock-all, inactivity auto-lock, passcode changes, and re-authentication.
  - Provide personality-rich rejection messages without leaking verification details.

  Security boundary:
  This is a client-side/browser-local privacy layer for the static Admin Portal.
  It is not a substitute for authenticated server-side authorization.
*/
(function attachAdminVaultGate(global) {
  "use strict";

  const VERSION = "1.0.0";
  const ITERATIONS = 120000;
  const DEFAULT_CODE = "0000000000";
  const PREFIX = "VNV_ADMIN_VAULT";
  const encoder = new TextEncoder();
  const registry = new Map();

  const MESSAGE_BANKS = Object.freeze({
    photo: [
      "Incorrect. The photographs have collectively decided you look suspicious.",
      "Access denied. The camera added ten pounds and revoked your credentials.",
      "Wrong code. Please smile while the security system silently judges you."
    ],
    document: [
      "Incorrect. Your paperwork has been forwarded to the Department of Absolutely Not.",
      "Access denied. The filing cabinet has retained counsel.",
      "Wrong code. Somewhere, a PDF just closed itself."
    ],
    video: [
      "Incorrect. This attempt has been nominated for Best Unauthorized Performance.",
      "Access denied. Please remain seated until after the credits.",
      "Wrong code. The director has requested another take."
    ],
    media: [
      "Incorrect. The archives have voted unanimously against this decision.",
      "Access denied. Even the Unsorted folder knows better.",
      "Wrong code. The repository has quietly moved your request to the circular file."
    ],
    default: [
      "Wrong password! You unlocked a new achievement: 'Most Predictable Guess of the Day'.",
      "Access rejected. My cat walked across the keyboard and almost guessed a better password.",
      "Incorrect. Please consult a magic 8-ball for better password guessing abilities."
    ]
  });

  function normalizeVaultId(value) {
    const id = String(value || "").trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
    if (!id) throw new TypeError("A vaultId is required.");
    return id.slice(0, 80);
  }

  function cleanCode(value) {
    return String(value || "").replace(/\D/g, "").slice(0, 10);
  }

  function isValidCode(value) {
    return /^[0-9]{10}$/.test(String(value || ""));
  }

  function bytesToBase64(bytes) {
    let binary = "";
    bytes.forEach(byte => { binary += String.fromCharCode(byte); });
    return btoa(binary);
  }

  function base64ToBytes(value) {
    return Uint8Array.from(atob(value), char => char.charCodeAt(0));
  }

  function constantTimeEqual(a, b) {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
    return diff === 0;
  }

  async function derive(code, salt) {
    const material = await global.crypto.subtle.importKey(
      "raw",
      encoder.encode(code),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );
    const bits = await global.crypto.subtle.deriveBits(
      { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
      material,
      256
    );
    return new Uint8Array(bits);
  }

  function safeRead(storage, key) {
    try {
      const raw = storage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function safeWrite(storage, key, value) {
    try {
      storage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  function safeRemove(storage, key) {
    try { storage.removeItem(key); } catch {}
  }

  function dispatch(name, detail) {
    try {
      global.dispatchEvent(new CustomEvent(name, { detail }));
    } catch {}
  }

  function inferMessageBank(vaultId, title) {
    const haystack = `${vaultId} ${title}`.toLowerCase();
    if (/photo|image|picture|gallery/.test(haystack)) return "photo";
    if (/document|doc|pdf|paper|file/.test(haystack)) return "document";
    if (/video|film|movie/.test(haystack)) return "video";
    if (/media|repository|archive/.test(haystack)) return "media";
    return "default";
  }

  function wrongPasscodeMessage(attempt, bankName) {
    if (attempt === 4) return "Notice: This computer is now judging your life choices.";
    if (attempt >= 5) return "Access rejected. Incorrect administrator passcode.";
    const bank = MESSAGE_BANKS[bankName] || MESSAGE_BANKS.default;
    return bank[Math.max(0, Math.min(2, attempt - 1))] || MESSAGE_BANKS.default[0];
  }

  function ensureStyles() {
    if (document.getElementById("vnvAdminVaultGateStyles")) return;
    const style = document.createElement("style");
    style.id = "vnvAdminVaultGateStyles";
    style.textContent = `
      .vnv-vault-overlay{position:fixed;inset:0;z-index:12000;display:none;place-items:center;padding:20px;background:rgba(2,8,14,.88);backdrop-filter:blur(12px)}
      .vnv-vault-overlay.open{display:grid}
      .vnv-vault-card{width:min(100%,500px);padding:30px;border:1px solid rgba(180,139,69,.38);border-top:4px solid #a52a37;border-radius:14px;background:#f4f0e7;color:#101419;box-shadow:0 35px 110px rgba(0,0,0,.58);text-align:center;font-family:"Avenir Next",Avenir,"Segoe UI",Arial,sans-serif}
      .vnv-vault-kicker{display:block;color:#8e2424;font:700 10px/1 Cinzel,Aboreto,"Times New Roman",serif;letter-spacing:.16em;text-transform:uppercase}
      .vnv-vault-card h2{margin:10px 0 8px;font:500 clamp(34px,7vw,48px)/1 "Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;letter-spacing:.025em}
      .vnv-vault-card p{margin:0 auto 16px;max-width:390px;color:#56615b;font-size:12px;line-height:1.6}
      .vnv-vault-form{display:grid;gap:11px;margin-top:18px}
      .vnv-vault-field{display:grid;gap:6px;text-align:left}
      .vnv-vault-field label{color:#555f59;font-size:9px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;text-align:center}
      .vnv-vault-code-row{display:grid;grid-template-columns:minmax(0,1fr) 90px;gap:8px}
      .vnv-vault-input{width:100%;min-height:50px;padding:0 12px;border:1px solid #aeb7b2;border-radius:7px;background:#fff;color:#111;font-size:18px;letter-spacing:.14em;text-align:center}
      .vnv-vault-button{min-height:44px;padding:8px 12px;border:1px solid #aeb7b2;border-radius:7px;background:#fff;color:#111;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase}
      .vnv-vault-button.primary{border-color:#7f1717;background:#a52a37;color:#fff}
      .vnv-vault-button.secondary{background:#fff;color:#111}
      .vnv-vault-actions{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
      .vnv-vault-actions .vnv-vault-button{flex:1 1 150px}
      .vnv-vault-status{min-height:22px;margin:2px 0 0!important;font-size:12px!important;font-weight:750}
      .vnv-vault-status.error{color:#9d2626}.vnv-vault-status.ok{color:#26633d}
      .vnv-vault-note{margin-top:16px!important;padding:9px 11px;border:1px solid #ded4c4;border-top:2px solid #b48b45;background:#fff;font-size:10px!important}
      @media(max-width:520px){.vnv-vault-code-row{grid-template-columns:1fr}.vnv-vault-code-row .vnv-vault-button{width:100%}}
      @media(prefers-reduced-motion:reduce){.vnv-vault-overlay *{transition:none!important;animation:none!important}}
    `;
    document.head.appendChild(style);
  }

  class VaultGate {
    constructor(config = {}) {
      this.vaultId = normalizeVaultId(config.vaultId);
      this.title = String(config.title || "Admin Vault").trim() || "Admin Vault";
      this.subtitle = String(config.subtitle || "Protected administrator storage").trim();
      this.autoLockMinutes = Number.isFinite(Number(config.autoLockMinutes))
        ? Math.max(0, Number(config.autoLockMinutes))
        : 15;
      this.onUnlock = typeof config.onUnlock === "function" ? config.onUnlock : null;
      this.onLock = typeof config.onLock === "function" ? config.onLock : null;
      this.messageBank = config.messageBank && MESSAGE_BANKS[config.messageBank]
        ? config.messageBank
        : inferMessageBank(this.vaultId, this.title);

      const keyId = this.vaultId.toUpperCase().replace(/[^A-Z0-9_-]/g, "_");
      this.recordKey = `${PREFIX}_${keyId}_RECORD_V1`;
      this.sessionKey = `${PREFIX}_${keyId}_SESSION_V1`;
      this.attemptKey = `${PREFIX}_${keyId}_FAILED_ATTEMPTS_V1`;
      this.lastActivityKey = `${PREFIX}_${keyId}_LAST_ACTIVITY_V1`;

      this._overlay = null;
      this._mode = "unlock";
      this._authorizedAction = null;
      this._autoLockTimer = null;
      this._activityHandler = () => this._touchActivity();
      this._boundActivity = false;
    }

    _readRecord() {
      return safeRead(global.localStorage, this.recordKey);
    }

    _failedAttempts() {
      try {
        return Math.max(0, parseInt(global.sessionStorage.getItem(this.attemptKey) || "0", 10) || 0);
      } catch {
        return 0;
      }
    }

    _setFailedAttempts(value) {
      try { global.sessionStorage.setItem(this.attemptKey, String(Math.max(0, value | 0))); } catch {}
    }

    _readSession() {
      return safeRead(global.sessionStorage, this.sessionKey);
    }

    _writeSession(unlocked) {
      if (!unlocked) {
        safeRemove(global.sessionStorage, this.sessionKey);
        safeRemove(global.sessionStorage, this.lastActivityKey);
        return;
      }
      const now = Date.now();
      safeWrite(global.sessionStorage, this.sessionKey, {
        version: 1,
        unlocked: true,
        at: new Date(now).toISOString(),
        lastActivity: now
      });
      try { global.sessionStorage.setItem(this.lastActivityKey, String(now)); } catch {}
    }

    async _verify(code) {
      if (!isValidCode(code)) return false;
      const record = this._readRecord();
      if (!record?.salt || !record?.hash) return code === DEFAULT_CODE;
      try {
        const derived = await derive(code, base64ToBytes(record.salt));
        return constantTimeEqual(derived, base64ToBytes(record.hash));
      } catch {
        return false;
      }
    }

    async _saveNewCode(code) {
      if (!isValidCode(code)) throw new TypeError("Passcode must contain exactly 10 digits.");
      const salt = global.crypto.getRandomValues(new Uint8Array(16));
      const hash = await derive(code, salt);
      const ok = safeWrite(global.localStorage, this.recordKey, {
        version: 1,
        algorithm: "PBKDF2-SHA256",
        iterations: ITERATIONS,
        salt: bytesToBase64(salt),
        hash: bytesToBase64(hash),
        changedAt: new Date().toISOString()
      });
      if (!ok) throw new Error("Vault credential record could not be stored in this browser.");
      return true;
    }

    _sessionExpired() {
      if (!this.autoLockMinutes) return false;
      const session = this._readSession();
      const last = Number(session?.lastActivity || 0) || Number(global.sessionStorage.getItem(this.lastActivityKey) || 0);
      if (!last) return false;
      return Date.now() - last > this.autoLockMinutes * 60 * 1000;
    }

    isUnlocked() {
      const session = this._readSession();
      if (!session?.unlocked) return false;
      if (this._sessionExpired()) {
        this.lock("inactivity");
        return false;
      }
      return true;
    }

    _bindActivity() {
      if (this._boundActivity) return;
      ["pointerdown", "keydown", "touchstart"].forEach(type => global.addEventListener(type, this._activityHandler, { passive: true }));
      this._boundActivity = true;
    }

    _unbindActivity() {
      if (!this._boundActivity) return;
      ["pointerdown", "keydown", "touchstart"].forEach(type => global.removeEventListener(type, this._activityHandler));
      this._boundActivity = false;
    }

    _touchActivity() {
      if (!this.isUnlocked()) return;
      const now = Date.now();
      const session = this._readSession() || {};
      session.unlocked = true;
      session.lastActivity = now;
      safeWrite(global.sessionStorage, this.sessionKey, session);
      try { global.sessionStorage.setItem(this.lastActivityKey, String(now)); } catch {}
      this._scheduleAutoLock();
    }

    _scheduleAutoLock() {
      if (this._autoLockTimer) clearTimeout(this._autoLockTimer);
      if (!this.autoLockMinutes || !this.isUnlocked()) return;
      this._autoLockTimer = global.setTimeout(() => {
        if (this._sessionExpired()) this.lock("inactivity");
        else this._scheduleAutoLock();
      }, Math.max(1000, this.autoLockMinutes * 60 * 1000));
    }

    async unlock(code, options = {}) {
      const cleaned = cleanCode(code);
      if (!isValidCode(cleaned)) return { ok: false, message: "Enter exactly 10 digits." };
      const valid = await this._verify(cleaned);
      if (!valid) {
        const attempt = this._failedAttempts() + 1;
        this._setFailedAttempts(attempt);
        return { ok: false, message: wrongPasscodeMessage(attempt, this.messageBank), attempt };
      }

      this._setFailedAttempts(0);
      if (!this._readRecord()) await this._saveNewCode(cleaned);

      if (!options.reauthOnly) {
        this._writeSession(true);
        this._bindActivity();
        this._scheduleAutoLock();
        if (this.onUnlock) {
          try { this.onUnlock(this); } catch {}
        }
        dispatch("vnv:vault-unlocked", { vaultId: this.vaultId, title: this.title });
      }
      return { ok: true, message: options.reauthOnly ? "Authorization confirmed." : `${this.title} unlocked.` };
    }

    lock(reason = "manual") {
      const wasUnlocked = Boolean(this._readSession()?.unlocked);
      this._writeSession(false);
      this._setFailedAttempts(0);
      this._unbindActivity();
      if (this._autoLockTimer) clearTimeout(this._autoLockTimer);
      this._autoLockTimer = null;
      this.close();
      if (wasUnlocked && this.onLock) {
        try { this.onLock(this, reason); } catch {}
      }
      if (wasUnlocked) dispatch("vnv:vault-locked", { vaultId: this.vaultId, title: this.title, reason });
      return true;
    }

    async changePasscode(current, next, confirm) {
      const currentCode = cleanCode(current);
      const nextCode = cleanCode(next);
      const confirmCode = cleanCode(confirm);
      if (!isValidCode(currentCode) || !isValidCode(nextCode) || !isValidCode(confirmCode)) {
        return { ok: false, message: "All fields must contain exactly 10 digits." };
      }
      if (nextCode !== confirmCode) return { ok: false, message: "The new passcodes do not match." };
      if (!(await this._verify(currentCode))) return { ok: false, message: "The current passcode was not accepted." };
      await this._saveNewCode(nextCode);
      this._setFailedAttempts(0);
      dispatch("vnv:vault-passcode-changed", { vaultId: this.vaultId, title: this.title });
      return { ok: true, message: "New passcode saved to this browser." };
    }

    setAutoLockMinutes(minutes) {
      const value = Number(minutes);
      if (!Number.isFinite(value) || value < 0) throw new TypeError("Auto-lock minutes must be zero or greater.");
      this.autoLockMinutes = value;
      this._scheduleAutoLock();
      return this.autoLockMinutes;
    }

    _ensureOverlay() {
      ensureStyles();
      if (this._overlay && document.body.contains(this._overlay)) return this._overlay;

      const overlay = document.createElement("div");
      overlay.className = "vnv-vault-overlay";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-label", `${this.title} security gate`);
      overlay.innerHTML = `
        <section class="vnv-vault-card">
          <span class="vnv-vault-kicker" data-vault-kicker>Protected Admin Vault</span>
          <h2 data-vault-title></h2>
          <p data-vault-subtitle></p>
          <form class="vnv-vault-form" data-vault-form>
            <div data-unlock-fields>
              <div class="vnv-vault-field">
                <label>Administrator passcode</label>
                <div class="vnv-vault-code-row">
                  <input class="vnv-vault-input" data-code type="password" inputmode="numeric" pattern="[0-9]{10}" minlength="10" maxlength="10" autocomplete="off" aria-label="Administrator passcode" required>
                  <button class="vnv-vault-button secondary" data-show type="button">Show</button>
                </div>
              </div>
            </div>
            <div data-change-fields hidden>
              <div class="vnv-vault-field"><label>Current passcode</label><input class="vnv-vault-input" data-current type="password" inputmode="numeric" maxlength="10" autocomplete="off"></div>
              <div class="vnv-vault-field"><label>New passcode</label><input class="vnv-vault-input" data-new type="password" inputmode="numeric" maxlength="10" autocomplete="off"></div>
              <div class="vnv-vault-field"><label>Confirm new passcode</label><input class="vnv-vault-input" data-confirm type="password" inputmode="numeric" maxlength="10" autocomplete="off"></div>
            </div>
            <p class="vnv-vault-status" data-status role="status" aria-live="polite"></p>
            <div class="vnv-vault-actions">
              <button class="vnv-vault-button primary" data-submit type="submit">Unlock Vault</button>
              <button class="vnv-vault-button secondary" data-cancel type="button">Cancel</button>
            </div>
          </form>
          <p class="vnv-vault-note" data-vault-note>Nested administrator privacy layer. Vault sessions remain separate from the main Admin session.</p>
        </section>`;

      const form = overlay.querySelector("[data-vault-form]");
      const code = overlay.querySelector("[data-code]");
      const current = overlay.querySelector("[data-current]");
      const next = overlay.querySelector("[data-new]");
      const confirm = overlay.querySelector("[data-confirm]");
      const status = overlay.querySelector("[data-status]");
      const show = overlay.querySelector("[data-show]");
      const cancel = overlay.querySelector("[data-cancel]");

      [code, current, next, confirm].forEach(input => input.addEventListener("input", event => {
        event.target.value = cleanCode(event.target.value);
      }));

      show.addEventListener("click", () => {
        const reveal = code.type === "password";
        code.type = reveal ? "text" : "password";
        show.textContent = reveal ? "Hide" : "Show";
        code.focus();
      });

      cancel.addEventListener("click", () => this.close());
      overlay.addEventListener("click", event => {
        if (event.target === overlay && this._mode !== "reauth") this.close();
      });
      overlay.addEventListener("keydown", event => {
        if (event.key === "Escape" && this._mode !== "reauth") this.close();
      });

      form.addEventListener("submit", async event => {
        event.preventDefault();
        status.textContent = "Checking gate…";
        status.className = "vnv-vault-status";

        try {
          if (this._mode === "change") {
            const result = await this.changePasscode(current.value, next.value, confirm.value);
            status.textContent = result.message;
            status.className = `vnv-vault-status ${result.ok ? "ok" : "error"}`;
            if (result.ok) {
              current.value = next.value = confirm.value = "";
              global.setTimeout(() => this.close(), 650);
            }
            return;
          }

          const result = await this.unlock(code.value, { reauthOnly: this._mode === "reauth" });
          status.textContent = result.message;
          status.className = `vnv-vault-status ${result.ok ? "ok" : "error"}`;
          if (!result.ok) {
            code.select();
            return;
          }

          code.value = "";
          if (this._mode === "reauth") {
            const action = this._authorizedAction;
            this._authorizedAction = null;
            this.close();
            if (typeof action === "function") await action();
          } else {
            this.close();
          }
        } catch (error) {
          status.textContent = String(error?.message || error || "Vault authorization failed.");
          status.className = "vnv-vault-status error";
        }
      });

      document.body.appendChild(overlay);
      this._overlay = overlay;
      return overlay;
    }

    _configureOverlay(mode, options = {}) {
      const overlay = this._ensureOverlay();
      this._mode = mode;
      overlay.querySelector("[data-vault-title]").textContent = this.title;
      overlay.querySelector("[data-vault-subtitle]").textContent = options.subtitle || this.subtitle;
      overlay.querySelector("[data-vault-kicker]").textContent = mode === "reauth" ? "Protected Action" : mode === "change" ? "Vault Security" : "Protected Admin Vault";
      overlay.querySelector("[data-unlock-fields]").hidden = mode === "change";
      overlay.querySelector("[data-change-fields]").hidden = mode !== "change";
      overlay.querySelector("[data-submit]").textContent = mode === "change" ? "Save New Passcode" : mode === "reauth" ? "Authorize Action" : "Unlock Vault";
      overlay.querySelector("[data-status]").textContent = "";
      overlay.querySelector("[data-status]").className = "vnv-vault-status";
      overlay.querySelectorAll("input").forEach(input => { input.value = ""; input.type = "password"; });
      const show = overlay.querySelector("[data-show]");
      if (show) show.textContent = "Show";
      return overlay;
    }

    open(options = {}) {
      if (this.isUnlocked() && !options.force) return Promise.resolve(true);
      const overlay = this._configureOverlay("unlock", options);
      overlay.classList.add("open");
      global.setTimeout(() => overlay.querySelector("[data-code]")?.focus(), 40);
      return Promise.resolve(false);
    }

    openChangeDialog() {
      const overlay = this._configureOverlay("change", { subtitle: `Change the passcode for ${this.title}.` });
      overlay.classList.add("open");
      global.setTimeout(() => overlay.querySelector("[data-current]")?.focus(), 40);
    }

    requireReauth(action, options = {}) {
      if (typeof action !== "function") throw new TypeError("A protected action function is required.");
      this._authorizedAction = action;
      const overlay = this._configureOverlay("reauth", {
        subtitle: options.subtitle || `Re-enter the ${this.title} passcode to authorize this protected action.`
      });
      overlay.classList.add("open");
      global.setTimeout(() => overlay.querySelector("[data-code]")?.focus(), 40);
    }

    close() {
      if (!this._overlay) return;
      this._overlay.classList.remove("open");
      this._overlay.querySelectorAll("input").forEach(input => { input.value = ""; });
      const status = this._overlay.querySelector("[data-status]");
      if (status) {
        status.textContent = "";
        status.className = "vnv-vault-status";
      }
      if (this._mode !== "reauth") this._authorizedAction = null;
    }

    getState() {
      return Object.freeze({
        vaultId: this.vaultId,
        title: this.title,
        version: VERSION,
        initialized: Boolean(this._readRecord()),
        unlocked: this.isUnlocked(),
        failedAttempts: this._failedAttempts(),
        autoLockMinutes: this.autoLockMinutes
      });
    }

    destroy() {
      this.lock("destroy");
      if (this._overlay?.parentNode) this._overlay.parentNode.removeChild(this._overlay);
      this._overlay = null;
      registry.delete(this.vaultId);
    }
  }

  function create(config = {}) {
    const id = normalizeVaultId(config.vaultId);
    if (registry.has(id)) return registry.get(id);
    const gate = new VaultGate({ ...config, vaultId: id });
    registry.set(id, gate);
    return gate;
  }

  function get(vaultId) {
    try { return registry.get(normalizeVaultId(vaultId)) || null; }
    catch { return null; }
  }

  function lockAll(reason = "lock-all") {
    registry.forEach(gate => gate.lock(reason));
    dispatch("vnv:all-vaults-locked", { reason });
  }

  function list() {
    return Array.from(registry.values()).map(gate => gate.getState());
  }

  global.addEventListener("vnv:admin-lock", () => lockAll("admin-lock"));
  global.addEventListener("pagehide", () => {
    registry.forEach(gate => {
      if (!gate.isUnlocked()) return;
      gate._touchActivity();
    });
  });

  global.AdminVaultGate = Object.freeze({
    version: VERSION,
    create,
    get,
    lockAll,
    list,
    cleanCode,
    isValidCode
  });
})(window);
