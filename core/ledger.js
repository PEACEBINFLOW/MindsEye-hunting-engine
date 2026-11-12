// core/ledger.js
// ---------------------------------------------------
// Pure double-entry journal and accounting checks.
// ---------------------------------------------------

const validTypes = new Set(['asset', 'liability', 'equity', 'revenue', 'expense']);

export function entry({ date, debit, credit, amount, debitType = 'asset', creditType = 'equity' }) {
  if (!debit || !credit || !Number.isFinite(amount) || amount <= 0) throw new Error('Entry requires accounts and a positive finite amount');
  if (!validTypes.has(debitType) || !validTypes.has(creditType)) throw new Error('Entry has an unsupported account type');
  return { date, debit, credit, amount, debitType, creditType };
}

export function balanceCheck(entries = []) {
  const debits = entries.reduce((sum, item) => sum + item.amount, 0);
  const credits = entries.reduce((sum, item) => sum + item.amount, 0);
  return { balanced: Math.round((debits - credits) * 100) === 0, totalDebits: debits, totalCredits: credits };
}

/** Check the change equation: ΔAssets = ΔLiabilities + ΔEquity. */
export function accountingEquationCheck(entries = []) {
  let assets = 0;
  let liabilities = 0;
  let equity = 0;
  const apply = (type, side, amount) => {
    const sign = side === 'debit' ? 1 : -1;
    if (type === 'asset') assets += sign * amount;
    if (type === 'liability') liabilities -= sign * amount;
    if (type === 'equity') equity -= sign * amount;
    if (type === 'revenue') equity += side === 'credit' ? amount : -amount;
    if (type === 'expense') equity -= side === 'debit' ? amount : -amount;
  };
  for (const item of entries) {
    if (!Number.isFinite(item.amount) || item.amount <= 0) return { balanced: false, assets, liabilities, equity };
    apply(item.debitType || 'asset', 'debit', item.amount);
    apply(item.creditType || 'equity', 'credit', item.amount);
  }
  const balanced = Math.round((assets - liabilities - equity) * 100) === 0;
  return { balanced, assets, liabilities, equity };
}

export function trialBalance(entries = []) {
  const accounts = new Map();
  for (const item of entries) {
    const debit = accounts.get(item.debit) || { account: item.debit, debit: 0, credit: 0 };
    debit.debit += item.amount;
    accounts.set(item.debit, debit);
    const credit = accounts.get(item.credit) || { account: item.credit, debit: 0, credit: 0 };
    credit.credit += item.amount;
    accounts.set(item.credit, credit);
  }
  const rows = [...accounts.values()].map(row => ({ ...row, balance: row.debit - row.credit }));
  return { rows, ...balanceCheck(entries) };
}
