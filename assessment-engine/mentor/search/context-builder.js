export function buildSearchContext({
  query,
  intent,
  learner,
  role = "student",
  familyPreferences = [],
  currentRepository = "",
  currentCourseRepository = "",
  currentSchoolRepository = "",
  favoriteResourceIds = [],
  recentResourceIds = [],
  preferredDomains = [],
  preferredMinutes,
  accountAware = false,
  explicitAdultOptIn = false,
  freshnessEvidence = {}
} = {}) {
  const sourcePriorityByRepository = {};

  if (currentRepository) sourcePriorityByRepository[currentRepository] = 6;
  if (currentCourseRepository) sourcePriorityByRepository[currentCourseRepository] = 5;
  if (currentSchoolRepository) sourcePriorityByRepository[currentSchoolRepository] = 4;

  return {
    query: String(query || ""),
    intent: intent || {},
    learner: learner || {},
    role,
    familyPreferences: [...new Set(familyPreferences || [])],
    favoriteResourceIds: [...new Set(favoriteResourceIds || [])],
    recentResourceIds: [...new Set(recentResourceIds || [])],
    preferredDomains: [...new Set(preferredDomains || [])],
    intentDomains: [...new Set(intent?.domains || [])],
    sourcePriorityByRepository,
    preferredMinutes: preferredMinutes ?? learner?.preferredMinutes,
    accountAware: accountAware || intent?.accountAware === true,
    explicitAdultOptIn,
    explicitPreferenceTags: [...new Set(intent?.explicitPreferenceTags || [])],
    freshnessEvidence: freshnessEvidence || {}
  };
}
