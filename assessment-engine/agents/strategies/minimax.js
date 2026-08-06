/**
 * Generic minimax with alpha-beta pruning and optional transposition cache.
 */
export function minimaxSearch({
  state,
  rootPlayer,
  depth = 3,
  generateActions,
  applyAction,
  evaluate,
  isTerminal,
  currentPlayer,
  actionKey = action => JSON.stringify(action),
  stateKey = value => JSON.stringify(value),
  orderActions
}) {
  const cache = new Map();
  let nodes = 0;
  let prunes = 0;

  function visit(node, remaining, alpha, beta) {
    nodes += 1;
    const terminal = isTerminal(node);
    if (remaining <= 0 || terminal) {
      return { score: Number(evaluate(node, rootPlayer, terminal)) || 0, line: [] };
    }

    const player = currentPlayer(node);
    const maximizing = player === rootPlayer;
    const cacheId = `${remaining}|${player}|${stateKey(node)}`;
    if (cache.has(cacheId)) return cache.get(cacheId);

    let actions = generateActions(node, player) || [];
    if (orderActions) actions = orderActions(actions, node, player) || actions;
    if (!actions.length) {
      return { score: Number(evaluate(node, rootPlayer, terminal)) || 0, line: [] };
    }

    let best = maximizing
      ? { score: -Infinity, line: [] }
      : { score: Infinity, line: [] };

    for (const action of actions) {
      const child = applyAction(node, action, player);
      const result = visit(child, remaining - 1, alpha, beta);
      const candidate = { score: result.score, line: [action, ...result.line] };

      if (maximizing ? candidate.score > best.score : candidate.score < best.score) {
        best = candidate;
      }

      if (maximizing) alpha = Math.max(alpha, best.score);
      else beta = Math.min(beta, best.score);

      if (beta <= alpha) {
        prunes += 1;
        break;
      }
    }

    cache.set(cacheId, best);
    return best;
  }

  const rootActions = generateActions(state, rootPlayer) || [];
  let bestAction = null;
  let bestScore = -Infinity;
  let bestLine = [];
  const alternatives = [];

  for (const action of rootActions) {
    const child = applyAction(state, action, rootPlayer);
    const result = visit(child, depth - 1, -Infinity, Infinity);
    alternatives.push({ action, score: result.score, line: [action, ...result.line] });
    if (result.score > bestScore) {
      bestAction = action;
      bestScore = result.score;
      bestLine = [action, ...result.line];
    }
  }

  alternatives.sort((a, b) => b.score - a.score);
  return {
    action: bestAction,
    score: bestScore,
    principalVariation: bestLine,
    alternatives,
    diagnostics: { nodes, prunes, cacheEntries: cache.size, depth, actionKey: bestAction ? actionKey(bestAction) : null }
  };
}
