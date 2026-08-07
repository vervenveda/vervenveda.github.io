import { normalizeAvatarProfile } from "./avatar-profile.js";

export const EMBEDDED_MENTORS = Object.freeze({
  pip: {
    id: "pip",
    name: "Pip",
    emoji: "🌞",
    style: "playful",
    colors: ["#fb7185", "#fbbf24"]
  },
  miri: {
    id: "miri",
    name: "Miri",
    emoji: "🦉",
    style: "curious",
    colors: ["#2563eb", "#22d3ee"]
  },
  nova: {
    id: "nova",
    name: "Nova",
    emoji: "🚀",
    style: "imaginative",
    colors: ["#7c3aed", "#ec4899"]
  },
  sage: {
    id: "sage",
    name: "Sage",
    emoji: "🌿",
    style: "steady",
    colors: ["#16a34a", "#84cc16"]
  }
});

export function createMentorIdentity({ styleId = "pip", avatar } = {}) {
  const style = EMBEDDED_MENTORS[styleId] || EMBEDDED_MENTORS.pip;
  const custom = normalizeAvatarProfile(avatar);

  if (custom.mode === "custom" && custom.name) {
    return {
      id: `custom:${style.id}`,
      name: custom.name,
      emoji: custom.emoji || style.emoji,
      colors: custom.colors,
      underlyingStyleId: style.id,
      communicationStyle: style.style,
      custom: true
    };
  }

  return {
    ...style,
    underlyingStyleId: style.id,
    communicationStyle: style.style,
    custom: false
  };
}
