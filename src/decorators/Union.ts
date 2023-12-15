import { Constraint } from '../models/Constraint.js';
import { type Context } from '../models/Context.js';
import { UnionValidationError } from '../models/UnionValidationError.js';
import { createValidationErrorFromContext } from '../tools/createValidationErrorFromContext.js';
import { normalize } from '../tools/normalize.js';
import {
  type ExtractConstraintInput,
  type AnyConstraintType,
  type ExtractConstraintOutput,
} from '../types.js';
import { Use } from './Use.js';

interface UnionContext extends Context {
  constraint: Constraint;
}

export class UnionConstraint<TInput, TOutput> extends Constraint<
  TInput,
  TOutput
> {
  constructor(public readonly constraints: readonly Constraint[]) {
    super();

    this.constraints = constraints;
  }

  public parse(context: Context): unknown {
    let correct: Context | undefined;
    const promises: Array<Promise<unknown>> = [];

    const contexts: UnionContext[] = [];

    for (let i = 0; i < this.constraints.length; i += 1) {
      const constraint = this.constraints[i];

      const _context: UnionContext = {
        share: context.share,
        async: context.async,
        origin: context.origin,
        path: context.path,
        raw: context.raw,
        target: context.target,
        value: context.value,
        flags: context.flags,
        constraint,
        issues: [],
        inners: [],
      };

      contexts.push(_context);

      let _promise: Promise<unknown> | undefined;

      constraint.execute(
        _context, // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/promise-function-async
        promise => (_promise = promise),
      );

      if (_promise)
        promises.push(
          _promise.then(() => {
            if (!_context.issues.length && !_context.inners.length)
              correct = _context;
          }),
        );
      else if (!_context.issues.length && !_context.inners.length) {
        correct = _context;
        break;
      }
    }

    if (promises.length)
      return Promise.all(promises).then(() => {
        if (correct) context.value = correct.value;
        else
          context._ = new UnionValidationError({
            target: context.target,
            origin: context.origin,
            path: context.path,
            value: context.value,
            constraints: contexts.map(context => [
              context.constraint,
              createValidationErrorFromContext(context),
            ]),
          });
      });
    else if (correct) context.value = correct.value;
    else
      context._ = new UnionValidationError({
        target: context.target,
        origin: context.origin,
        path: context.path,
        value: context.value,
        constraints: contexts.map(context => [
          context.constraint,
          createValidationErrorFromContext(context),
        ]),
      });
  }
}

type UnionWalk<
  TConstraints extends [
    AnyConstraintType,
    AnyConstraintType,
    ...AnyConstraintType[],
  ],
> = TConstraints extends Array<infer T>
  ? { input: ExtractConstraintInput<T>; output: ExtractConstraintOutput<T> }
  : never;

export function Union<
  TConstraints extends [
    AnyConstraintType,
    AnyConstraintType,
    ...AnyConstraintType[],
  ],
  TType extends Use.Type = Use.Type.Any,
  _ extends UnionWalk<TConstraints> = UnionWalk<TConstraints>,
>(
  ...constraints: TConstraints
): Use<UnionConstraint<_['input'], _['output']>, TType> {
  return Use<UnionConstraint<_['input'], _['output']>, TType>(
    new UnionConstraint(constraints.map(normalize)),
  );
}
