// Source-only dry-run review of the VNV and Academy Account Cloud fingerprints.
// No file contents, GitHub writes, storage access, or copy instructions.
import { inspectBoth } from './account-cloud-source-caller.mjs';
import { pathToFileURL } from 'node:url';

const EXPECTED = Object.freeze({
  vnv: Object.freeze({repo:'vervenveda/vervenveda.github.io',paths:['workflow/README.md','STOS_PUBLIC_BRIDGE.md']}),
  'academy-account-cloud': Object.freeze({repo:'KhaemenesAcademy/Account-Cloud.github.io',paths:['STOS_INTAKE_MANIFEST.json','contracts/ACCOUNT_CLOUD_PROTOCOL_V2.md']})
});
const SHA40 = /^[0-9a-f]{40}$/, SHA64 = /^[0-9a-f]{64}$/;
function validEntry(entry, expected) {
  return entry && entry.repository === expected.repo && SHA40.test(entry.commit || '') &&
    entry.result === 'READ_ONLY_VERIFIED' && Array.isArray(entry.files) && entry.files.length === expected.paths.length &&
    entry.files.every((f,i) => f.path === expected.paths[i] && Number.isSafeInteger(f.bytes) && f.bytes >= 0 && f.bytes <= 512000 && SHA64.test(f.sha256 || ''));
}
export function buildReconciliationManifest(report) {
  const deny = reason => ({
    schema:'vnv-academy-source-reconciliation-v1',mode:'DRY_RUN_ONLY',status:'HOLD',reason,
    authorizedTransfer:false,proposedWrites:[],accountCloudCommissioned:false
  });
  if (!report || report.schema !== 'vnv-academy-source-caller-report-v1' || report.mode !== 'READ_ONLY_NO_SYNC' ||
    report.bothReadable !== true || report.authorizedTransfer !== false || report.accountCloudCommissioned !== false ||
    !Array.isArray(report.repositories) || report.repositories.length !== 2) return deny('read_evidence_incomplete');
  const [vnv,academy]=report.repositories;
  if (vnv.target !== 'vnv' || academy.target !== 'academy-account-cloud' ||
    !validEntry(vnv,EXPECTED.vnv) || !validEntry(academy,EXPECTED['academy-account-cloud'])) return deny('untrusted_inventory');
  return {
    schema:'vnv-academy-source-reconciliation-v1',mode:'DRY_RUN_ONLY',status:'SOURCE_INVENTORY_VERIFIED',
    interpretation:'Distinct source contracts; no equivalent paths or transfer mappings approved. No equality or sync inferred.',
    repositories:[vnv,academy].map(r=>({target:r.target,repository:r.repository,branch:r.branch,commit:r.commit,files:r.files.map(f=>({...f}))})),
    comparison:{equivalentPathMappings:0,contentComparison:'NOT_APPLICABLE',proposedPromotions:0},
    authorizedTransfer:false,proposedWrites:[],accountCloudCommissioned:false
  };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.length!==2) { process.stderr.write('Usage: node tools/account-cloud-reconcile-dry-run.mjs\n'); process.exitCode=2; }
  else { const manifest=buildReconciliationManifest(await inspectBoth()); process.stdout.write(JSON.stringify(manifest,null,2)+'\n'); if(manifest.status==='HOLD')process.exitCode=1; }
}
