import { Constraint } from '../models/Constraint.js';
import { type Context } from '../models/Context.js';
import { Use } from './Use.js';

export class IsEnumConstraint extends Constraint {
  public readonly values: unknown[];

  constructor(public readonly entry: object | unknown[]) {
    super();

    if (Array.isArray(entry)) this.values = entry;
    else this.values = Object.values(entry);
  }

  public parse(context: Context) {
    if (!this.values.includes(context.value))
      context.issues.push(
        this.issue(`Must be one of ${this.values.join(', ')}`),
      );
  }
}

export function IsEnum(
  entry:
    | Record<PropertyKey, string | number>
    | ReadonlyArray<string | number | null>,
) {
  return Use<IsEnumConstraint, Use.Type.Property>(new IsEnumConstraint(entry));
}
