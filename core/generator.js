// core/generator.js
// ---------------------------------------------------
// Deterministic theory and practical packet generator.
// ---------------------------------------------------

import { accountingEquationCheck, balanceCheck } from './ledger.js';
import { mulberry32, seededInteger } from './prng.js';
import { assertValidFormat } from './schema.js';
import cashBook from './formats/cash-book-three-column.json' with { type: 'json' };
import journal from './formats/double-entry-journal.json' with { type: 'json' };
import ledgerFormat from './formats/general-ledger.json' with { type: 'json' };
import trialBalanceFormat from './formats/trial-balance.json' with { type: 'json' };

// Format discovery is data-driven in browsers through this generated catalogue import list.
export const formats = [cashBook, journal, ledgerFormat, trialBalanceFormat].map(assertValidFormat);
export const getFormat = (id) => formats.find(format => format.id === id) || null;

function buildExample(format, seed, currency) {
  const random = mulberry32(seed);
  const entries = format.practical.example_template.entry_patterns.map(pattern => ({
    date: '2025-01-01',
    debit: pattern.debit,
    credit: pattern.credit,
    amount: seededInteger(random, pattern.amount_range[0], pattern.amount_range[1]),
    debitType: pattern.debitType,
    creditType: pattern.creditType,
  }));
  const check = balanceCheck(entries);
  const equation = accountingEquationCheck(entries);
  if (!check.balanced || !equation.balanced) throw new Error(`Generated example failed validation for ${format.id}`);
  return { currency, entries, total_debits: check.totalDebits, total_credits: check.totalCredits, accounting_equation: equation, validation: { balanced: true, equation_balanced: true } };
}

export function generate({ formatId, dimension = 'both', depth = 1, seed = 1, currency = 'BWP' } = {}) {
  const format = getFormat(formatId);
  if (!format) throw new Error(`Unknown formatId: ${formatId}`);
  if (!['theory', 'practical', 'both'].includes(dimension)) throw new Error('dimension must be theory, practical, or both');
  if (![1, 2, 3].includes(Number(depth))) throw new Error('depth must be 1, 2, or 3');
  const level = Number(depth);
  const packet = { id: format.id, name: format.name, region: format.region, dimension, depth: level };
  if (dimension !== 'practical') packet.theory = { ...format.theory };
  if (dimension !== 'theory') {
    packet.practical = { ...format.practical, worked_example: buildExample(format, Number(seed) || 0, currency) };
  }
  packet.impact = level >= 2 ? structuredClone(format.impact) : { summary: format.depth.level_1 };
  packet.depth = level === 1
    ? { level_1: format.depth.level_1 }
    : level === 2
      ? { level_1: format.depth.level_1, level_2: format.depth.level_2 }
      : { ...format.depth, linked_formats: format.links.map(getFormat).filter(Boolean).map(({ id, name }) => ({ id, name })) };
  return packet;
}
