import { type ValidationError } from '../models/ValidationError.js';

function _toString(
  validationError: ValidationError,
  indentCount: number = 0,
  addsReference = true,
): string[] {
  const lines: string[] = [];
  const indent = Array(indentCount).fill(' ').join('');

  if (addsReference)
    lines.push(`${indent}${validationError.target.constructor.name}:`);

  for (const issue of validationError.issues)
    lines.push(`${indent}  - ${issue.message}`);

  for (const inner of validationError.inners)
    lines.push(
      `${indent}  - ${String(inner.path[inner.path.length - 1])}:`,
      ..._toString(inner, indentCount + 2, false),
    );

  return lines;
}

export function toString(validationError: ValidationError) {
  return _toString(validationError).join('\n');
}
