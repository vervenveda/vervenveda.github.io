export const DISCOVERY_POLICY = Object.freeze({
  manifestFilename: "mentor-manifest.json",
  adminPatterns: [
    /^admin(?:\.github\.io)?$/i,
    /^vervenveda-admin/i,
    /admin[-_ ]?hub/i,
    /internal/i,
    /private[-_ ]?ops/i
  ],
  educationalPatterns: [
    /khaemenes/i,
    /grade[-_ ]?\d+/i,
    /math/i,
    /science/i,
    /language/i,
    /linguistic/i,
    /curriculum/i,
    /academy/i,
    /preschool/i,
    /elementary/i,
    /middle/i,
    /higher[-_ ]?learning/i
  ],
  creativePatterns: [
    /arshif/i,
    /bazaar/i,
    /art/i,
    /refrain/i,
    /music/i,
    /creative/i
  ],
  wellnessPatterns: [
    /aurora/i,
    /meditat/i,
    /sanctuary/i,
    /wellness/i,
    /reflection/i
  ],
  civicPatterns: [
    /one[-_ ]?nation/i,
    /civic/i,
    /voter/i
  ],
  researchPatterns: [
    /verifier/i,
    /plera[-_ ]?search/i,
    /search/i,
    /research/i
  ],
  professionalPatterns: [
    /proresource/i,
    /finance/i,
    /career/i,
    /professional/i
  ]
});
