import { normalSample } from '../core/seeded-rng.js';

const ACTIVITIES = [
  {
    id: 'quick-skill-drill',
    label: 'Quick Skill Drill',
    minutes: 10,
    cognitiveLoad: 0.32,
    challenge: 0.34,
    engagement: 0.46,
    transfer: 0.38,
    feedbackSpeed: 0.96,
    baseGain: 0.34,
    variability: 0.10
  },
  {
    id: 'guided-mini-lesson',
    label: 'Guided Mini-Lesson',
    minutes: 24,
    cognitiveLoad: 0.52,
    challenge: 0.48,
    engagement: 0.58,
    transfer: 0.62,
    feedbackSpeed: 0.78,
    baseGain: 0.56,
    variability: 0.12
  },
  {
    id: 'strategy-game',
    label: 'Strategy Game Challenge',
    minutes: 20,
    cognitiveLoad: 0.56,
    challenge: 0.58,
    engagement: 0.94,
    transfer: 0.70,
    feedbackSpeed: 0.86,
    baseGain: 0.52,
    variability: 0.20
  },
  {
    id: 'reflection-writing',
    label: 'Reflection and Explanation',
    minutes: 16,
    cognitiveLoad: 0.43,
    challenge: 0.44,
    engagement: 0.54,
    transfer: 0.82,
    feedbackSpeed: 0.62,
    baseGain: 0.45,
    variability: 0.11
  },
  {
    id: 'project-challenge',
    label: 'Applied Project Challenge',
    minutes: 45,
    cognitiveLoad: 0.82,
    challenge: 0.84,
    engagement: 0.86,
    transfer: 0.98,
    feedbackSpeed: 0.35,
    baseGain: 0.78,
    variability: 0.24
  }
];

function clamp(value, low = 0, high = 1) {
  return Math.max(low, Math.min(high, value));
}

function band(value, lowLabel, midLabel, highLabel) {
  if (value < 0.34) return lowLabel;
  if (value < 0.68) return midLabel;
  return highLabel;
}

export function createLearningPathProblem(input = {}) {
  const mastery = {
    numeracy: clamp(Number(input.numeracy ?? 0.55)),
    reading: clamp(Number(input.reading ?? 0.62)),
    reasoning: clamp(Number(input.reasoning ?? 0.48))
  };
  const gap = 1 - Math.min(mastery.numeracy, mastery.reading, mastery.reasoning);
  const weakestSkill = Object.entries(mastery).sort((a, b) => a[1] - b[1])[0][0];
  const energy = clamp(Number(input.energy ?? 0.62));
  const challengePreference = clamp(Number(input.challengePreference ?? 0.58));
  const timeAvailable = Math.max(5, Number(input.timeAvailable ?? 30));
  const engagementPreference = clamp(Number(input.engagementPreference ?? 0.72));

  const actions = ACTIVITIES.map(activity => {
    const timeFit = clamp(1 - Math.max(0, activity.minutes - timeAvailable) / Math.max(10, activity.minutes));
    const energyFit = clamp(1 - Math.abs(activity.cognitiveLoad - energy));
    const challengeFit = clamp(1 - Math.abs(activity.challenge - challengePreference));
    const gapFit = clamp(activity.baseGain * (0.55 + gap * 0.75));
    const engagementFit = clamp(1 - Math.abs(activity.engagement - engagementPreference));
    return {
      ...activity,
      features: {
        gapFit,
        timeFit,
        energyFit,
        challengeFit,
        engagementFit,
        transfer: activity.transfer,
        feedbackSpeed: activity.feedbackSpeed
      }
    };
  });

  return {
    id: `learning-path-${weakestSkill}`,
    domainId: 'assessment.learning-path',
    type: 'decision',
    strategy: 'hybrid',
    context: {
      weakestSkill,
      energyBand: band(energy, 'low', 'steady', 'high'),
      timeBand: timeAvailable < 18 ? 'short' : timeAvailable < 35 ? 'medium' : 'long',
      challengeBand: band(challengePreference, 'gentle', 'balanced', 'ambitious')
    },
    learnerSnapshot: { mastery, weakestSkill, energy, timeAvailable, challengePreference },
    weights: {
      gapFit: 1.0,
      timeFit: 0.92,
      energyFit: 0.78,
      challengeFit: 0.72,
      engagementFit: 0.68,
      transfer: 0.62,
      feedbackSpeed: 0.44
    },
    memoryWeight: 0.20,
    actions,
    hardConstraints: [
      {
        id: 'time-limit',
        message: 'The activity requires more time than is available.',
        test: action => action.minutes <= timeAvailable + 5
      },
      {
        id: 'energy-safety',
        message: 'The activity is too demanding for the current energy level.',
        test: action => energy >= 0.36 || action.cognitiveLoad <= 0.58
      }
    ],
    simulate(action, rng) {
      const fatiguePenalty = Math.max(0, action.cognitiveLoad - energy) * 0.42;
      const mismatchPenalty = Math.abs(action.challenge - challengePreference) * 0.25;
      const timePenalty = Math.max(0, action.minutes - timeAvailable) / Math.max(10, action.minutes);
      const engagementBoost = (1 - Math.abs(action.engagement - engagementPreference)) * 0.18;
      const expected = action.baseGain * (0.65 + gap * 0.55)
        + action.transfer * 0.16
        + engagementBoost
        - fatiguePenalty
        - mismatchPenalty
        - timePenalty;
      return clamp(normalSample(rng, expected, action.variability), -1, 1);
    }
  };
}
