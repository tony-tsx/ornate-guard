import { Constraint } from '../models/Constraint.js';
import { type Context } from '../models/Context.js';
import { Use } from './Use.js';

export interface IsDateOptions {
  coerce?: boolean;
  min?: Date;
  max?: Date;
}

export class IsDateConstraint<
  TCoerce extends true | false = false,
> extends Constraint<
  TCoerce extends true ? string | number | Date : Date,
  Date
> {
  public readonly coerce?: boolean;
  public readonly min?: Date;
  public readonly max?: Date;

  constructor(options: IsDateOptions) {
    super();

    this.coerce = options.coerce ?? false;

    if (options.min !== undefined) this.min = options.min;

    if (options.max !== undefined) this.max = options.max;
  }

  public parse(context: Context) {
    if (this.coerce)
      context.value = new Date(context.value as number | string | Date);

    if (typeof context.value !== 'object')
      return context.issues.push(this.issue(`Must be date`));

    if (!(context.value instanceof Date))
      return context.issues.push(this.issue(`Must be date`));

    if (isNaN(context.value.getTime()))
      return context.issues.push(this.issue(`Must be valid date`));

    if (this.min !== undefined && context.value < this.min)
      context.issues.push(
        this.issue(`Must be at least ${this.min.toISOString()}`),
      );

    if (this.max !== undefined && context.value > this.max)
      context.issues.push(
        this.issue(`Must be at most ${this.max.toISOString()}`),
      );
  }
}

export function IsDate(options: IsDateOptions = {}) {
  return Use<IsDateConstraint, Use.Type.Property>(
    new IsDateConstraint(options),
  );
}
