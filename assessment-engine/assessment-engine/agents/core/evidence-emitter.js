function makeId(prefix = 'evt') {
  const cryptoObj = globalThis?.crypto;
  if (cryptoObj?.randomUUID) return `${prefix}_${cryptoObj.randomUUID()}`;
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export class EvidenceEmitter {
  constructor({ sourceApp = 'verve.sovereign-agent', learnerId = 'local-anonymous' } = {}) {
    this.sourceApp = sourceApp;
    this.learnerId = learnerId;
    this.events = [];
  }

  emit(type, payload = {}) {
    const event = {
      id: makeId('agent'),
      schemaVersion: '1.0.0',
      type,
      sourceApp: this.sourceApp,
      learnerId: this.learnerId,
      occurredAt: new Date().toISOString(),
      formalGradeEligible: false,
      ...payload
    };
    this.events.push(event);
    return event;
  }

  export({ clear = false } = {}) {
    const bundle = {
      schemaVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      sourceApp: this.sourceApp,
      events: this.events.map(event => ({ ...event }))
    };
    if (clear) this.events = [];
    return bundle;
  }

  clear() {
    this.events = [];
  }
}
