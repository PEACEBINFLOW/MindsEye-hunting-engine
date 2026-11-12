// core/schema.js
// ---------------------------------------------------
// Dependency-free validator for accounting format records.
// ---------------------------------------------------

const requiredStrings = (value) => Array.isArray(value) && value.every(item => typeof item === 'string');

export function validateFormat(format) {
  const errors = [];
  const check = (condition, path, message) => { if (!condition) errors.push({ path, message }); };
  check(format && typeof format === 'object' && !Array.isArray(format), '$', 'must be an object');
  if (!format || typeof format !== 'object') return { valid: false, errors };
  check(typeof format.id === 'string' && /^[a-z0-9-]+$/.test(format.id), '$.id', 'must be a kebab-case id');
  check(typeof format.name === 'string' && format.name.length > 0, '$.name', 'must be a non-empty string');
  check(requiredStrings(format.region), '$.region', 'must be an array of strings');
  check(format.origin && typeof format.origin.period === 'string' && typeof format.origin.note === 'string', '$.origin', 'requires period and note');
  check(format.theory && typeof format.theory.definition === 'string' && typeof format.theory.purpose === 'string' && requiredStrings(format.theory.principles) && requiredStrings(format.theory.rules) && requiredStrings(format.theory.equation_links), '$.theory', 'requires definition, purpose, principles, rules, and equation_links');
  const practical = format.practical;
  check(practical && practical.layout && requiredStrings(practical.layout.columns) && requiredStrings(practical.layout.sides), '$.practical.layout', 'requires columns and sides arrays');
  check(practical && requiredStrings(practical.posting_steps), '$.practical.posting_steps', 'must be an array of strings');
  check(practical && practical.example_template && requiredStrings(practical.example_template.accounts) && Array.isArray(practical.example_template.entry_patterns) && practical.example_template.entry_patterns.length > 0, '$.practical.example_template', 'requires accounts and at least one entry pattern');
  for (const [index, pattern] of (practical?.example_template?.entry_patterns || []).entries()) {
    check(pattern && typeof pattern.debit === 'string' && typeof pattern.credit === 'string' && Array.isArray(pattern.amount_range) && pattern.amount_range.length === 2 && pattern.amount_range.every(Number.isFinite) && pattern.amount_range[0] > 0 && pattern.amount_range[1] >= pattern.amount_range[0], `$.practical.example_template.entry_patterns[${index}]`, 'requires debit, credit and a valid positive amount_range');
    check(['asset', 'liability', 'equity', 'revenue', 'expense'].includes(pattern.debitType) && ['asset', 'liability', 'equity', 'revenue', 'expense'].includes(pattern.creditType), `$.practical.example_template.entry_patterns[${index}]`, 'requires valid debitType and creditType');
  }
  check(practical && requiredStrings(practical.common_errors), '$.practical.common_errors', 'must be an array of strings');
  check(practical?.exercise && typeof practical.exercise.prompt === 'string' && typeof practical.exercise.answer_rule === 'string', '$.practical.exercise', 'requires prompt and answer_rule');
  check(format.impact && requiredStrings(format.impact.on_statements) && format.impact.on_equation && ['+', '-', '0'].includes(format.impact.on_equation.assets) && ['+', '-', '0'].includes(format.impact.on_equation.liabilities) && ['+', '-', '0'].includes(format.impact.on_equation.equity) && requiredStrings(format.impact.on_decisions) && requiredStrings(format.impact.risk_if_wrong), '$.impact', 'has invalid impact content');
  check(format.depth && [1, 2, 3].every(level => typeof format.depth[`level_${level}`] === 'string'), '$.depth', 'requires all three depth descriptions');
  check(requiredStrings(format.links), '$.links', 'must be an array of strings');
  check(['high', 'medium', 'low'].includes(format.confidence), '$.confidence', 'must be high, medium, or low');
  check(requiredStrings(format.needs_verification), '$.needs_verification', 'must be an array of strings');
  return { valid: errors.length === 0, errors };
}

export function assertValidFormat(format) {
  const result = validateFormat(format);
  if (!result.valid) throw new Error(`Invalid format ${format?.id || '<unknown>'}: ${result.errors.map(error => `${error.path} ${error.message}`).join('; ')}`);
  return format;
}
