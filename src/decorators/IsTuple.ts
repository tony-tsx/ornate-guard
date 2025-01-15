import { Constraint } from '../models/Constraint.js';
import { type Context } from '../models/Context.js';
import { createValidationErrorFromContext } from '../tools/createValidationErrorFromContext.js';
import { hasErrorInContext } from '../tools/hasErrorInContext.js';
import { normalize } from '../tools/normalize.js';
import { type AnyConstraintType } from '../types.js';
import { Use } from './Use.js';

type TupleWalk<
  TConstraints extends readonly AnyConstraintType[],
  K extends keyof Constraint,
> = TConstraints extends readonly [infer T1, ...infer R1]
  ? T1 extends Constraint
    ? R1 extends readonly [infer T2, ...infer R2]
      ? // @ts-expect-error: TODO
        [T1[K], ...TupleWalk<[T2, ...R2], K>]
      : [T1[K]]
    : []
  : [];

export class IsTupleConstraint<
  TConstraints extends readonly AnyConstraintType[],
> extends Constraint<
  TupleWalk<TConstraints, ' types:input'>,
  TupleWalk<TConstraints, ' types:output'>
> {
  public readonly constraints: Constraint[];

  constructor(constraints: TConstraints) {
    super();
    this.constraints = constraints.map(constraint => normalize(constraint));
  }

  public parse(context: Context): unknown | Promise<unknown> {
    if (!Array.isArray(context.value))
      return context.issues.push(this.issue('Must be a tuple'));

    if (context.value.length !== this.constraints.length)
      return context.issues.push(
        this.issue(`Must be tuple with ${this.constraints.length} items`),
      );

    const promises: Array<Promise<void>> = [];

    const values: unknown[] = [];

    for (let index = 0; index < this.constraints.length; index++) {
      const constraint = this.constraints[index];
      const value = context.value[index];
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

      constraint.execute(
        _context,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/promise-function-async
        promise => (_promise = promise),
      );

      if (_promise)
        promises.push(
          (_promise as Promise<void>).then(() => {
            if (hasErrorInContext(_context))
              context.inners.push(createValidationErrorFromContext(_context));
            else values[index] = _context.value;
          }),
        );
      else if (hasErrorInContext(_context))
        context.inners.push(createValidationErrorFromContext(_context));
      else values[index] = _context.value;
    }

    if (promises.length)
      return Promise.all(promises).then(() => {
        context.value = values;
      });
    else context.value = values;
  }
}

export function IsTuple<TConstraints extends readonly AnyConstraintType[]>(
  constraints: TConstraints,
) {
  return Use<IsTupleConstraint<TConstraints>, Use.Type.Property>(
    new IsTupleConstraint(constraints),
  );
}
