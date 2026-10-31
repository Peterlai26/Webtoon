// Costume / injury continuity across episodes (source-derived; see docs/03-continuity.md).
// Holes are burn/bullet holes in Rey's jacket: clothes do NOT reset with his body.
'use strict';
const H = (side, y, r = 10, dx = 0) => ({ side, y, r, dx });

// EP1: centre chest shot, then shoulder / abdomen / chest volley
const JACKET_EP1 = [H('c', 0.32, 12), H('right', 0.12), H('left', 0.62)];
// EP2: + left shoulder, flank, abdomen (3 rifle shots), + right shoulder (2 more shots; thigh is on trousers)
const JACKET_EP2 = [...JACKET_EP1, H('left', 0.1, 9), H('left', 0.45, 9), H('right', 0.7, 9), H('right', 0.25, 8)];
// EP4: turret volley ("เกือบสิบจุด") – more holes, one button lost
const JACKET_EP4 = [...JACKET_EP2, H('c', 0.55, 9, 14), H('left', 0.3, 8, -6), H('right', 0.45, 8, 4), H('c', 0.8, 8, -10)];
// EP7: replacement jacket (same co-op design); shotgun blast to left chest, later pinned shut
const JACKET_EP7 = [H('left', 0.34, 16)];
// EP10: spear through left chest
const JACKET_EP10 = [...JACKET_EP7, H('left', 0.4, 14, 10)];

// EP11: same jacket, scorched by the fire-extinguisher blast (ch.11 L52)
const REY_EP11 = { holes: JACKET_EP10, pin: true, scorched: true, apron: false, headlamp: false, labcoat: false };
// EP16: Vane's daggers slash the jacket front and left sleeve (ch.16 L36)
const REY_EP16 = { ...REY_EP11, torn: true };
// EP18 (end) - EP20: torn and caked with mud, Sera's sword strapped across the back (ch.18 L216, ch.19 L12-18)
const REY_EP18 = { ...REY_EP16, muddy: true };
const REY_EP19 = { ...REY_EP18, backSword: true };

// EP21: the EP19 jacket, shredded and blood-soaked by the end of the trial (ch.21 L132)
// EP22: training in the black long-sleeved shirt, sleeves rolled to the elbow (ch.22 L10)
// EP23: the white jacket washed of last night's blood, worn over the black shirt (ch.23 L12)
const REY_EP23 = { ...REY_EP16 };
// EP24: back of the jacket clawed open (ch.24 L78), chest scorched by magma (ch.24 L274)
const REY_EP24 = { ...REY_EP23, torn: true, scorched: true, blood: true };
// EP26-29: a long black coat over the shirt (ch.26 L62); EP30 epilogue: over the white jacket (ch.30 L178)
const REY_EP26 = { outfit: 'coat', inner: 'shirt' };
const REY_EP30 = { outfit: 'coat', inner: 'jacket' };

module.exports = { REY_EP23, REY_EP24, REY_EP26, REY_EP30, JACKET_EP1, JACKET_EP2, JACKET_EP4, JACKET_EP7, JACKET_EP10, REY_EP11, REY_EP16, REY_EP18, REY_EP19 };
