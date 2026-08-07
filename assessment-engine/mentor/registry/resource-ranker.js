function words(value) {
  return new Set(
    String(value || "")
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean)
  );
}

function overlap(a, b) {
  let score = 0;
  for (const item of a) if (b.has(item)) score++;
  return score;
}

export function rankResources(resources = [], {
  query = "",
  learner,
  preferredDomains = [],
  favoriteResourceIds = [],
  recentResourceIds = []
} = {}) {
  const q = words(query);
  const interests = words((learner?.interests || []).join(" "));
  const domainPrefs = new Set(preferredDomains);
  const favorites = new Set(favoriteResourceIds);
  const recent = new Set(recentResourceIds);

  return resources
    .map(resource => {
      const text = words([
        resource.title,
        resource.description,
        ...(resource.domains || []),
        ...(resource.skills || []),
        ...(resource.tags || [])
      ].join(" "));

      let score = 0;
      score += overlap(q, text) * 5;
      score += overlap(interests, text) * 1.5;
      score += (resource.domains || []).filter(d => domainPrefs.has(d)).length * 2;
      if (favorites.has(resource.id)) score += 1.25;
      if (recent.has(resource.id)) score -= 0.5;
      if (resource.featured) score += 0.5;
      if (resource.sourcePriority) score += Number(resource.sourcePriority) || 0;

      return { ...resource, _mentorScore: score };
    })
    .sort((a, b) => b._mentorScore - a._mentorScore);
}
