import { Constraint } from '../models/Constraint.js';
import { type Context } from '../models/Context.js';
import { isPromise } from '../tools/isPromise.js';
import { normalize } from '../tools/normalize.js';
import { type ConstraintType } from '../types.js';
import { Use } from './Use.js';

export class LazyConstraint extends Constraint {
  constructor(public readonly constraint: Constraint) {
    super();
  }

  public parse(context: Context): unknown {
    if (!context.async) throw new Error('Cannot use lazy in sync mode');

    if (!isPromise(context.value))
      context.value = Promise.resolve(context.value);

    return (context.value as Promise<unknown>).then(value => {
      context.value = value;

      return this.constraint.parse(context);
    });
  }
}

export function Lazy(raw: ConstraintType) {
  return Use<LazyConstraint, Use.Type.Property>(
    new LazyConstraint(normalize(raw)),
  );
}
