function words(value) {
  return new Set(
    String(value || "")
      .toLowerCase()
      .normalize("NFKD")
      .split(/[^\p{L}\p{N}]+/u)
      .filter(Boolean)
  );
}

function overlap(a, b) {
  let score = 0;
  for (const item of a) if (b.has(item)) score++;
  return score;
}

function timeFit(minutes, preferredMinutes) {
  if (!Number.isFinite(Number(minutes)) || !Number.isFinite(Number(preferredMinutes))) return 0.5;
  const resourceMinutes = Math.max(1, Number(minutes));
  const target = Math.max(1, Number(preferredMinutes));
  const ratio = Math.min(resourceMinutes, target) / Math.max(resourceMinutes, target);
  return ratio;
}

export function rankResources(resources = [], {
  query = "",
  learner,
  preferredDomains = [],
  intentDomains = [],
  favoriteResourceIds = [],
  recentResourceIds = [],
  sourcePriorityByRepository = {},
  preferredMinutes
} = {}) {
  const q = words(query);
  const interests = words((learner?.interests || []).join(" "));
  const domainPrefs = new Set([...preferredDomains, ...intentDomains]);
  const favorites = new Set(favoriteResourceIds);
  const recent = new Set(recentResourceIds);
  const targetMinutes = preferredMinutes ?? learner?.preferredMinutes;

  return resources
    .map(resource => {
      const text = words([
        resource.title,
        resource.description,
        ...(resource.domains || []),
        ...(resource.skills || []),
        ...(resource.tags || [])
      ].join(" "));

      const queryOverlap = overlap(q, text);
      const interestOverlap = overlap(interests, text);
      const domainMatches = (resource.domains || []).filter(domain => domainPrefs.has(domain)).length;
      const sourcePriority =
        Number(sourcePriorityByRepository?.[resource.repository]) ||
        Number(resource.sourcePriority) ||
        0;
      const fit = timeFit(resource.minutes, targetMinutes);

      let score = 0;
      score += queryOverlap * 5;
      score += interestOverlap * 1.5;
      score += domainMatches * 2;
      score += sourcePriority * 2.5;
      score += fit;
      if (favorites.has(resource.id)) score += 1.25;
      if (recent.has(resource.id)) score -= 0.5;
      if (resource.featured) score += 0.5;

      return {
        ...resource,
        _mentorScore: score,
        _mentorSignals: {
          queryOverlap,
          interestOverlap,
          domainMatches,
          sourcePriority,
          timeFit: fit,
          favorite: favorites.has(resource.id),
          recent: recent.has(resource.id)
        }
      };
    })
    .sort((a, b) => b._mentorScore - a._mentorScore);
}
