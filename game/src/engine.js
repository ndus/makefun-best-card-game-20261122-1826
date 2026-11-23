import { CARD_BY_ID, PLAYER_DECK, AI_DECK } from './cards.js';

// aiTakeTurn applies each action immediately and returns its descriptions in order.
// Spell targets are { side, index } for a creature, { side, face: true } for a duelist,
// or the side string for that duelist. 'face' means the opposing duelist.
const SIDES = ['player', 'ai'];
const otherSide = (side) => (side === 'player' ? 'ai' : 'player');
const hasKeyword = (card, keyword) => card.keywords?.includes(keyword);

function makeRng(seed) {
  let value = typeof seed === 'number' ? seed >>> 0 : 0;
  if (typeof seed === 'string') {
    for (let i = 0; i < seed.length; i += 1) value = Math.imul(value ^ seed.charCodeAt(i), 16777619) >>> 0;
  }
  return () => {
    value = (value + 0x6D2B79F5) >>> 0;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildDeck(list) {
  return list.flatMap(({ id, count }) => Array.from({ length: count }, () => ({ ...CARD_BY_ID[id], keywords: [...CARD_BY_ID[id].keywords] })));
}

function shuffle(deck, rng) {
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function note(state, message) { state.log.push(message); return message; }

function drawCards(state, side, amount = 1) {
  const duelist = state[side];
  const drawn = [];
  for (let i = 0; i < amount && duelist.deck.length; i += 1) {
    const card = duelist.deck.pop();
    duelist.hand.push(card);
    drawn.push(card.name);
  }
  if (drawn.length) note(state, `${side === 'player' ? 'Player' : 'AI'} draws ${drawn.join(', ')}.`);
  return drawn;
}

export function createGame(seed = 1) {
  const rng = makeRng(seed);
  const player = { hp: 30, mana: 0, maxMana: 0, deck: shuffle(buildDeck(PLAYER_DECK), rng), hand: [], board: [] };
  const ai = { hp: 30, mana: 0, maxMana: 0, deck: shuffle(buildDeck(AI_DECK), rng), hand: [], board: [] };
  return { duelists: { player, ai }, player, ai, turn: 0, activeSide: 'player', winner: null, log: [] };
}

export function startTurn(state) {
  if (!state || state.winner || !SIDES.includes(state.activeSide)) return state;
  const side = state.activeSide;
  const duelist = state[side];
  state.turn += 1;
  duelist.maxMana = Math.min(10, duelist.maxMana + 1);
  duelist.mana = duelist.maxMana;
  duelist.board.forEach((creature) => { creature.ready = true; });
  note(state, `${side === 'player' ? 'Player' : 'AI'} turn ${state.turn} begins with ${duelist.mana} mana.`);
  drawCards(state, side);
  return state;
}

function normalizeTarget(target, side) {
  if (target === 'face') return { side: otherSide(side), face: true };
  if (typeof target === 'string' && SIDES.includes(target)) return { side: target, face: true };
  if (typeof target === 'number') return { side: otherSide(side), index: target };
  return target;
}

function defaultSpellTarget(state, side, card) {
  const foe = otherSide(side);
  if (card.effectKind === 'damage') {
    const killable = state[foe].board
      .map((unit, index) => ({ unit, index }))
      .filter(({ unit }) => unit.health <= card.amount)
      .sort((a, b) => b.unit.attack - a.unit.attack || a.unit.health - b.unit.health);
    if (killable.length) return { side: foe, index: killable[0].index };
    return { side: foe, face: true };
  }
  if (card.effectKind === 'heal') {
    const hurt = state[side].board
      .map((unit, index) => ({ unit, index, missing: unit.maxHealth - unit.health }))
      .filter(({ missing }) => missing > 0)
      .sort((a, b) => b.missing - a.missing);
    if (hurt.length) return { side, index: hurt[0].index };
    return { side, face: true };
  }
  if (card.effectKind === 'buff' && state[side].board.length) {
    const best = state[side].board.reduce((bestIndex, unit, index, board) =>
      unit.attack > board[bestIndex].attack ? index : bestIndex, 0);
    return { side, index: best };
  }
  return null;
}

function resolveSpell(state, side, card, requestedTarget) {
  if (card.effectKind === 'draw') return { target: null };
  const target = normalizeTarget(requestedTarget, side) || defaultSpellTarget(state, side, card);
  if (!target || !SIDES.includes(target.side)) return null;
  const friendly = target.side === side;
  if (card.effectKind === 'damage') {
    if (target.face || target.index === undefined) return { target: { side: target.side, face: true } };
    return state[target.side].board[target.index] ? { target } : null;
  }
  if (card.effectKind === 'heal') {
    if (!friendly) return null;
    if (target.face || target.index === undefined) return { target: { side, face: true } };
    return state[side].board[target.index] ? { target } : null;
  }
  if (card.effectKind === 'buff') {
    if (!friendly || target.index === undefined || !state[side].board[target.index]) return null;
    return { target };
  }
  return null;
}

function removeDead(board) {
  for (let i = board.length - 1; i >= 0; i -= 1) if (board[i].health <= 0) board.splice(i, 1);
}

function setWinner(state) {
  if (state.player.hp <= 0) state.winner = 'ai';
  else if (state.ai.hp <= 0) state.winner = 'player';
  if (state.winner) note(state, `${state.winner === 'player' ? 'Player' : 'AI'} wins.`);
}

export function playCard(state, side, handIndex, target) {
  if (!state || state.winner || side !== state.activeSide || !SIDES.includes(side)) return null;
  const duelist = state[side];
  const card = duelist.hand[handIndex];
  if (!card || duelist.mana < card.cost) return null;
  if (card.type === 'creature' && duelist.board.length >= 4) return null;
  const spell = card.type === 'spell' ? resolveSpell(state, side, card, target) : null;
  if (card.type === 'spell' && !spell) return null;

  duelist.mana -= card.cost;
  duelist.hand.splice(handIndex, 1);
  if (card.type === 'creature') {
    const rush = hasKeyword(card, 'Rush');
    duelist.board.push({ ...card, keywords: [...card.keywords], health: card.health, maxHealth: card.health, ready: rush, playedTurn: state.turn });
    return note(state, `${side === 'player' ? 'Player' : 'AI'} plays ${card.name}${rush ? ' with Rush' : ''}.`);
  }

  const chosen = spell.target;
  const label = chosen.face ? `${chosen.side} hero` : state[chosen.side].board[chosen.index].name;
  if (card.effectKind === 'damage') {
    if (chosen.face) state[chosen.side].hp -= card.amount;
    else state[chosen.side].board[chosen.index].health -= card.amount;
    removeDead(state[chosen.side].board);
  } else if (card.effectKind === 'heal') {
    if (chosen.face) state[side].hp = Math.min(30, state[side].hp + card.amount);
    else {
      const unit = state[side].board[chosen.index];
      unit.health = Math.min(unit.maxHealth, unit.health + card.amount);
    }
  } else if (card.effectKind === 'buff') {
    const unit = state[side].board[chosen.index];
    unit.attack += card.amount;
    unit.health += card.amount;
    unit.maxHealth += card.amount;
  } else if (card.effectKind === 'draw') {
    drawCards(state, side, card.amount);
  }
  const message = note(state, `${side === 'player' ? 'Player' : 'AI'} casts ${card.name}${chosen ? ` on ${label}` : ''}.`);
  setWinner(state);
  return message;
}

export function attack(state, side, attackerIndex, target) {
  if (!state || state.winner || side !== state.activeSide || !SIDES.includes(side)) return null;
  const own = state[side];
  const foeSide = otherSide(side);
  const foe = state[foeSide];
  const attacker = own.board[attackerIndex];
  if (!attacker || !attacker.ready || (attacker.playedTurn === state.turn && !hasKeyword(attacker, 'Rush'))) return null;
  const hasGuard = foe.board.some((unit) => hasKeyword(unit, 'Guard'));
  if (target === 'face') {
    if (hasGuard) return null;
    foe.hp -= attacker.attack;
    attacker.ready = false;
    const message = note(state, `${attacker.name} attacks ${foeSide} hero for ${attacker.attack}.`);
    setWinner(state);
    return message;
  }
  const defender = foe.board[target];
  if (!defender || (hasGuard && !hasKeyword(defender, 'Guard'))) return null;
  defender.health -= attacker.attack;
  attacker.health -= defender.attack;
  attacker.ready = false;
  removeDead(foe.board);
  removeDead(own.board);
  const message = note(state, `${attacker.name} and ${defender.name} clash; ${attacker.attack}/${defender.attack} damage dealt.`);
  setWinner(state);
  return message;
}

export function endTurn(state) {
  if (!state || state.winner) return state;
  state.activeSide = otherSide(state.activeSide);
  return startTurn(state);
}

function aiSpellTarget(state, card) {
  return defaultSpellTarget(state, 'ai', card);
}

function boardPower(board) { return board.reduce((sum, unit) => sum + unit.attack, 0); }

export function aiTakeTurn(state) {
  const actions = [];
  if (!state || state.winner || state.activeSide !== 'ai') return actions;
  const performCards = (type) => {
    let progressed = true;
    while (progressed && !state.winner) {
      progressed = false;
      const candidates = state.ai.hand
        .map((card, index) => ({ card, index }))
        .filter(({ card }) => card.type === type && card.cost <= state.ai.mana)
        .sort((a, b) => b.card.cost - a.card.cost);
      for (const { card } of candidates) {
        if (card.type === 'creature' && state.ai.board.length >= 4) break;
        const index = state.ai.hand.indexOf(card);
        const action = playCard(state, 'ai', index, type === 'spell' ? aiSpellTarget(state, card) : undefined);
        if (action) { actions.push(action); progressed = true; break; }
      }
    }
  };
  performCards('creature');
  performCards('spell');

  let position = 0;
  while (position < state.ai.board.length && !state.winner) {
    const attacker = state.ai.board[position];
    if (!attacker.ready || (attacker.playedTurn === state.turn && !hasKeyword(attacker, 'Rush'))) { position += 1; continue; }
    const guards = state.player.board
      .map((unit, index) => ({ unit, index }))
      .filter(({ unit }) => hasKeyword(unit, 'Guard'));
    const targets = state.player.board.map((unit, index) => ({ unit, index }));
    const trades = (guards.length ? guards : targets)
      .filter(({ unit }) => guards.length || unit.health <= attacker.attack || unit.attack < attacker.health)
      .sort((a, b) => Number(hasKeyword(b.unit, 'Guard')) - Number(hasKeyword(a.unit, 'Guard')) || a.unit.health - b.unit.health);
    let action = null;
    if (trades.length) action = attack(state, 'ai', position, trades[0].index);
    else if (!guards.length && (boardPower(state.ai.board) >= boardPower(state.player.board) || state.ai.hp >= state.player.hp)) {
      action = attack(state, 'ai', position, 'face');
    }
    if (action) actions.push(action);
    if (state.ai.board[position] === attacker) position += 1;
  }
  if (!state.winner) {
    endTurn(state);
    actions.push('AI ends turn.');
  }
  return actions;
}
