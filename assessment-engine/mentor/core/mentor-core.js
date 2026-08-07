import { normalizeLearnerContext } from "./learner-context.js";
import { createMentorIdentity } from "./mentor-identity.js";
import { ResourceResolver } from "../registry/resource-resolver.js";
import { MentorSearch } from "../search/mentor-search.js";
import { InteractionGuard } from "../safety/interaction-guard.js";

export class MentorCore {
  constructor({ registry, learner, role = "student", identity, safety } = {}) {
    this.registry = registry;
    this.learner = normalizeLearnerContext(learner);
    this.role = role;
    this.identity = createMentorIdentity(identity || {
      styleId: this.learner.mentorStyleId
    });
    this.resolver = new ResourceResolver({ registry });
    this.search = new MentorSearch({
      registry,
      learner: this.learner,
      role
    });
    this.guard = safety || new InteractionGuard({ stage: this.learner.stage, role });
  }

  // Backward-compatible low-level resource lookup.
  async findResources(query, options = {}) {
    return this.resolver.resolve({
      query,
      learner: this.learner,
      role: this.role,
      ...options
    });
  }

  // New policy-aware, explainable, Sovereign-ranked search.
  async searchResources(query, options = {}) {
    return this.search.search(query, {
      learner: this.learner,
      role: this.role,
      ...options
    });
  }

  recordResourceOutcome({ reward = 0, label = "" } = {}) {
    return this.search.recordOutcome({ reward, label });
  }

  handleSafetySignal(signal) {
    return this.guard.evaluate(signal);
  }

  getContext() {
    return {
      learner: this.learner,
      role: this.role,
      mentor: this.identity
    };
  }
}
