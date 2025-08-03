// layoutSpiral.ts
export type Photo = { id: string; uri: string; w: number; h: number };

type Placed = {
  id: string;
  uri: string;
  x: number; y: number;   // center position in canvas coords
  w: number; h: number;   // drawn size (scaled)
  rot: number;            // radians
  r: number;              // bounding circle radius (for culling)
};

const GOLDEN = Math.PI * (3 - Math.sqrt(5)); // ~2.39996
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function layoutSpiral(
  items: Photo[],
  opts?: {
    center?: { x: number; y: number };
    targetMinor?: number;    // target shorter side in px
    margin?: number;         // gap between cards
    step?: number;           // spiral step
    seed?: number;           // rng seed for stable randomness
  }
): Placed[] {
  const center = opts?.center ?? { x: 0, y: 0 };
  const targetMinor = opts?.targetMinor ?? 220;
  const margin = opts?.margin ?? 16;
  const step = opts?.step ?? 140;
  const rand = mulberry32(opts?.seed ?? 12345);

  // spatial hash for quick overlap checks
  const CELL = 260;
  const grid = new Map<string, number>();
  const placed: Placed[] = [];

  const cellKey = (x: number, y: number) =>
    `${Math.floor(x / CELL)},${Math.floor(y / CELL)}`;

  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    // scale so the shorter side ~= targetMinor
    const k = targetMinor / Math.min(it.w, it.h);
    const w = it.w * k;
    const h = it.h * k;
    const rad = (Math.hypot(w, h) * 0.5) + margin;

    // center-out spiral position
    let theta = i * GOLDEN;
    let radius = step * Math.sqrt(i + 0.5);

    // small jitter for natural look
    radius += (rand() - 0.5) * 12;

    let x = center.x + radius * Math.cos(theta);
    let y = center.y + radius * Math.sin(theta);

    // quick overlap avoidance using neighbor cells
    const tryKey = (xx: number, yy: number) =>
      cellKey(xx, yy);

    let tries = 0;
    while (tries < 6) {
      let ok = true;
      const k0 = tryKey(x, y);
      for (const dx of [-1, 0, 1]) {
        for (const dy of [-1, 0, 1]) {
          const kN = `${Math.floor(x / CELL) + dx},${Math.floor(y / CELL) + dy}`;
          const idx = grid.get(kN);
          if (idx == null) continue;
          const other = placed[idx];
          const dist = Math.hypot(x - other.x, y - other.y);
          if (dist < other.r + rad) {
            ok = false;
            break;
          }
        }
        if (!ok) break;
      }
      if (ok) break;
      radius += 18; // bump outward a bit and retry
      x = center.x + radius * Math.cos(theta);
      y = center.y + radius * Math.sin(theta);
      tries++;
    }

    const rotDeg = -20 + rand() * 40;
    const rot = (rotDeg * Math.PI) / 180;

    const idx = placed.length;
    placed.push({ id: it.id, uri: it.uri, x, y, w, h, rot, r: rad });

    // register in grid
    grid.set(cellKey(x, y), idx);
  }
  return placed;
}
