import { MentorCore } from "../core/mentor-core.js";

export class ParentMentor extends MentorCore {
  constructor(options = {}) {
    super({
      ...options,
      role: "parent",
      identity: options.identity || {
        styleId: "sage",
        avatar: { mode: "custom", name: "Family Guide", emoji: "✦", colors: ["#0f172a", "#c5a35d"] }
      }
    });
  }

  async findFamilyResource(query, options = {}) {
    return this.findResources(query, {
      ...options,
      limit: options.limit || 8,
      includeAdultResources: true
    });
  }
}
