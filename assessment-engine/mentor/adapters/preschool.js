import { getStageAdapter } from "./stage-adapters.js";
export { PreschoolResourceBridge } from "./preschool-resource-bridge.js";

export const policy = Object.freeze(getStageAdapter("preschool"));
export default policy;
