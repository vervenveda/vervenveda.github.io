const SAFE_NAME = /^[\p{L}\p{N}][\p{L}\p{N} .'\-]{0,23}$/u;
const HEX = /^#[0-9a-f]{6}$/i;

function safeColor(value, fallback) {
  return typeof value === "string" && HEX.test(value) ? value : fallback;
}

export function normalizeAvatarProfile(value = {}) {
  const name = String(value.name || "").trim();
  return {
    mode: value.mode === "custom" ? "custom" : "embedded",
    name: SAFE_NAME.test(name) ? name : "",
    emoji: typeof value.emoji === "string" ? value.emoji.slice(0, 8) : "",
    colors: [
      safeColor(value.colors?.[0], "#7c3aed"),
      safeColor(value.colors?.[1], "#22d3ee")
    ],
    accessory: ["none", "star", "leaf", "glasses", "hat"].includes(value.accessory)
      ? value.accessory
      : "none"
  };
}
