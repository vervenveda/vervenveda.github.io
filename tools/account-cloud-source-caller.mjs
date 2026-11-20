// VNV -> Academy Account Cloud source caller v0.1 (strictly read-only).
// No browser execution, no GitHub writes, no STOS access, no production account data.
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

export const TARGETS = Object.freeze([
  Object.freeze({ name: 'vnv', repo: 'vervenveda/vervenveda.github.io', tokenEnv: 'VNV_GITHUB_TOKEN', paths: Object.freeze(['workflow/README.md', 'STOS_PUBLIC_BRIDGE.md']) }),
  Object.freeze({ name: 'academy-account-cloud', repo: 'KhaemenesAcademy/Account-Cloud.github.io', tokenEnv: 'ACADEMY_GITHUB_TOKEN', paths: Object.freeze(['STOS_INTAKE_MANIFEST.json', 'contracts/ACCOUNT_CLOUD_PROTOCOL_V2.md']) })
]);
const API = 'https://api.github.com';
function sha256(data) { return createHash('sha256').update(data).digest('hex'); }
function assertSha(v) { if (!/^[a-f0-9]{40}$/.test(v)) throw Error('invalid_commit_sha'); return v; }
function assertRepo(v, expected) { if (!v || v.full_name !== expected || !v.default_branch || v.archived === true) throw Error('repository_identity_mismatch'); }
function apiPath(repo, suffix) { return `${API}/repos/${repo}/${suffix}`; }
function sanitizeError(err) {
  // Never emit raw upstream errors: URLs, headers or response bodies could include secrets.
  return (err instanceof Error && /^[a-z_]+$/.test(err.message)) ? err.message : 'request_failed';
}
export async function inspectTarget(target, { fetchImpl = fetch, token = '' } = {}) {
  if (!TARGETS.some(t => t === target)) throw Error('target_not_allowlisted');
  const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'vnv-academy-source-caller/0.1' };
  if (token) headers.Authorization = `Bearer ${token}`;
  async function get(suffix) {
    const response = await fetchImpl(apiPath(target.repo, suffix), { method: 'GET', headers, redirect: 'error' });
    if (!response || !response.ok) throw Error(response?.status === 401 || response?.status === 403 || response?.status === 404 ? 'access_or_resource_unavailable' : 'remote_read_failed');
    return response.json();
  }
  const metadata = await get('');
  assertRepo(metadata, target.repo);
  const branch = encodeURIComponent(metadata.default_branch);
  const ref = await get(`git/ref/heads/${branch}`);
  const commit = assertSha(ref?.object?.sha);
  const entries = [];
  for (const path of target.paths) {
    const encoded = path.split('/').map(encodeURIComponent).join('/');
    const item = await get(`contents/${encoded}?ref=${commit}`);
    if (item?.type !== 'file' || item.encoding !== 'base64' || typeof item.content !== 'string') throw Error('non_file_or_unreadable_source');
    const data = Buffer.from(item.content.replace(/\s/g, ''), 'base64');
    if (data.length !== item.size || data.length > 512000) throw Error('source_size_mismatch');
    entries.push({ path, bytes: data.length, sha256: sha256(data) });
  }
  return { target: target.name, repository: target.repo, visibility: metadata.private === true ? 'private' : 'public', branch: metadata.default_branch, commit, files: entries, result: 'READ_ONLY_VERIFIED' };
}
export async function inspectBoth({ fetchImpl = fetch, env = process.env } = {}) {
  const results = [];
  for (const target of TARGETS) {
    try { results.push(await inspectTarget(target, { fetchImpl, token: String(env[target.tokenEnv] || '') })); }
    catch (err) { results.push({ target: target.name, repository: target.repo, result: 'HOLD', reason: sanitizeError(err) }); }
  }
  return { schema: 'vnv-academy-source-caller-report-v1', mode: 'READ_ONLY_NO_SYNC', bothReadable: results.every(r => r.result === 'READ_ONLY_VERIFIED'), authorizedTransfer: false, accountCloudCommissioned: false, repositories: results };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.length !== 2) { process.stderr.write('Usage: node tools/account-cloud-source-caller.mjs\n'); process.exitCode = 2; }
  else {
    const result = await inspectBoth();
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    if (!result.bothReadable) process.exitCode = 1;
  }
}
