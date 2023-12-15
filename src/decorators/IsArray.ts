import { Constraint } from '../models/Constraint.js';
import { Use } from './Use.js';
import { type Context } from '../models/Context.js';
import {
  type ExtractConstraintOutput,
  type AnyConstraintType,
  type ExtractConstraintInput,
  type ConstraintTypeToConstraint,
} from '../types.js';
import { normalize } from '../tools/normalize.js';
import { hasErrorInContext } from '../tools/hasErrorInContext.js';
import { createValidationErrorFromContext } from '../tools/createValidationErrorFromContext.js';

export interface IsArrayOptions {
  min?: number;
  max?: number;
  length?: number;
  nonempty?: boolean;
  early?: boolean;
}

export class IsArrayConstraint<
  TConstraint extends Constraint,
> extends Constraint<
  Array<ExtractConstraintInput<TConstraint>>,
  Array<ExtractConstraintOutput<TConstraint>>
> {
  public readonly min?: number;
  public readonly max?: number;
  public readonly length?: number;
  public readonly nonempty?: boolean;
  public readonly early?: boolean;

  constructor(
    public readonly constraint: TConstraint,
    options: IsArrayOptions,
  ) {
    super();

    if (options.min !== undefined) this.min = options.min;

    if (options.max !== undefined) this.max = options.max;

    if (options.length !== undefined) this.length = options.length;

    if (options.nonempty !== undefined) this.nonempty = options.nonempty;

    this.early = options.early ?? false;
  }

  public parse(context: Context): unknown {
    if (!Array.isArray(context.value))
      return context.issues.push(this.issue('Must be array'));

    if (this.nonempty && context.value.length === 0)
      return context.issues.push(this.issue('Must be nonempty array'));

    if (this.min !== undefined && context.value.length < this.min) {
      context.issues.push(
        this.issue(`Must be at least ${this.min} or more items`),
      );

      if (this.early) return;
    }

    if (this.max !== undefined && context.value.length > this.max) {
      context.issues.push(
        this.issue(`Must be at most ${this.max} or fewer items`),
      );

      if (this.early) return;
    }

    if (this.length !== undefined && context.value.length !== this.length) {
      context.issues.push(this.issue(`Must be exactly ${this.length} items`));

      if (this.early) return;
    }

    const promises: Array<Promise<void>> = [];

    const values: Array<ExtractConstraintOutput<TConstraint>> = [];

    for (const [index, value] of context.value.entries()) {
      const path = context.path.slice();

      path.push(index);

      const _context: Context = {
        share: context.share,
        async: context.async,
        flags: context.flags,
        origin: context.origin,
        target: context.target,
        path,
        value,
        raw: value,
        issues: [],
        inners: [],
      };

      let _promise: Promise<unknown> | null = null;

      this.constraint.execute(
        _context,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/promise-function-async
        promise => (_promise = promise),
      );

      if (_promise)
        promises.push(
          (_promise as Promise<void>).then(() => {
            if (hasErrorInContext(_context))
              context.inners.push(createValidationErrorFromContext(_context));
            else
              values[index] =
                _context.value as ExtractConstraintOutput<TConstraint>;
          }),
        );
      else if (hasErrorInContext(_context))
        context.inners.push(createValidationErrorFromContext(_context));
      else
        values[index] = _context.value as ExtractConstraintOutput<TConstraint>;
    }

    if (promises.length)
      return Promise.all(promises).then(() => {
        context.value = values;
      });
    else context.value = values;
  }
}

export function IsArray<TRawConstraint extends AnyConstraintType>(
  constraint: TRawConstraint,
  options?: IsArrayOptions,
) {
  return Use<
    IsArrayConstraint<ConstraintTypeToConstraint<TRawConstraint>>,
    Use.Type.Property
  >(new IsArrayConstraint(normalize(constraint), options ?? {}));
}
