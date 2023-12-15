import { Constraint } from '../models/Constraint.js';
import { type Context } from '../models/Context.js';
import { Use } from './Use.js';

export interface IsNumberOptions<TCoerce extends true | false = false> {
  coerce?: TCoerce;
  min?: number;
  max?: number;
  integer?: boolean;
  positive?: boolean;
  nonpositive?: boolean;
  negative?: boolean;
  nonnegative?: boolean;
  finite?: boolean;
  safe?: boolean;
}

export class IsNumberConstraint<
  TCoerce extends true | false = false,
> extends Constraint<TCoerce extends true ? unknown : number, number> {
  public readonly coerce?: boolean;
  public readonly min?: number;
  public readonly max?: number;
  public readonly integer?: boolean;
  public readonly positive?: boolean;
  public readonly nonpositive?: boolean;
  public readonly negative?: boolean;
  public readonly nonnegative?: boolean;
  public readonly finite?: boolean;
  public readonly safe?: boolean;

  constructor(options: IsNumberOptions<TCoerce>) {
    super();

    this.coerce = options.coerce ?? false;

    if (options.min !== undefined) this.min = options.min;

    if (options.max !== undefined) this.max = options.max;

    if (options.integer !== undefined) this.integer = options.integer;

    if (options.positive !== undefined) this.positive = options.positive;

    if (options.nonpositive !== undefined)
      this.nonpositive = options.nonpositive;

    if (options.negative !== undefined) this.negative = options.negative;

    if (options.nonnegative !== undefined)
      this.nonnegative = options.nonnegative;

    if (options.finite !== undefined) this.finite = options.finite;

    if (options.safe !== undefined) this.safe = options.safe;
  }

  public parse(context: Context): unknown {
    if (this.coerce) context.value = Number(context.value);

    if (typeof context.value !== 'number')
      return context.issues.push(this.issue('Must be a number'));

    if (isNaN(context.value))
      return context.issues.push(this.issue('Must be a number'));

    if (this.min !== undefined && context.value < this.min)
      context.issues.push(this.issue(`Must be at least ${this.min}`));

    if (this.max !== undefined && context.value > this.max)
      context.issues.push(this.issue(`Must be at most ${this.max}`));

    if (this.integer !== undefined && !Number.isInteger(context.value))
      context.issues.push(this.issue('Must be an integer'));

    if (this.positive !== undefined && context.value <= 0)
      context.issues.push(this.issue('Must be positive'));

    if (this.nonpositive !== undefined && context.value > 0)
      context.issues.push(this.issue('Must be nonpositive'));

    if (this.negative !== undefined && context.value >= 0)
      context.issues.push(this.issue('Must be negative'));

    if (this.nonnegative !== undefined && context.value < 0)
      context.issues.push(this.issue('Must be nonnegative'));

    if (this.finite !== undefined && !Number.isFinite(context.value))
      context.issues.push(this.issue('Must be finite'));

    if (
      this.safe !== undefined &&
      context.value < Number.MIN_SAFE_INTEGER &&
      context.value > Number.MAX_SAFE_INTEGER
    )
      context.issues.push(this.issue('Must be safe'));
  }
}

export function IsNumber<TCoerce extends true | false = false>(
  options: IsNumberOptions<TCoerce> = {},
) {
  return Use(new IsNumberConstraint(options));
}

export function IsInteger<TCoerce extends true | false = false>(
  options: Omit<IsNumberOptions<TCoerce>, 'integer'> = {},
) {
  return Use(new IsNumberConstraint({ ...options, integer: true }));
}
