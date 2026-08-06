/**
 * Deterministic pseudo-random generator for reproducible simulations.
 * Browser and Node compatible. No dependencies.
 */
export function hashSeed(value = Date.now()) {
  const text = String(value);
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0 || 1;
}

export function createSeededRng(seed = Date.now()) {
  let state = hashSeed(seed);
  return function rng() {
    state += 0x6D2B79F5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomChoice(items, rng = Math.random) {
  if (!Array.isArray(items) || items.length === 0) return undefined;
  return items[Math.floor(rng() * items.length)];
}

export function normalSample(rng = Math.random, mean = 0, deviation = 1) {
  const u1 = Math.max(Number.EPSILON, rng());
  const u2 = Math.max(Number.EPSILON, rng());
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * deviation;
}
