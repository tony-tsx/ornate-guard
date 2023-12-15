import { Constraint } from '../models/Constraint.js';
import { type Context } from '../models/Context.js';
import { Use } from './Use.js';

type IsNaNMode = 'strict' | 'comprensive';

export class IsNaNConstraint extends Constraint<number, number> {
  constructor(public readonly mode: IsNaNMode) {
    super();
  }

  public parse(context: Context): unknown {
    if (this.mode === 'strict' && typeof context.value !== 'number')
      return context.issues.push(this.issue('Must be NaN'));

    if (!isNaN(Number(context.value)))
      return context.issues.push(this.issue('Must be NaN'));
  }
}

export function IsNaN(mode: IsNaNMode = 'comprensive') {
  return Use<IsNaNConstraint, Use.Type.Property>(new IsNaNConstraint(mode));
}
