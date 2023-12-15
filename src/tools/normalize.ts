import { AnonymousConstraint } from '../models/AnonymousConstraint.js';
import { Constraint } from '../models/Constraint.js';
import {
  type AnyConstraintType,
  IS_CONSTRAINT_REF,
  type ConstraintTypeToConstraint,
  type ExtractConstraintInput,
  type ExtractConstraintOutput,
} from '../types.js';

export function normalize<TRawConstraint extends AnyConstraintType>(
  input: TRawConstraint,
): ConstraintTypeToConstraint<TRawConstraint> {
  if (typeof input === 'function') {
    // @ts-expect-error: TODO
    if (IS_CONSTRAINT_REF in input) return input.constraint;

    return new AnonymousConstraint<
      ExtractConstraintInput<TRawConstraint>,
      ExtractConstraintOutput<TRawConstraint>
    >(input) as ConstraintTypeToConstraint<TRawConstraint>;
  }

  if (typeof input !== 'object') throw new TypeError('TODO');

  if (IS_CONSTRAINT_REF in input)
    return input.constraint as ConstraintTypeToConstraint<TRawConstraint>;

  if (!(input instanceof Constraint)) throw new TypeError('TODO');

  return input as ConstraintTypeToConstraint<TRawConstraint>;
}
