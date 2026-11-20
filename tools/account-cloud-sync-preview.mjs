// VNV ↔ Academy Account Cloud synchronization *preview*.
// Classifies only verified, allowlisted source fingerprints. Never copies, writes,
// requests credentials, proposes mirror operations, or accesses private record data.
import { inspectBoth } from './account-cloud-source-caller.mjs';
import { buildReconciliationManifest } from './account-cloud-reconcile-dry-run.mjs';
import { pathToFileURL } from 'node:url';

const OWNERSHIP = Object.freeze({
  'vnv': Object.freeze({
    'workflow/README.md': Object.freeze({owner:'vnv',purpose:'public-gateway-workflow',decision:'KEEP_SOURCE_ONLY'}),
    'STOS_PUBLIC_BRIDGE.md': Object.freeze({owner:'vnv',purpose:'public-stos-gateway-contract',decision:'KEEP_SOURCE_ONLY'})
  }),
  'academy-account-cloud': Object.freeze({
    'STOS_INTAKE_MANIFEST.json': Object.freeze({owner:'academy-account-cloud',purpose:'private-account-cloud-intake',decision:'KEEP_SOURCE_ONLY'}),
    'contracts/ACCOUNT_CLOUD_PROTOCOL_V2.md': Object.freeze({owner:'academy-account-cloud',purpose:'private-account-continuity-contract',decision:'KEEP_SOURCE_ONLY'})
  })
});
const base = (status,reason) => ({
  schema:'vnv-account-cloud-sync-preview-v1',mode:'READ_ONLY_PREVIEW',
  status,reason,automatedSync:false,transferAuthorized:false,proposedWrites:[],
  sourceOwnerPreserved:true,productionDataIncluded:false,accountCloudCommissioned:false
});
export function buildSourceSyncPreview(manifest) {
  if (!manifest || manifest.schema!=='vnv-academy-source-reconciliation-v1' ||
      manifest.mode!=='DRY_RUN_ONLY' || manifest.status!=='SOURCE_INVENTORY_VERIFIED' ||
      manifest.authorizedTransfer!==false || manifest.accountCloudCommissioned!==false ||
      !Array.isArray(manifest.proposedWrites) || manifest.proposedWrites.length!==0 ||
      !Array.isArray(manifest.repositories) || manifest.repositories.length!==2)
    return base('HOLD','source_manifest_unverified');

  const rows=[];
  const expected=['vnv','academy-account-cloud'];
  for(let i=0;i<expected.length;i++){
    const r=manifest.repositories[i], key=expected[i], cfg=OWNERSHIP[key];
    if(!r || r.target!==key || r.repository!==(key==='vnv'?'vervenveda/vervenveda.github.io':'KhaemenesAcademy/Account-Cloud.github.io') || !cfg || !Array.isArray(r.files) ||
       r.files.length!==Object.keys(cfg).length ||
       !/^[a-f0-9]{40}$/.test(r.commit||''))return base('HOLD','unexpected_repository_inventory');
    for(const f of r.files){
      if(!Object.hasOwn(cfg,f.path) || rows.some(x=>x.repository===r.repository && x.path===f.path) ||
         !/^[a-f0-9]{64}$/.test(f.sha256||'') || !Number.isSafeInteger(f.bytes) || f.bytes<0 || f.bytes>512000)
         return base('HOLD','unexpected_source_file');
      rows.push({repository:r.repository,path:f.path,commit:r.commit,sha256:f.sha256,bytes:f.bytes,...cfg[f.path],copyApproved:false});
    }
  }
  if(rows.length!==4)return base('HOLD','incomplete_source_inventory');

  return {
    ...base('REVIEW_READY','no_equivalent_transfer_mapping'),
    candidates:rows,
    summary:{
      verifiedSourceItems:rows.length,
      vnvOwned:rows.filter(x=>x.owner==='vnv').length,
      academyOwned:rows.filter(x=>x.owner==='academy-account-cloud').length,
      candidateMirrors:0,
      approvedTransfers:0,
      pendingDecision:'Any future shared handoff needs an explicitly approved destination path, data contract, conflict policy, rollback and separate authentication.'
    }
  };
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href){
  if(process.argv.length!==2){process.stderr.write('Usage: node tools/account-cloud-sync-preview.mjs\n');process.exitCode=2;}
  else {
    const report=await inspectBoth();
    const preview=buildSourceSyncPreview(buildReconciliationManifest(report));
    process.stdout.write(JSON.stringify(preview,null,2)+'\n');
    if(preview.status==='HOLD')process.exitCode=1;
  }
}
