import { ResourceRegistry } from "../registry/resource-registry.js";
import { MentorSearch } from "../search/mentor-search.js";

const PRESCHOOL_REPOSITORY = "vervenveda/Khaemenes_Preschool.github.io";

function activityToResource(activity, index) {
  const id = String(activity.id || activity.mentorId || `activity-${index + 1}`);
  const file = String(activity.file || activity.url || "");
  const absoluteUrl = /^https?:\/\//i.test(file)
    ? file
    : `https://vervenveda.com/Khaemenes_Preschool.github.io/${file.replace(/^\/+/, "")}`;

  return {
    id: `preschool.local.${id}`,
    title: String(activity.title || activity.name || "Preschool Activity"),
    description: String(activity.description || ""),
    url: absoluteUrl,
    sourceId: "khaemenes.preschool.local-catalog",
    repository: PRESCHOOL_REPOSITORY,
    classification: "educational",
    audiences: ["preschool"],
    roles: ["student", "parent", "educator"],
    domains: Array.isArray(activity.domains)
      ? activity.domains
      : [activity.domain].filter(Boolean),
    skills: Array.isArray(activity.skills) ? activity.skills : [],
    tags: Array.isArray(activity.tags) ? activity.tags : ["preschool", "guided-learning"],
    minutes: Number.isFinite(Number(activity.minutes)) ? Number(activity.minutes) : 10,
    energy: String(activity.energy || "gentle"),
    featured: Boolean(activity.featured),
    mentorEligible: activity.mentorEligible !== false,
    recommendable: activity.mentorEligible !== false,
    sourcePriority: 7,
    requiresFreshnessCheck: false,
    dynamicContent: false,
    requiresPreferenceMatch: [],
    requiresAccountAwareness: false,
    sensitiveTopics: [],
    externalInformation: false,
    policy: {
      requiresFreshnessCheck: false,
      dynamicContent: false,
      requiresPreferenceMatch: [],
      requiresAccountAwareness: false,
      sensitiveTopics: [],
      externalInformation: false
    }
  };
}

export class PreschoolResourceBridge {
  constructor({
    centralRegistry,
    learner,
    activities = []
  } = {}) {
    const localResources = (activities || [])
      .filter(activity => activity?.mentorEligible !== false)
      .map(activityToResource);

    const centralResources = centralRegistry?.all?.() || [];
    const repositories = centralRegistry?.repositories || [];

    this.registry = new ResourceRegistry({
      resources: [...localResources, ...centralResources],
      repositories
    });

    this.search = new MentorSearch({
      registry: this.registry,
      learner: {
        ...learner,
        stage: "preschool"
      },
      role: "student"
    });
  }

  find(query, options = {}) {
    return this.search.search(query, {
      ...options,
      learner: {
        ...(options.learner || {}),
        stage: "preschool"
      },
      currentRepository: PRESCHOOL_REPOSITORY,
      currentSchoolRepository: PRESCHOOL_REPOSITORY,
      includeConditional: false,
      limit: options.limit || 5
    });
  }

  recordFeedback(label) {
    const rewards = {
      "loved-it": 0.9,
      "just-right": 0.7,
      "too-easy": -0.2,
      "too-hard": -0.15
    };
    const reward = rewards[label] ?? 0;
    return this.search.recordOutcome({ reward, label });
  }
}
