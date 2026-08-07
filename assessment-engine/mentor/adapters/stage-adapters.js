const BASE = {
  allowCustomAvatar: true,
  requireRoleFilter: true,
  requireResourcePolicy: true
};

export const STAGE_ADAPTERS = Object.freeze({
  preschool: {
    ...BASE,
    guidedInteractionOnly: true,
    openChat: false,
    guardianReleaseRequired: true,
    nearbyAdultExpected: true,
    defaultMinutes: 20
  },
  kindergarten: {
    ...BASE,
    guidedInteractionOnly: true,
    openChat: false,
    guardianReleaseRequired: true,
    nearbyAdultExpected: true,
    defaultMinutes: 25
  },
  elementary: {
    ...BASE,
    guidedInteractionOnly: false,
    openChat: false,
    guardianReleaseRequired: true,
    nearbyAdultExpected: false,
    defaultMinutes: 35
  },
  middle: {
    ...BASE,
    guidedInteractionOnly: false,
    openChat: false,
    guardianReleaseRequired: true,
    nearbyAdultExpected: false,
    defaultMinutes: 45
  },
  high: {
    ...BASE,
    guidedInteractionOnly: false,
    openChat: false,
    guardianReleaseRequired: false,
    nearbyAdultExpected: false,
    defaultMinutes: 50
  },
  "higher-learning": {
    ...BASE,
    guidedInteractionOnly: false,
    openChat: false,
    guardianReleaseRequired: false,
    nearbyAdultExpected: false,
    defaultMinutes: 60
  }
});

export function getStageAdapter(stage) {
  return STAGE_ADAPTERS[stage] || STAGE_ADAPTERS.preschool;
}
