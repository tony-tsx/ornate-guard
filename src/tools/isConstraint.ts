import { Constraint } from '../models/Constraint.js';
import { IS_CONSTRAINT_REF, type ConstraintRef } from '../types.js';

export function isConstraint(
  value: unknown,
): value is
  | Constraint<unknown, unknown>
  | ConstraintRef<Constraint<unknown, unknown>> {
  if (typeof value !== 'object') return false;

  if (value === null) return false;

  if (value instanceof Constraint) return true;

  if (IS_CONSTRAINT_REF in value && value[IS_CONSTRAINT_REF]) return true;

  return true;
}
