import { RESPECTFUL_USE_POLICY } from "./respectful-use-policy.js";

export class InteractionGuard {
  constructor({ stage = "preschool", role = "student" } = {}) {
    this.stage = stage;
    this.role = role;
    this.strikes = 0;
  }

  evaluate(signal = {}) {
    const category = String(signal.category || "");
    const prohibited = RESPECTFUL_USE_POLICY.prohibitedSignals.includes(category);

    if (!prohibited) {
      return { allowed: true, action: "continue", strikes: this.strikes };
    }

    this.strikes += 1;
    const young = ["preschool", "kindergarten", "elementary"].includes(this.stage);

    if (young) {
      if (this.strikes === 1) {
        return {
          allowed: false,
          action: "gentle-redirect",
          message: "Those words or actions are not for our learning room. Let's choose something kind and safe instead.",
          strikes: this.strikes
        };
      }
      return {
        allowed: false,
        action: "pause-and-invite-grownup",
        message: "Let's pause this Mentor activity and ask a nearby grown-up to help us continue.",
        strikes: this.strikes
      };
    }

    if (this.strikes === 1) {
      return {
        allowed: false,
        action: "boundary-warning",
        message: "This interaction conflicts with the Mentor respectful-use policy.",
        strikes: this.strikes
      };
    }

    return {
      allowed: false,
      action: "pause-interaction",
      message: "Mentor interaction is paused because the respectful-use boundary was repeatedly crossed.",
      strikes: this.strikes
    };
  }
}
