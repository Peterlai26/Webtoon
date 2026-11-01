// Shared shorthands for EP66-70 (Arc 7, the nightless desert city Kala-Zahr).
'use strict';

module.exports = {
  // ch.66 L15-19: the white jacket with black and red stripes, torn and sooty; Sera's
  // mirror-ore sword and Grimm's soul-nailing mace strapped crossed on the back.
  // (EP46-65 drew the black One-Face shirt — see docs/01-source-review.md §15 #55)
  REY: { torn: true, scorched: true, dirty: true, backSword: true, backMace: true },
  // ch.66 L251 - ch.67: spare cloth wound round the head against the sun
  WRAP: '#e8dcc4',
  // Nox is grown and pact-bound since EP26; he shrinks to puppy size by choice (ch.66 L137) — drawn with a small scale
  NOX: { grown: 2, sigil: true },
  // Gula: torn dress; from ch.66 L231 Grimm's half skull mask is tied at her left hip
  GULA: { dress: 'torn', hipMask: true },
  GULA_HOLD: { dress: 'torn' },
  // Sera's black sword, reforged and fused with mirror ore (white light lines)
  SW: (a, o = {}) => ({ n: 'sword', a, len: 240, ember: true, glass: true, ...o }),
  MASK: { n: 'skullMask', half: true },
};
