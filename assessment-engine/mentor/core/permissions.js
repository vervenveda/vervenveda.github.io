const PERMISSIONS = Object.freeze({
  student: new Set([
    "mentor:interact",
    "resource:recommend",
    "progress:self",
    "avatar:self"
  ]),
  parent: new Set([
    "mentor:interact",
    "resource:recommend",
    "progress:child-summary",
    "family:navigate",
    "release:review",
    "data:export",
    "data:erase"
  ]),
  educator: new Set([
    "mentor:interact",
    "resource:recommend",
    "progress:authorized-summary"
  ]),
  admin: new Set(["*"])
});

export function getRolePermissions(role = "student") {
  return new Set(PERMISSIONS[role] || PERMISSIONS.student);
}

export function can(role, capability) {
  const permissions = PERMISSIONS[role] || PERMISSIONS.student;
  return permissions.has("*") || permissions.has(capability);
}
