import { type Context } from '../models/Context.js';
import { ValidationError } from '../models/ValidationError.js';

export function createValidationErrorFromContext(
  context: Context,
): ValidationError {
  if (context._) {
    context._.issues.push(...context.issues);

    context._.inners.push(...context.inners);

    return context._;
  }

  return new ValidationError({
    target: context.target,
    origin: context.origin,
    value: context.value,
    path: context.path,
    inners: context.inners,
    issues: context.issues,
  });
}
