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

module.exports = { JACKET_EP1, JACKET_EP2, JACKET_EP4, JACKET_EP7, JACKET_EP10 };
