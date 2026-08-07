import { MentorCore } from "../core/mentor-core.js";

export class ChildMentor extends MentorCore {
  constructor(options = {}) {
    super({ ...options, role: "student" });
  }

  async suggestNext(query = "What should I learn next?", options = {}) {
    return this.findResources(query, {
      limit: options.limit || 5,
      preferredDomains: options.preferredDomains || []
    });
  }
}
