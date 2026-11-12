// core/test/core.test.js
// ---------------------------------------------------
// Core format validation, determinism and balance tests.
// ---------------------------------------------------

import test from 'node:test';
import assert from 'node:assert/strict';
import { formats, generate } from '../generator.js';
import { validateFormat } from '../schema.js';

test('all initial format files pass the hand-written validator', () => {
  assert.ok(formats.length >= 3);
  for (const format of formats) assert.deepEqual(validateFormat(format), { valid: true, errors: [] });
});

test('same generation input produces byte-identical JSON', () => {
  const input = { formatId: 'cash-book-three-column', dimension: 'both', depth: 3, seed: 42, currency: 'BWP' };
  assert.equal(JSON.stringify(generate(input)), JSON.stringify(generate(input)));
});

test('every initial format, dimension and depth produces balanced examples', () => {
  for (const format of formats) for (const dimension of ['theory', 'practical', 'both']) for (const depth of [1, 2, 3]) {
    const packet = generate({ formatId: format.id, dimension, depth, seed: 11 });
    if (dimension !== 'theory') {
      assert.equal(packet.practical.worked_example.validation.balanced, true);
      assert.equal(packet.practical.worked_example.validation.equation_balanced, true);
    }
  }
});
