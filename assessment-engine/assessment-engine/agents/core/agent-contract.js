/**
 * Runtime contract checker for pluggable Verve N Veda agents.
 */
export const REQUIRED_AGENT_METHODS = [
  'initialize',
  'observe',
  'legalActions',
  'evaluate',
  'chooseAction',
  'explainDecision',
  'receiveOutcome',
  'exportEvidence',
  'resetMemory'
];

export function assertAgentContract(agent) {
  const missing = REQUIRED_AGENT_METHODS.filter(name => typeof agent?.[name] !== 'function');
  if (missing.length) {
    throw new TypeError(`Agent contract incomplete. Missing: ${missing.join(', ')}`);
  }
  if (!agent.id || !agent.version) {
    throw new TypeError('Agent contract requires stable id and version fields.');
  }
  return true;
}
