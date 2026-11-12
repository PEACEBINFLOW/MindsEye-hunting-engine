// core/prng.js
// ---------------------------------------------------
// Pure seeded PRNG for deterministic accounting examples.
// ---------------------------------------------------

/** Mulberry32 PRNG; identical integer seeds produce identical sequences. */
export function mulberry32(seed = 1) {
  let state = Number(seed) >>> 0;
  return function random() {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14) >>> 0) / 4294967296);
  };
}

export function seededInteger(random, min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}
