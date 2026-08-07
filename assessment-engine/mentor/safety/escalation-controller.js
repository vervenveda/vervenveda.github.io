export class EscalationController {
  next({ stage = "preschool", role = "student", severity = "low", repeated = false } = {}) {
    const young = ["preschool", "kindergarten", "elementary"].includes(stage);

    if (young && role === "student") {
      if (severity === "high" || repeated) return "pause-and-require-grownup";
      return "gentle-redirect";
    }

    if (severity === "high") return "pause-interaction";
    if (repeated) return "boundary-warning-and-pause";
    return "boundary-warning";
  }
}
