// Offline v1 source handoff proposal validator. NOT authorization and NOT a transport.
// No GitHub writes, network, filesystem writes or access to protected records.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const policy = JSON.parse(readFileSync(new URL('../contracts/VNV_ACADEMY_ACCOUNT_CLOUD_HANDOFF_V1.json', import.meta.url), 'utf8'));
const FIELDS = Object.freeze(['requestId','contractVersion','purpose','callerRepository','receiverRepository','sourceCommit','sourcePath','sourceSha256','sourceBytes']);
const reject = reason => ({schema:'vnv-academy-handoff-review-v1',status:'HOLD',reason,authorized:false,transfer:false,writeActions:[],accountCloudCommissioned:false});
function policyValid() {
  return policy.schema === 'vnv-academy-account-cloud-handoff-contract-v1' &&
    policy.version === '1.0.0' && policy.status === 'PROPOSAL_SOURCE_ONLY' &&
    policy.transport === 'NONE' && policy.enabled === false &&
    policy.protectedResourceAccess === false && policy.githubSourceWrite === false &&
    policy.automaticSync === false && policy.studentRecordAccess === false &&
    policy.sessionCredentialTransfer === false && policy.runtimeCommissioning === false &&
    policy.caller === 'vervenveda/vervenveda.github.io' &&
    policy.receiver === 'KhaemenesAcademy/Account-Cloud.github.io' &&
    policy.allowedPurpose === 'SOURCE_PROVENANCE_REVIEW' &&
    JSON.stringify(policy.permittedMetadata) === JSON.stringify(FIELDS) &&
    JSON.stringify(policy.approvedSourcePaths) === JSON.stringify(['workflow/README.md','STOS_PUBLIC_BRIDGE.md']);
}

export function reviewHandoffProposal(value) {
  if (!policyValid()) return reject('unrecognized_contract');
  if (value === null || typeof value !== 'object' || Array.isArray(value) ||
    Object.getPrototypeOf(value) !== Object.prototype) return reject('invalid_envelope');
  const keys = Object.keys(value);
  if (keys.length !== FIELDS.length || !keys.every(k=>FIELDS.includes(k)) ||
      !FIELDS.every(k=>Object.hasOwn(value,k))) return reject('unapproved_fields');
  if (typeof value.requestId !== 'string' || !/^[0-9a-f]{32}$/.test(value.requestId) ||
      value.contractVersion !== '1.0.0' || value.purpose !== policy.allowedPurpose ||
      value.callerRepository !== policy.caller || value.receiverRepository !== policy.receiver)
    return reject('identity_or_purpose_mismatch');
  if (typeof value.sourceCommit !== 'string' || !/^[a-f0-9]{40}$/.test(value.sourceCommit) ||
      typeof value.sourceSha256 !== 'string' || !/^[a-f0-9]{64}$/.test(value.sourceSha256) ||
      !policy.approvedSourcePaths.includes(value.sourcePath) ||
      !Number.isSafeInteger(value.sourceBytes) || value.sourceBytes < 0 || value.sourceBytes > 512000)
    return reject('unverified_source_metadata');

  // A well-shaped proposal does not prove hash correctness, authentication,
  // authorization, recipient consent, freshness, non-replay, or commissioning.
  return {schema:'vnv-academy-handoff-review-v1',status:'SHAPE_REVIEW_ONLY',
    reason:'requires_independent_source_and_authority_verification',
    source:{repository:value.callerRepository,path:value.sourcePath,commit:value.sourceCommit,sha256:value.sourceSha256,bytes:value.sourceBytes},
    authorized:false,transfer:false,writeActions:[],accountCloudCommissioned:false};
}
export const HANDOFF_CONTRACT_VERSION = policy.version;
