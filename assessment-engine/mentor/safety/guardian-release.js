export const CURRENT_GUARDIAN_RELEASE = Object.freeze({
  id: "preschool-mentor-release-v1.0",
  attribution: "Jennifer Kay Pearl · Verve N Veda · Khaemenes Academy"
});

export function validateGuardianRelease(release, {
  requiredVersion = CURRENT_GUARDIAN_RELEASE.id
} = {}) {
  if (!release || release.accepted !== true) return false;
  if (release.version !== requiredVersion) return false;

  return [
    "adultAuthority",
    "educationalToolNotice",
    "parentalResponsibility",
    "aiMentorBoundaries",
    "respectfulUsePolicy",
    "voluntaryUseAndLimits",
    "localPrivacyControls"
  ].every(key => release[key] === true);
}
