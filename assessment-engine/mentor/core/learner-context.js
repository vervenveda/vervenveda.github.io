const STAGES = [
  "preschool",
  "kindergarten",
  "elementary",
  "middle",
  "high",
  "higher-learning",
  "adult"
];

export function normalizeLearnerContext(value = {}) {
  const interests = Array.isArray(value.interests)
    ? [...new Set(value.interests.map(String).map(v => v.trim()).filter(Boolean))].slice(0, 24)
    : [];

  return {
    learnerId: String(value.learnerId || value.id || "").trim(),
    nickname: String(value.nickname || "").trim().slice(0, 32),
    stage: STAGES.includes(value.stage) ? value.stage : "preschool",
    ageBand: String(value.ageBand || "").trim().slice(0, 24),
    interests,
    pace: ["gentle", "balanced", "brisk"].includes(value.pace) ? value.pace : "balanced",
    preferredMinutes: Number.isFinite(Number(value.preferredMinutes ?? value.minutes))
      ? Math.max(5, Math.min(180, Number(value.preferredMinutes ?? value.minutes)))
      : 30,
    pathway: String(value.pathway || "khaemenes").trim().slice(0, 64),
    mentorStyleId: String(value.mentorStyleId || value.mentorId || "pip").toLowerCase(),
    updatedAt: value.updatedAt || new Date().toISOString()
  };
}
