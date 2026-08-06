import { SovereignProblemSolvingAgent } from '../core/sovereign-agent.js';
import { createLearningPathProblem } from '../adapters/learning-path-adapter.js';
import { assertAgentContract } from '../core/agent-contract.js';

const agent = new SovereignProblemSolvingAgent({
  id: 'verve.sovereign-problem-solving-agent',
  version: '0.1.0',
  sourceApp: 'assessment-engine.sovereign-agent-lab',
  memoryKey: 'verve_sovereign_agent_demo_v1',
  simulations: 360,
  timeBudgetMs: 180
});
assertAgentContract(agent);

const $ = selector => document.querySelector(selector);
const eventLog = $('#eventLog');
let currentLearningDecision = null;

function format(value, digits = 2) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(digits) : '—';
}

function log(message, data) {
  const line = `[${new Date().toLocaleTimeString()}] ${message}`;
  eventLog.textContent = `${line}${data ? `\n${JSON.stringify(data, null, 2)}` : ''}\n\n${eventLog.textContent}`;
}

for (const id of ['numeracy', 'reading', 'reasoning', 'energy', 'challenge']) {
  const input = $(`#${id}`);
  const output = $(`#${id}Out`);
  input.addEventListener('input', () => { output.textContent = `${input.value}%`; });
}

function learningInput() {
  return {
    numeracy: Number($('#numeracy').value) / 100,
    reading: Number($('#reading').value) / 100,
    reasoning: Number($('#reasoning').value) / 100,
    energy: Number($('#energy').value) / 100,
    challengePreference: Number($('#challenge').value) / 100,
    engagementPreference: 0.76,
    timeAvailable: Number($('#timeAvailable').value)
  };
}

function factorLabel(feature) {
  return ({
    gapFit: 'skill-gap fit',
    timeFit: 'time fit',
    energyFit: 'energy fit',
    challengeFit: 'challenge fit',
    engagementFit: 'engagement fit',
    transfer: 'transfer value',
    feedbackSpeed: 'feedback speed',
    'adaptive-memory': 'local outcome memory'
  })[feature] || feature;
}

function renderLearningDecision(decision, problem) {
  const mount = $('#learningResults');
  mount.classList.add('visible');
  if (!decision.action) {
    mount.innerHTML = `
      <div class="recommendation">
        <h3>No activity satisfied the current constraints.</h3>
        <p>Increase the available time or energy setting, then run the recommendation again.</p>
      </div>`;
    return;
  }

  const top = decision.ranking[0];
  const strongest = (decision.explanation.strongestFactors || [])
    .filter(item => Math.abs(item.contribution) > 0.001)
    .map(item => `<span class="factor">${factorLabel(item.feature)}: ${format(item.contribution, 3)}</span>`)
    .join('');

  const ranking = decision.ranking.slice(0, 4).map((item, index) => `
    <article class="rank-card">
      <div class="rank-line">
        <strong>${index + 1}. ${item.action.label}</strong>
        <span class="pill">combined ${format(item.score, 3)}</span>
        <span class="pill">expected ${format(item.expectedUtility, 3)}</span>
        <span class="pill">memory ${format(item.memoryBias, 3)}</span>
      </div>
    </article>`).join('');

  mount.innerHTML = `
    <div class="recommendation">
      <p class="eyebrow">Agent recommendation</p>
      <h3>${decision.action.label}</h3>
      <p>${decision.explanation.summary}</p>
      <div class="score-grid">
        <div class="metric"><strong>${Math.round(decision.confidence * 100)}%</strong>confidence</div>
        <div class="metric"><strong>${decision.action.minutes}</strong>minutes</div>
        <div class="metric"><strong>${format(top.expectedUtility, 2)}</strong>expected utility</div>
        <div class="metric"><strong>${decision.diagnostics.simulations}</strong>simulations</div>
      </div>
      <div class="factor-list">${strongest}</div>
      <p class="note">Weakest current skill: <strong>${problem.learnerSnapshot.weakestSkill}</strong>. This is guidance evidence, not an automatic formal grade.</p>
      <div class="button-row">
        <button data-reward="1" type="button">Outcome was helpful</button>
        <button data-reward="0" type="button">Outcome was neutral</button>
        <button data-reward="-1" type="button">Outcome was not helpful</button>
      </div>
    </div>
    <h3>Ranked alternatives</h3>
    <div class="ranking">${ranking}</div>`;

  mount.querySelectorAll('[data-reward]').forEach(button => {
    button.addEventListener('click', () => {
      const reward = Number(button.dataset.reward);
      const label = reward > 0 ? 'helpful' : reward < 0 ? 'not-helpful' : 'neutral';
      const result = agent.receiveOutcome({ reward, label, decision: currentLearningDecision });
      log(`Outcome recorded for ${currentLearningDecision.action.id}.`, {
        reward,
        memoryValue: result.memoryEntry.value,
        observations: result.memoryEntry.count
      });
      mount.querySelectorAll('[data-reward]').forEach(item => { item.disabled = true; });
      button.textContent = 'Outcome recorded';
    });
  });
}

$('#recommendBtn').addEventListener('click', () => {
  try {
    const problem = createLearningPathProblem(learningInput());
    agent.observe(problem.learnerSnapshot);
    currentLearningDecision = agent.chooseAction(problem, { strategy: 'hybrid', seed: 'learning-path-demo-v1' });
    renderLearningDecision(currentLearningDecision, problem);
    log('Learning-path decision completed.', {
      selected: currentLearningDecision.action?.id,
      confidence: currentLearningDecision.confidence,
      strategy: currentLearningDecision.strategy,
      elapsedMs: currentLearningDecision.elapsedMs
    });
  } catch (error) {
    log('Learning-path error.', { message: error.message });
  }
});

function createTakeAwayProblem(tokens) {
  const start = { tokens, player: 'agent', lastPlayer: null };
  return {
    id: `take-away-${tokens}`,
    domainId: 'strategy.take-away',
    type: 'adversarial',
    minimax: {
      state: start,
      rootPlayer: 'agent',
      depth: Math.max(2, tokens),
      generateActions(state) {
        return [1, 2, 3].filter(amount => amount <= state.tokens).map(amount => ({ id: `take-${amount}`, amount }));
      },
      applyAction(state, action, player) {
        const remaining = state.tokens - action.amount;
        return {
          tokens: remaining,
          player: player === 'agent' ? 'opponent' : 'agent',
          lastPlayer: player
        };
      },
      isTerminal: state => state.tokens === 0,
      currentPlayer: state => state.player,
      evaluate(state, rootPlayer) {
        if (state.tokens === 0) return state.lastPlayer === rootPlayer ? 100 : -100;
        return -Math.abs((state.tokens % 4));
      },
      orderActions: actions => [...actions].sort((a, b) => b.amount - a.amount)
    }
  };
}

$('#strategyBtn').addEventListener('click', () => {
  const tokens = Math.max(1, Math.min(24, Number($('#tokenCount').value) || 1));
  const decision = agent.chooseAction(createTakeAwayProblem(tokens), { strategy: 'minimax', depth: tokens });
  const mount = $('#strategyResults');
  mount.classList.add('visible');
  mount.innerHTML = `
    <div class="recommendation">
      <h3>Remove ${decision.action?.amount ?? '—'} token${decision.action?.amount === 1 ? '' : 's'}</h3>
      <p>${decision.explanation.summary}</p>
      <div class="score-grid">
        <div class="metric"><strong>${format(decision.score, 0)}</strong>search score</div>
        <div class="metric"><strong>${decision.diagnostics.nodes}</strong>nodes</div>
        <div class="metric"><strong>${decision.diagnostics.prunes}</strong>prunes</div>
        <div class="metric"><strong>${decision.diagnostics.cacheEntries}</strong>cached states</div>
      </div>
    </div>`;
  $('#strategyLog').textContent = JSON.stringify({
    principalVariation: decision.explanation.principalVariation,
    alternatives: decision.ranking.slice(0, 3),
    diagnostics: decision.diagnostics
  }, null, 2);
  log('Minimax search completed.', { tokens, selected: decision.action?.amount, ...decision.diagnostics });
});

function createScheduleProblem() {
  const slots = ['8:00 AM', '10:00 AM', '1:00 PM', '3:00 PM'];
  const activities = {
    mathematics: { energy: 'high', subject: 'quantitative' },
    reading: { energy: 'medium', subject: 'language' },
    scienceLab: { energy: 'high', subject: 'quantitative' },
    reflection: { energy: 'low', subject: 'language' }
  };
  const energyBySlot = {
    '8:00 AM': 'high',
    '10:00 AM': 'high',
    '1:00 PM': 'medium',
    '3:00 PM': 'low'
  };
  const level = { low: 1, medium: 2, high: 3 };

  return {
    id: 'balanced-study-schedule',
    domainId: 'planning.schedule',
    type: 'constraint',
    variables: Object.keys(activities).map(id => ({ id, domain: slots })),
    constraints: [
      {
        id: 'unique-slots',
        message: 'Each activity requires its own time slot.',
        test(assignment) {
          const values = Object.values(assignment);
          return new Set(values).size === values.length;
        }
      },
      {
        id: 'energy-fit',
        message: 'An activity cannot exceed the energy available in its time slot.',
        test(assignment) {
          return Object.entries(assignment).every(([activityId, slot]) =>
            level[activities[activityId].energy] <= level[energyBySlot[slot]]
          );
        }
      },
      {
        id: 'math-before-lab',
        message: 'Mathematics should precede the science laboratory.',
        test(assignment, complete) {
          if (!assignment.mathematics || !assignment.scienceLab) return !complete;
          return slots.indexOf(assignment.mathematics) < slots.indexOf(assignment.scienceLab);
        }
      },
      {
        id: 'subject-spacing',
        message: 'The two quantitative activities should not be consecutive.',
        test(assignment) {
          if (!assignment.mathematics || !assignment.scienceLab) return true;
          return Math.abs(slots.indexOf(assignment.mathematics) - slots.indexOf(assignment.scienceLab)) > 1;
        }
      },
      {
        id: 'reflection-last',
        message: 'Reflection belongs in the final low-energy slot.',
        test(assignment, complete) {
          if (!assignment.reflection) return !complete;
          return assignment.reflection === '3:00 PM';
        }
      }
    ]
  };
}

$('#scheduleBtn').addEventListener('click', () => {
  const decision = agent.chooseAction(createScheduleProblem(), { strategy: 'constraint', maxSolutions: 20 });
  const mount = $('#scheduleResults');
  mount.classList.add('visible');
  if (!decision.action) {
    mount.innerHTML = '<div class="recommendation"><h3>No valid schedule found.</h3></div>';
    return;
  }
  const rows = Object.entries(decision.action)
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([activity, slot]) => `<tr><td>${slot}</td><td>${activity.replace(/([A-Z])/g, ' $1')}</td></tr>`)
    .join('');
  mount.innerHTML = `
    <div class="recommendation">
      <h3>Valid balanced schedule</h3>
      <p>${decision.explanation.summary}</p>
      <table class="solution-table">
        <thead><tr><th>Time</th><th>Activity</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="note">Search nodes: ${decision.diagnostics.nodes}. Valid solutions found: ${decision.diagnostics.solutionCount}.</p>
    </div>`;
  log('Constraint schedule solved.', decision.diagnostics);
});

$('#exportBtn').addEventListener('click', () => {
  const payload = agent.exportEvidence();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `verve-agent-evidence-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  log('Evidence bundle exported.', { events: payload.events.length });
});

$('#resetMemoryBtn').addEventListener('click', () => {
  const approved = globalThis.confirm('Reset this agent’s local adaptive outcome memory?');
  if (!approved) return;
  agent.resetMemory();
  currentLearningDecision = null;
  log('Adaptive memory reset.', agent.memory.summary());
});

log('Agent contract verified.', {
  id: agent.id,
  version: agent.version,
  memory: agent.memory.summary()
});
