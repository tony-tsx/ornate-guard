import { isPromise } from 'util/types';
import { Constraint } from '../models/Constraint.js';
import { type Context } from '../models/Context.js';
import { type ConstraintType } from '../types.js';
import { normalize } from '../tools/normalize.js';
import { Use } from './Use.js';

export class IfConstraint extends Constraint {
  constructor(
    public readonly check: (context: Context) => boolean | Promise<boolean>,
    public readonly constraint: Constraint,
  ) {
    super();
  }

  public parse(context: Context): unknown {
    const result = this.check(context);

    if (isPromise(result))
      return result.then(result => {
        if (result) return this.constraint.parse(context);
      });

    if (result) return this.constraint.parse(context);
  }
}

export function If(
  check: (context: Context) => boolean | Promise<boolean>,
  raw: ConstraintType,
) {
  return Use(new IfConstraint(check, normalize(raw)));
}
