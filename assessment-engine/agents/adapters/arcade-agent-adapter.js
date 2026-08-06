/**
 * Thin adapter contract for existing single-file Arcade agents.
 * It keeps each game's specialized logic in the Arcade while standardizing evidence.
 */
export function createArcadeAgentAdapter({
  id,
  version = '1.0.0',
  getState,
  getLegalActions,
  chooseAction,
  explain,
  applyOutcome
}) {
  if (!id) throw new TypeError('Arcade adapter requires an id.');
  return {
    id,
    version,
    observe: () => getState(),
    legalActions: state => getLegalActions(state),
    chooseAction: (state, options) => chooseAction(state, options),
    explainDecision: decision => explain?.(decision) || { summary: 'Decision produced by the specialized Arcade agent.' },
    receiveOutcome: outcome => applyOutcome?.(outcome),
    exportEvidence: () => ({ sourceApp: id, exportedAt: new Date().toISOString(), events: [] })
  };
}
