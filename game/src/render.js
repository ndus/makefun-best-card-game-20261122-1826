const SHAPES = {
  flame: '<path d="M32 6c3 11-8 14-5 24 2-5 7-6 9-12 8 10 10 16 6 24-4 9-17 12-25 4-7-8-2-17 4-25 2 5 2 8 1 11 7-7 9-15 10-26Z" fill="currentColor"/>',
  stone: '<path d="m15 15 15-8 19 10 4 18-15 17-20-6-8-16 5-15Z" fill="currentColor"/><path d="m15 15 15 9 19-7M30 24l-4 25m4-25 19 11" fill="none" stroke="#fff0bd" stroke-width="2"/>',
  bolt: '<path d="M37 5 13 34h16l-3 23 25-33H35l2-19Z" fill="currentColor" stroke="#fff0bd" stroke-width="2"/>',
  moon: '<path d="M44 8C27 10 17 22 16 39c9 10 24 11 34 2 12-11 9-28-6-33Z" fill="currentColor"/><path d="M44 8c-2 15-11 27-28 31" fill="none" stroke="#fff0bd" stroke-width="2"/>',
  leaf: '<path d="M51 8C28 8 12 18 12 34c0 10 7 16 16 14 15-3 24-20 23-40Z" fill="currentColor"/><path d="M15 47c9-13 19-22 34-36M27 34l-1-12m11 7 9 1" fill="none" stroke="#fff0bd" stroke-width="2"/>',
  eye: '<path d="M5 30s10-16 27-16 27 16 27 16-10 16-27 16S5 30 5 30Z" fill="currentColor"/><circle cx="32" cy="30" r="10" fill="#fff0bd"/><circle cx="32" cy="30" r="5" fill="#382344"/>',
  wave: '<path d="M6 20c9-12 17 12 26 0s17 12 26 0M6 31c9-12 17 12 26 0s17 12 26 0M6 42c9-12 17 12 26 0s17 12 26 0" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>',
  star: '<path d="m32 5 7 18 19 1-15 12 5 19-16-11-16 11 5-19L6 24l19-1 7-18Z" fill="currentColor" stroke="#fff0bd" stroke-width="2"/>',
  shard: '<path d="m35 5 15 18-6 25-13 8-9-21L35 5Z" fill="currentColor"/><path d="m35 5-4 30 13 13m-13-13-9 0" fill="none" stroke="#fff0bd" stroke-width="2"/>',
  bloom: '<g fill="currentColor" stroke="#fff0bd" stroke-width="2"><ellipse cx="32" cy="16" rx="8" ry="13"/><ellipse cx="32" cy="44" rx="8" ry="13"/><ellipse cx="18" cy="30" rx="13" ry="8"/><ellipse cx="46" cy="30" rx="13" ry="8"/><circle cx="32" cy="30" r="7"/></g>',
  fang: '<path d="M11 8c9 8 15 8 21 8s12 0 21-8c-2 24-6 40-21 48C17 48 13 32 11 8Z" fill="currentColor"/><path d="m22 22 10 24 10-24" fill="none" stroke="#fff0bd" stroke-width="3"/>',
  rune: '<path d="M17 8h31v8H25v12h18v8H25v10h23v8H17V8Z" fill="currentColor"/><path d="M8 18h9m31 0h9M8 46h9m31 0h9" stroke="#fff0bd" stroke-width="3"/>',
  shield: '<path d="M32 6 52 14v15c0 13-8 22-20 29-12-7-20-16-20-29V14l20-8Z" fill="currentColor"/><path d="m22 31 7 7 14-16" fill="none" stroke="#fff0bd" stroke-width="3"/>',
  hex: '<path d="m32 6 22 13v22L32 54 10 41V19L32 6Z" fill="currentColor"/><path d="m22 24 10-6 10 6v12l-10 6-10-6V24Z" fill="none" stroke="#fff0bd" stroke-width="2"/>',
  wing: '<path d="M7 40c14-3 18-17 21-31 14 8 22 19 28 37-11-6-17-5-23 4-6-8-14-11-26-10Z" fill="currentColor"/><path d="M12 43c13-6 23-17 32-28M28 39l-1-13m11 10 8-9" fill="none" stroke="#fff0bd" stroke-width="2"/>',
  sun: '<circle cx="32" cy="30" r="14" fill="currentColor"/><path d="M32 4v10m0 32v10M6 30h10m32 0h10M13 11l7 7m24 24 7 7m0-38-7 7m-24 24-7 7" stroke="currentColor" stroke-width="4"/><circle cx="32" cy="30" r="6" fill="#fff0bd"/>',
  crescent: '<path d="M46 7c-5 18-16 30-34 35 8 11 23 14 35 6 14-9 16-28 5-38-2-2-4-3-6-3Z" fill="currentColor"/>',
  mountain: '<path d="m5 50 17-30 8 13L41 8l18 42H5Z" fill="currentColor"/><path d="m16 50 6-12 8 6 11-18 13 24M36 19l5-11 7 15-7-4-5 0Z" fill="#fff0bd"/>',
  heart: '<path d="M32 53 10 32C-2 19 14 4 26 14l6 6 6-6c12-10 28 5 16 18L32 53Z" fill="currentColor" stroke="#fff0bd" stroke-width="2"/>',
  diamond: '<path d="M18 8h28l12 15-26 32L6 23 18 8Z" fill="currentColor"/><path d="m18 8 14 47L46 8M6 23h52" fill="none" stroke="#fff0bd" stroke-width="2"/>',
  spiral: '<path d="M32 9c-13 0-22 9-22 21 0 10 8 17 17 17 8 0 14-5 14-12 0-6-4-10-10-10-5 0-8 3-8 7 0 3 2 5 5 5" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><path d="M32 9c13 0 22 10 22 22 0 10-5 18-14 23" fill="none" stroke="#fff0bd" stroke-width="2"/>'
};

const COLORS = { common: '#c4a66b', rare: '#71c9df', epic: '#c184f0', legendary: '#ef9d57' };

export function emblemSVG(key) {
  return '<svg viewBox="0 0 64 60" aria-hidden="true" focusable="false">' + (SHAPES[key] || SHAPES.star) + '</svg>';
}

export function cardHTML(card, opts = {}) {
  const rarity = card.rarity || 'common';
  const creature = card.type === 'creature';
  const color = COLORS[rarity] || COLORS.common;
  const index = opts.index === undefined ? '' : ' data-hand="' + opts.index + '"';
  const disabled = opts.disabled ? ' disabled aria-disabled="true"' : '';
  const stats = creature
    ? '<div class="card-stats"><span class="atk">' + card.attack + '</span><span class="hp">' + card.health + '</span></div>'
    : '<div class="card-effect">' + card.text + '</div>';
  return '<button type="button" class="hand-card rarity-' + rarity + (opts.selected ? ' selected' : '') + '" style="--rarity:' + color + ';--glow:' + color + '" data-card-id="' + card.id + '"' + index + disabled + '><span class="mana-gem">' + card.cost + '</span><span class="card-art">' + emblemSVG(card.emblem) + '</span><span class="rarity-line"><i class="rarity-gem"></i>' + rarity + '</span><span class="card-title">' + card.name + '</span><span class="card-type">' + (creature ? 'Creature' : 'Spell') + '</span>' + stats + '</button>';
}

export function cardBackHTML() {
  return '<div class="back-card" aria-label="Face-down card"></div>';
}

export function duelistHTML(label, duelist, deckCount, isActive) {
  const side = label.toLowerCase().includes('rival') || label.toLowerCase().includes('enemy') || label.toLowerCase().includes('ai') ? 'ai' : 'player';
  const mana = Array.from({ length: duelist.maxMana || 0 }, (_, i) => '<i class="mana-crystal' + (i < duelist.mana ? ' filled' : '') + '" aria-hidden="true"></i>').join('');
  return '<div class="duelist' + (isActive ? ' active' : '') + '" data-target-face="1" data-side="' + side + '" role="button" tabindex="0" aria-label="' + label + ', ' + duelist.hp + ' health"><div class="portrait">' + label.charAt(0).toUpperCase() + '</div><div class="duelist-info"><div class="duelist-name">' + label + '</div><div class="stats"><span class="stat-pill hp">♥ ' + duelist.hp + '</span><span class="stat-pill mana">✦ ' + duelist.mana + '/' + duelist.maxMana + '<span class="mana-crystals">' + mana + '</span></span><span class="stat-pill deck">▤ ' + deckCount + '</span></div></div></div>';
}

export function screenTitle() {
  const sigil = '<div class="sigil" style="width:152px;height:44px;margin:0 auto 8px;display:flex;align-items:center;justify-content:center;gap:10px">' +
    ['star', 'moon', 'bolt'].map((key) => '<span style="width:44px;height:44px;display:block;flex:0 0 44px;filter:drop-shadow(0 0 8px #b888fd88)">' + emblemSVG(key).replace('<svg ', '<svg style="width:44px;height:44px" ') + '</span>').join('') +
    '</div>';
  return '<section class="screen-overlay"><div class="title-card"><div class="eyebrow">A duel of arcane forces</div>' + sigil + '<h1 class="game-title">AETHER <span>CLASH</span></h1><p class="subtitle">Command the elements. Claim the arena.</p><p class="rules-line">Summon creatures, cast spells, and bring your rival to zero health. Guard creatures protect their duelist.</p><button id="play-btn" class="play-btn" type="button">Play</button></div></section>';
}

export function screenEnd(won) {
  return '<section class="screen-overlay"><div class="result-card"><div class="result-emblem">' + (won ? '✦' : '☾') + '</div><h1 class="result-title' + (won ? '' : ' loss') + '">' + (won ? 'VICTORY' : 'DEFEAT') + '</h1><p class="result-copy">' + (won ? 'The arena answers to your will.' : 'The clash has ended, but the embers remain.') + '</p><button id="restart-btn" class="play-btn" type="button">Play Again</button></div></section>';
}

function creatureHTML(unit, index, side, ui) {
  const own = side === 'player';
  const hurt = unit.health < unit.maxHealth;
  const color = COLORS[unit.rarity] || COLORS.common;
  const selected = own && ui.selectedAttacker === index;
  const classes = ['creature', 'rarity-' + (unit.rarity || 'common'), own ? (unit.ready ? 'ready' : 'sleeping') : '', selected ? 'selected' : '', hurt ? 'damaged' : '', unit.keywords && unit.keywords.includes('Guard') ? 'guard' : ''].filter(Boolean).join(' ');
  const hook = own ? ' data-attacker="' + index + '"' : ' data-target-creature="' + index + '" data-side="ai"';
  return '<div class="' + classes + '" style="--rarity:' + color + ';--glow:' + color + '"' + hook + ' role="button" tabindex="0" aria-disabled="' + (own && ui.inputLocked) + '" aria-label="' + unit.name + ', ' + unit.attack + ' attack, ' + unit.health + ' health"><span class="creature-art">' + emblemSVG(unit.emblem) + '</span><span class="creature-info"><span class="creature-name">' + unit.name + '</span><span class="creature-key">' + (unit.keywords && unit.keywords.length ? unit.keywords.join(' · ') : 'Aetherborn') + '</span><span class="stats-row"><span class="power">' + unit.attack + '</span><span class="health' + (hurt ? ' damaged' : '') + '">' + unit.health + '</span></span></span></div>';
}

export function tableHTML(state, ui = {}) {
  const view = { selectedAttacker: null, inputLocked: false, muted: false, ...ui };
  const sides = state.duelists || state;
  const player = sides.player;
  const ai = sides.ai;
  const enemyHand = Array.from({ length: ai.hand.length }, () => cardBackHTML()).join('');
  const enemyBoard = ai.board.map((unit, i) => creatureHTML(unit, i, 'ai', view)).join('');
  const playerBoard = player.board.map((unit, i) => creatureHTML(unit, i, 'player', view)).join('');
  const hand = player.hand.map((card, i) => cardHTML(card, { index: i, disabled: view.inputLocked || card.cost > player.mana })).join('');
  return '<main class="table-screen"><header class="topbar"><div class="brand">AETHER <span>CLASH</span></div><div class="top-actions"><span>TURN ' + state.turn + '</span><button id="mute-btn" class="icon-btn" type="button" aria-pressed="' + view.muted + '">' + (view.muted ? 'Sound off' : 'Sound on') + '</button></div></header><div class="turnline">Turn ' + state.turn + '</div><div class="zone-label">Opponent hand · ' + ai.hand.length + '</div><div class="opponent-hand" aria-label="Opponent hand, ' + ai.hand.length + ' cards">' + enemyHand + '</div><section class="board lane opponent" aria-label="Opponent board">' + duelistHTML('Rival', ai, ai.deck.length, state.activeSide === 'ai') + (enemyBoard || '<span class="combat-note">The opposing lane is clear</span>') + '</section><div class="zone-label">Your forces</div><section class="board lane player" aria-label="Your board">' + duelistHTML('You', player, player.deck.length, state.activeSide === 'player') + (playerBoard || '<span class="combat-note">Summon a creature to take the field</span>') + '</section><div class="zone-label">Your hand · ' + player.hand.length + '</div><section class="hand-zone" aria-label="Your hand">' + hand + '</section><footer class="endbar"><span class="keyboard-hint">Choose a ready creature, then choose a target.</span><button id="end-turn-btn" class="end-turn" type="button"' + (view.inputLocked ? ' disabled' : '') + '>End Turn</button></footer></main>';
}
