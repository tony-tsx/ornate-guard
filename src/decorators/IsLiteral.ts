import { Constraint } from '../models/Constraint.js';
import { type Context } from '../models/Context.js';
import { Use } from './Use.js';

export class IsLiteralConstraint<TValue> extends Constraint<TValue, TValue> {
  constructor(public readonly value: TValue) {
    super();
  }

  public parse(context: Context<unknown>): void {
    if (context.value !== this.value)
      context.issues.push(this.issue(`Must be ${String(this.value)}`));
  }
}

export function IsLiteral<TValue>(value: TValue) {
  return Use<IsLiteralConstraint<TValue>, Use.Type.Property>(
    new IsLiteralConstraint(value),
  );
}
