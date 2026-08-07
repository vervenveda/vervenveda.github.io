export function normalizeFamilyContext(value = {}) {
  const learnerIds = Array.isArray(value.learnerIds)
    ? [...new Set(value.learnerIds.map(String).filter(Boolean))]
    : [];

  return {
    version: 1,
    familyId: String(value.familyId || "").trim(),
    activeLearnerId: String(value.activeLearnerId || learnerIds[0] || "").trim(),
    learnerIds,
    parentMentorId: String(value.parentMentorId || "family-guide"),
    approvedSharedFields: Array.isArray(value.approvedSharedFields)
      ? [...new Set(value.approvedSharedFields.map(String))]
      : [
          "learning-summary",
          "completed-activities",
          "resource-history",
          "structured-feedback",
          "learner-preferences"
        ],
    updatedAt: value.updatedAt || new Date().toISOString()
  };
}
