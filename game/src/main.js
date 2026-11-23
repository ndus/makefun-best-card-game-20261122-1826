import { CARD_BY_ID } from './cards.js';
import { createGame, startTurn, playCard, attack, endTurn, aiTakeTurn } from './engine.js';
import { screenTitle, screenEnd, tableHTML } from './render.js';

const app = document.querySelector('#app');
const announcer = document.querySelector('#announcer');
const ui = { selectedAttacker: null, locked: false, muted: false };
let state = null;
let audio = null;

function announce(message) { if (announcer) announcer.textContent = message; }
function render() {
  if (!state) app.innerHTML = screenTitle();
  else if (state.winner) app.innerHTML = screenEnd(state.winner === 'player');
  else app.innerHTML = tableHTML(state, { selectedAttacker: ui.selectedAttacker, inputLocked: ui.locked, muted: ui.muted });
  app.onclick = onClick;
}
function sound(kind) {
  if (ui.muted || !audio) return;
  const frequencies = { play: 440, attack: 660, damage: 220 };
  try {
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequencies[kind] || frequencies.play;
    gain.gain.setValueAtTime(0.055, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.14);
    oscillator.connect(gain); gain.connect(audio.destination);
    oscillator.start(); oscillator.stop(audio.currentTime + 0.14);
  } catch (_) { /* Audio is optional. */ }
}
function gesture() {
  if (ui.muted || audio) return;
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (Audio) { audio = new Audio(); if (audio.state === 'suspended') audio.resume(); }
  } catch (_) { audio = null; }
}
function describe(message, side = 'player') {
  if (!message) return '';
  if (message.includes('wins')) return side === 'player' ? 'You win' : 'Enemy wins';
  if (message.includes('plays ')) return message.replace(/^(Player|AI) plays /, side === 'ai' ? 'Enemy plays ' : 'You play ');
  if (message.includes('casts ')) return message.replace(/^(Player|AI) casts /, side === 'ai' ? 'Enemy casts ' : 'You cast ');
  if (message.includes('attacks ') || message.includes('clash')) return message;
  if (message.includes('ends turn')) return 'Your turn';
  return message;
}
function actionResult(message, side = 'player', kind = 'play') {
  if (!message) return false;
  announce(describe(message, side));
  sound(kind);
  if (kind === 'attack' && /for d|damage dealt/.test(message)) sound('damage');
  if (state.winner) announce(state.winner === 'player' ? 'You win' : 'Enemy wins');
  render();
  return true;
}
function freshGame(seed = Date.now()) {
  state = createGame(seed);
  ui.selectedAttacker = null; ui.locked = false;
  startTurn(state);
  announce('Your turn');
  render();
}
function playHand(index) {
  if (!state || state.winner || state.activeSide !== 'player' || ui.locked) return;
  const card = state.player.hand[index];
  const message = playCard(state, 'player', index);
  if (message) actionResult(message, 'player', card?.effectKind === 'damage' ? 'damage' : 'play');
}
function canAttack(unit) {
  return unit?.ready && (unit.playedTurn !== state.turn || unit.keywords?.includes('Rush'));
}
function doAttack(target) {
  if (!state || state.activeSide !== 'player' || ui.locked || ui.selectedAttacker === null) return;
  const message = attack(state, 'player', ui.selectedAttacker, target);
  ui.selectedAttacker = null;
  if (message) actionResult(message, 'player', 'attack'); else render();
}
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function endPlayerTurn() {
  if (!state || state.winner || state.activeSide !== 'player' || ui.locked) return;
  ui.selectedAttacker = null; ui.locked = true;
  endTurn(state);
  announce('Enemy turn'); render();
  const actions = aiTakeTurn(state);
  for (const action of actions) {
    await wait(450);
    const kind = /attacks |clash/.test(action) ? 'attack' : /casts /.test(action) ? 'damage' : 'play';
    announce(describe(action, 'ai'));
    sound(kind);
    if (kind === 'attack' && /for d|damage dealt/.test(action)) sound('damage');
    if (state.winner) announce(state.winner === 'player' ? 'You win' : 'Enemy wins');
    render();
  }
  ui.locked = false;
  if (!state.winner) announce('Your turn');
  render();
}
function onClick(event) {
  gesture();
  const target = event.target.closest('button, [data-attacker], [data-target-creature], [data-target-face]');
  if (!target) return;
  if (target.id === 'play-btn' || target.id === 'restart-btn') { freshGame(); return; }
  if (target.id === 'mute-btn') { ui.muted = !ui.muted; render(); return; }
  if (target.id === 'end-turn-btn') { endPlayerTurn(); return; }
  if (target.hasAttribute('data-hand')) { playHand(Number(target.dataset.hand)); return; }
  if (target.hasAttribute('data-attacker')) {
    if (!state || state.activeSide !== 'player' || ui.locked) return;
    const index = Number(target.dataset.attacker);
    ui.selectedAttacker = ui.selectedAttacker === index ? null : (canAttack(state.player.board[index]) ? index : null);
    render(); return;
  }
  if (target.hasAttribute('data-target-creature')) {
    if (target.dataset.side === 'ai') doAttack(Number(target.dataset.targetCreature));
    return;
  }
  if (target.hasAttribute('data-target-face') && target.dataset.side === 'ai') doAttack('face');
}
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') { ui.selectedAttacker = null; render(); return; }
  if (!state || state.winner || ui.locked) return;
  if (/^[1-7]$/.test(event.key) && state.activeSide === 'player') { gesture(); playHand(Number(event.key) - 1); }
  else if (event.key === 'Enter' && state.activeSide === 'player') { event.preventDefault(); gesture(); endPlayerTurn(); }
});

function shotPlay(seed) {
  state = createGame(seed);
  const orderDraws = (deck, ids) => {
    const selected = ids.map((id) => { const i = deck.findIndex((card) => card.id === id); return i < 0 ? null : deck.splice(i, 1)[0]; }).filter(Boolean);
    deck.push(...selected.reverse());
  };
  try {
    orderDraws(state.player.deck, ['iron-squire', 'ember-whelp']);
    orderDraws(state.ai.deck, ['iron-squire', 'ember-whelp']);
    startTurn(state);
    let i = state.player.hand.findIndex((card) => card.id === 'iron-squire');
    if (i >= 0) playCard(state, 'player', i);
    endTurn(state); aiTakeTurn(state);
    const attacker = state.player.board.findIndex((unit) => unit.ready);
    if (attacker >= 0) attack(state, 'player', attacker, 'face');
    i = state.player.hand.findIndex((card) => card.id === 'ember-whelp');
    if (i >= 0) playCard(state, 'player', i);
    endTurn(state); aiTakeTurn(state);
  } catch (_) { /* Keep the deterministic partial board if an action is unavailable. */ }
  const ensureCreature = (duelist) => {
    if (duelist.board.some((unit) => unit.type === 'creature') || duelist.board.length >= 4) return;
    const index = duelist.deck.findIndex((card) => card.type === 'creature');
    if (index < 0) return;
    const card = duelist.deck.splice(index, 1)[0];
    duelist.board.push({ ...card, keywords: [...card.keywords], health: card.health, maxHealth: card.health, ready: false, playedTurn: state.turn });
  };
  const fillHand = (duelist, minimum) => {
    while (duelist.hand.length < minimum && duelist.deck.length) duelist.hand.push(duelist.deck.pop());
  };
  ensureCreature(state.player);
  ensureCreature(state.ai);
  fillHand(state.player, 3);
  fillHand(state.ai, 2);
  ui.selectedAttacker = null; ui.locked = false; render();
}
function initializeShot() {
  const params = new URLSearchParams(location.search);
  const shot = params.get('shot');
  if (shot === 'start') { state = null; render(); return; }
  if (shot === 'play') {
    const rawSeed = params.get('seed') || '1';
    const seed = /^-?\d+$/.test(rawSeed) ? Number(rawSeed) : rawSeed;
    shotPlay(seed); return;
  }
  if (shot === 'end') {
    const rawSeed = params.get('seed') || '1';
    const seed = /^-?\d+$/.test(rawSeed) ? Number(rawSeed) : rawSeed;
    state = createGame(seed); state.ai.hp = 0; state.winner = 'player';
    announce('You win'); render(); return;
  }
  state = null; render();
}
initializeShot();
