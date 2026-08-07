import { summarizeProgress } from "../core/progress-summarizer.js";

const DEFAULT_ALLOWED = new Set([
  "learning-summary",
  "completed-activities",
  "resource-history",
  "structured-feedback",
  "learner-preferences"
]);

export class FamilyMentorBridge {
  constructor({ approvedSharedFields } = {}) {
    this.allowed = new Set(
      Array.isArray(approvedSharedFields) ? approvedSharedFields : [...DEFAULT_ALLOWED]
    );
  }

  buildChildSummary(data = {}) {
    const summary = summarizeProgress(data);
    return {
      ...summary,
      sharingScope: [...this.allowed],
      excludedByDesign: [
        "free-form private child conversation",
        "psychological inference",
        "diagnosis",
        "unstructured feelings transcript"
      ]
    };
  }
}
