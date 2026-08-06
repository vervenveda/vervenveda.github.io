/**
 * Local-first adaptive memory. It stores bounded action values and outcome counts.
 * It intentionally does not store names, email addresses, or free-form learner text.
 */
export class AgentMemoryStore {
  constructor({ key = 'verve_sovereign_agent_memory_v1', storage } = {}) {
    this.key = key;
    this.storage = storage ?? globalThis?.localStorage ?? null;
    this.state = this.#load();
  }

  #blank() {
    return { version: 1, updatedAt: null, domains: {} };
  }

  #load() {
    if (!this.storage) return this.#blank();
    try {
      const parsed = JSON.parse(this.storage.getItem(this.key) || 'null');
      return parsed && parsed.domains ? parsed : this.#blank();
    } catch {
      return this.#blank();
    }
  }

  #save() {
    this.state.updatedAt = new Date().toISOString();
    if (!this.storage) return;
    try {
      this.storage.setItem(this.key, JSON.stringify(this.state));
    } catch {
      // Storage can be blocked in private browsing or embedded frames.
    }
  }

  static contextKey(context = {}) {
    const stable = Object.entries(context)
      .filter(([, value]) => ['string', 'number', 'boolean'].includes(typeof value))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${String(value)}`)
      .join('|');
    return stable || 'general';
  }

  #entry(domainId, actionId, context = {}) {
    const contextKey = AgentMemoryStore.contextKey(context);
    const domain = (this.state.domains[domainId] ??= { actions: {} });
    const action = (domain.actions[actionId] ??= { contexts: {} });
    return (action.contexts[contextKey] ??= {
      count: 0,
      value: 0,
      positive: 0,
      negative: 0,
      lastReward: 0,
      updatedAt: null
    });
  }

  getBias(domainId, actionId, context = {}) {
    const contextKey = AgentMemoryStore.contextKey(context);
    const entry = this.state.domains?.[domainId]?.actions?.[actionId]?.contexts?.[contextKey];
    if (!entry) return 0;
    const confidence = Math.min(1, Math.log2(entry.count + 1) / 5);
    return entry.value * confidence;
  }

  update(domainId, actionId, reward, context = {}, learningRate = 0.24) {
    const boundedReward = Math.max(-1, Math.min(1, Number(reward) || 0));
    const entry = this.#entry(domainId, actionId, context);
    const alpha = Math.max(0.02, Math.min(1, learningRate / Math.sqrt(entry.count + 1)));
    entry.value += alpha * (boundedReward - entry.value);
    entry.value = Math.max(-1, Math.min(1, entry.value));
    entry.count += 1;
    entry.lastReward = boundedReward;
    if (boundedReward > 0) entry.positive += 1;
    if (boundedReward < 0) entry.negative += 1;
    entry.updatedAt = new Date().toISOString();
    this.#save();
    return { ...entry };
  }

  summary() {
    let domains = 0;
    let actions = 0;
    let observations = 0;
    for (const domain of Object.values(this.state.domains)) {
      domains += 1;
      for (const action of Object.values(domain.actions || {})) {
        actions += 1;
        for (const entry of Object.values(action.contexts || {})) {
          observations += entry.count || 0;
        }
      }
    }
    return { domains, actions, observations, updatedAt: this.state.updatedAt };
  }

  export() {
    return typeof structuredClone === 'function'
      ? structuredClone(this.state)
      : JSON.parse(JSON.stringify(this.state));
  }

  reset() {
    this.state = this.#blank();
    if (this.storage) {
      try { this.storage.removeItem(this.key); } catch { /* noop */ }
    }
  }
}
