import { normalizeLearnerContext } from "./learner-context.js";
import { createMentorIdentity } from "./mentor-identity.js";
import { ResourceResolver } from "../registry/resource-resolver.js";
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
    this.guard = safety || new InteractionGuard({ stage: this.learner.stage, role });
  }

  async findResources(query, options = {}) {
    return this.resolver.resolve({
      query,
      learner: this.learner,
      role: this.role,
      ...options
    });
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
