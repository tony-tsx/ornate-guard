import { Constraint } from '../models/Constraint.js';
import { type Context } from '../models/Context.js';
import { Use } from './Use.js';

export interface IsBigIntOptions<TCoerce extends true | false = false> {
  coerce?: TCoerce;
  min?: number | bigint;
  max?: number | bigint;
  positive?: boolean;
  nonpositive?: boolean;
  negative?: boolean;
  nonnegative?: boolean;
}

export class IsBigIntConstraint<
  TCoerce extends true | false = false,
> extends Constraint<TCoerce extends true ? string | bigint | number : bigint> {
  public readonly coerce: boolean;

  public readonly min?: number | bigint;
  public readonly max?: number | bigint;
  public readonly positive?: boolean;
  public readonly nonpositive?: boolean;
  public readonly negative?: boolean;
  public readonly nonnegative?: boolean;

  constructor(options: IsBigIntOptions<TCoerce>) {
    super();

    this.coerce = !!options.coerce;

    if (options.min !== undefined) this.min = options.min;

    if (options.max !== undefined) this.max = options.max;

    if (options.positive !== undefined) this.positive = options.positive;

    if (options.nonpositive !== undefined)
      this.nonpositive = options.nonpositive;

    if (options.negative !== undefined) this.negative = options.negative;

    if (options.nonnegative !== undefined)
      this.nonnegative = options.nonnegative;
  }

  public parse(context: Context<unknown>): unknown {
    if (this.coerce)
      if (typeof context.value === 'number')
        context.value = BigInt(context.value);
      else if (typeof context.value === 'string')
        context.value = BigInt(context.value);
      else if (typeof context.value === 'boolean')
        context.value = BigInt(context.value);

    if (typeof context.value !== 'bigint')
      return context.issues.push(this.issue('Must be a bigint'));

    if (this.min !== undefined && context.value < this.min)
      context.issues.push(this.issue(`Must be at least ${this.min}`));

    if (this.max !== undefined && context.value > this.max)
      context.issues.push(this.issue(`Must be at most ${this.max}`));

    if (this.positive !== undefined && context.value <= 0)
      context.issues.push(this.issue('Must be positive'));

    if (this.nonpositive !== undefined && context.value > 0)
      context.issues.push(this.issue('Must be nonpositive'));

    if (this.negative !== undefined && context.value >= 0)
      context.issues.push(this.issue('Must be negative'));

    if (this.nonnegative !== undefined && context.value < 0)
      context.issues.push(this.issue('Must be nonnegative'));
  }
}

export function IsBigInt<TCoerce extends true | false = false>(
  options: IsBigIntOptions<TCoerce> = {},
) {
  return Use(new IsBigIntConstraint(options));
}
