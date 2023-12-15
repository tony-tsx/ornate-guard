import { type Issue } from '../models/Issue.js';
import { UnionValidationError } from '../models/UnionValidationError.js';
import { type ValidationError } from '../models/ValidationError.js';

function toNotationEntries<TTarget extends object, TFormat>(
  validationError: ValidationError<TTarget>,
  format: (issue: Issue, validationError: ValidationError) => TFormat,
  path: string,
): Array<[string, TFormat]> {
  const entries: Array<[string, TFormat]> = [];

  if (validationError.issues.length)
    for (const issue of validationError.issues)
      entries.push([path, format(issue, validationError)]);

  if (validationError instanceof UnionValidationError) return entries;

  for (const inner of validationError.inners) {
    const innerKey = inner.path.slice().pop()!;
    const _entries = toNotationEntries(
      inner,
      format,
      `${path}.${innerKey.toString()}`,
    );

    for (const entry of _entries) entries.push(entry);
  }

  return entries;
}

const defaultFormat = (issue: Issue) => issue.message;

export type ToNotationIssueFormat<TFormat> = (issue: Issue) => TFormat;

export function toNotation<TTarget extends object, TFormat = string>(
  validationError: ValidationError<TTarget>,
  format?: ToNotationIssueFormat<TFormat> | null | undefined,
  root?: string | null | undefined,
) {
  const notation: Record<string, TFormat[]> = {};
  const entries = toNotationEntries(
    validationError,
    format ?? (defaultFormat as ToNotationIssueFormat<TFormat>),
    root ?? '$',
  );

  for (const [path, message] of entries) {
    if (!notation[path]) notation[path] = [];

    notation[path].push(message);
  }

  return notation;
}
