/* eslint-disable @typescript-eslint/method-signature-style */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Constraint } from '../models/Constraint.js';
import { type Context } from '../models/Context.js';
import { normalize } from '../tools/normalize.js';
import { type AnyConstraintType, type ConstraintType } from '../types.js';
import { Use } from './Use.js';

export class ChainConstraint<TInput, TOutput> extends Constraint<
  TInput,
  TOutput
> {
  constructor(public constraints: Constraint[]) {
    super();
  }

  public parse(context: Context) {
    let promise: Promise<unknown> | undefined;

    for (const constraint of this.constraints)
      if (promise)
        promise = promise.then(() => {
          if (context.issues.length) return;

          if (context.inners.length) return;

          constraint.execute(
            context,
            // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/promise-function-async
            p => (promise = p),
          );
        });
      else
        constraint.execute(
          context,
          // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/promise-function-async
          p => (promise = p),
        );
  }
}

interface ChainWalkFulfilled<TInput, TOutput> {
  status: 'fulfilled';
  input: TInput;
  output: TOutput;
}

interface ChainWalkRejected<TMessage extends string> {
  status: 'rejected';
  message: TMessage;
}

type ChainWalk<TConstraints extends AnyConstraintType[]> =
  TConstraints extends [infer TConstraint1, ...infer TRest1]
    ? TConstraint1 extends ConstraintType<infer TInput1, infer TOutput1>
      ? TRest1 extends [infer TConstraint2, ...infer TRest2]
        ? TConstraint2 extends ConstraintType<infer TInput2, infer TOutput2>
          ? TOutput1 extends TInput2
            ? TRest2 extends AnyConstraintType[]
              ? ChainWalk<[TConstraint2, ...TRest2]> extends infer T
                ? T extends ChainWalkRejected<infer TMessage>
                  ? ChainWalkRejected<TMessage>
                  : T extends ChainWalkFulfilled<any, infer TOutput>
                    ? ChainWalkFulfilled<TInput1, TOutput>
                    : never
                : never
              : ChainWalkFulfilled<TInput1, TOutput2>
            : ChainWalkRejected<'is not compatible'>
          : ChainWalkRejected<'is not constraint'>
        : ChainWalkFulfilled<TInput1, TOutput1>
      : ChainWalkRejected<'is not constraint'>
    : ChainWalkFulfilled<unknown, unknown>;

export type ChainUse<
  TConstraints extends AnyConstraintType[],
  TType extends Use.Type,
> = ChainWalk<TConstraints> extends ChainWalkFulfilled<
  infer TInput,
  infer TOutput
>
  ? Use<ChainConstraint<TInput, TOutput>, Use.Type.Any> & {
      add<TConstraint extends ConstraintType<TOutput, any>>(
        constraint: TConstraint,
      ): ChainUse<[...TConstraints, TConstraint], TType>;
    }
  : never;

export function Chain<
  TConstraints extends AnyConstraintType[],
  TType extends Use.Type = Use.Type.Any,
>(...constraints: TConstraints): ChainUse<TConstraints, TType>;
export function Chain<TType extends Use.Type = Use.Type.Any>(
  ...constraints: [ConstraintType, ConstraintType, ...ConstraintType[]]
) {
  const use = Use<ChainConstraint<unknown, unknown>, TType>(
    new ChainConstraint(constraints.map(normalize)),
  ) as ChainUse<AnyConstraintType[], TType>;

  Object.defineProperty(use, 'add', {
    value(constraint: AnyConstraintType) {
      return Chain(...constraints, constraint);
    },
  });

  return use;
}
