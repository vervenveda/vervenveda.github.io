const DEFAULT_ROLES = Object.freeze(["student", "parent", "educator"]);

export function cleanArray(value) {
  return Array.isArray(value)
    ? [...new Set(value.map(String).map(item => item.trim()).filter(Boolean))]
    : [];
}

function finiteNumber(value, fallback = null) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function booleanValue(value, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

export function normalizeMentorResource(resource, repoRecord, manifest, index = 0) {
  const localId = String(resource?.id || `resource-${index + 1}`).trim();
  const owner = String(repoRecord?.owner || "unknown").toLowerCase();
  const repoName = String(repoRecord?.name || "repository").toLowerCase();
  const id = localId.includes(":") ? localId : `${owner}.${repoName}.${localId}`;

  const classification = String(
    resource?.classification ||
    manifest?.classification ||
    repoRecord?.classification ||
    "unclassified"
  );

  const resourceRoles = cleanArray(resource?.roles?.length ? resource.roles : manifest?.roles);
  const requiresPreferenceMatch = cleanArray(resource?.requiresPreferenceMatch);
  const sensitiveTopics = cleanArray(resource?.sensitiveTopics);
  const policyTags = cleanArray(resource?.policyTags);

  const requiresFreshnessCheck = booleanValue(resource?.requiresFreshnessCheck);
  const dynamicContent = booleanValue(resource?.dynamicContent);
  const requiresAccountAwareness = booleanValue(resource?.requiresAccountAwareness);
  const externalInformation = booleanValue(
    resource?.externalInformation,
    requiresFreshnessCheck || dynamicContent ||
      ["research-information", "civic"].includes(classification)
  );

  const normalized = {
    id,
    title: String(resource?.title || manifest?.name || repoRecord?.name || "Resource"),
    description: String(resource?.description || ""),
    url: String(resource?.url || manifest?.homepage || repoRecord?.homepage || repoRecord?.htmlUrl || ""),
    sourceId: String(manifest?.sourceId || `github:${repoRecord?.fullName?.toLowerCase?.() || "unknown"}`),
    repository: String(repoRecord?.fullName || manifest?.repository || ""),
    classification,
    audiences: cleanArray(resource?.audiences?.length ? resource.audiences : manifest?.audiences),
    roles: resourceRoles.length ? resourceRoles : [...DEFAULT_ROLES],
    domains: cleanArray(resource?.domains),
    skills: cleanArray(resource?.skills),
    tags: cleanArray(resource?.tags),
    minutes: finiteNumber(resource?.minutes),
    energy: String(resource?.energy || ""),
    featured: booleanValue(resource?.featured),
    mentorEligible: resource?.mentorEligible !== false,
    recommendable:
      manifest?.mentorSearchable === true &&
      resource?.mentorEligible !== false &&
      !["admin-only", "restricted", "unclassified", "archived"].includes(classification),
    explicitAdultOptIn: booleanValue(resource?.explicitAdultOptIn),

    // Resource-policy metadata retained end-to-end.
    requiresFreshnessCheck,
    dynamicContent,
    requiresPreferenceMatch,
    requiresAccountAwareness,
    sensitiveTopics,
    externalInformation,
    sourcePriority: finiteNumber(resource?.sourcePriority, 0),
    freshnessWindowMinutes: finiteNumber(resource?.freshnessWindowMinutes),
    contentType: String(resource?.contentType || ""),
    policyTags,
    requiresExplicitQuery: booleanValue(resource?.requiresExplicitQuery),

    // One nested policy object gives future consumers a stable access point.
    policy: {
      requiresFreshnessCheck,
      dynamicContent,
      requiresPreferenceMatch,
      requiresAccountAwareness,
      sensitiveTopics,
      externalInformation,
      requiresExplicitQuery: booleanValue(resource?.requiresExplicitQuery),
      policyTags
    },

    manifestPath: "mentor-manifest.json"
  };

  return normalized;
}
