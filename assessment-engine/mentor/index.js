export { MentorCore } from "./core/mentor-core.js";
export { normalizeLearnerContext } from "./core/learner-context.js";
export { normalizeFamilyContext } from "./core/family-context.js";
export { createMentorIdentity, EMBEDDED_MENTORS } from "./core/mentor-identity.js";
export { normalizeAvatarProfile } from "./core/avatar-profile.js";
export { summarizeProgress } from "./core/progress-summarizer.js";
export { getRolePermissions, can } from "./core/permissions.js";

export { ChildMentor } from "./family/child-mentor.js";
export { ParentMentor } from "./family/parent-mentor.js";
export { FamilyMentorBridge } from "./family/family-mentor-bridge.js";
export { buildParentProgressView } from "./family/parent-progress-view.js";

export { ResourceRegistry } from "./registry/resource-registry.js";
export { ResourceResolver } from "./registry/resource-resolver.js";
export { rankResources } from "./registry/resource-ranker.js";

export { classifyRepository } from "./discovery/repository-classifier.js";
export { discoverRepositories } from "./discovery/repository-discovery.js";

export { AGE_POLICIES, resourceAllowedForStage } from "./safety/age-policy.js";
export { RESPECTFUL_USE_POLICY } from "./safety/respectful-use-policy.js";
export { InteractionGuard } from "./safety/interaction-guard.js";
export { EscalationController } from "./safety/escalation-controller.js";
export { validateGuardianRelease } from "./safety/guardian-release.js";
