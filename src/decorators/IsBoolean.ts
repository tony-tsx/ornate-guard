import { Constraint } from '../models/Constraint.js';
import { type Context } from '../models/Context.js';
import { Use } from './Use.js';

export type IsBooleanConstraintCoerceRaw = 'raw';

export type IsBooleanConstraintCoerceMode =
  | IsBooleanConstraintCoerceRaw
  | 'comprehensive'
  | 'none'
  | true
  | false;

export class IsBooleanConstraint<
  TCoerceMode extends IsBooleanConstraintCoerceMode = 'none',
> extends Constraint<
  TCoerceMode extends IsBooleanConstraintCoerceRaw
    ? unknown
    : TCoerceMode extends 'comprehensive'
      ? boolean | 'true' | 'false' | 1 | 0
      : boolean,
  boolean
> {
  constructor(public readonly coerce: IsBooleanConstraintCoerceMode) {
    super();
  }

  public parse(context: Context): unknown {
    if (this.coerce === 'raw' || this.coerce === true)
      context.value = Boolean(context.value);
    else if (this.coerce === 'comprehensive') {
      if (typeof context.value === 'string')
        if (context.value === 'true') context.value = true;
        else if (context.value === 'false') context.value = false;

      if (typeof context.value === 'number')
        if (context.value === 1) context.value = true;
        else if (context.value === 0) context.value = false;
    }

    if (!(typeof context.value === 'boolean'))
      return context.issues.push(this.issue('Must be a boolean'));
  }
}

export function IsBoolean<
  TCoerceMode extends IsBooleanConstraintCoerceMode = 'none',
>(coerce: TCoerceMode = 'none' as TCoerceMode) {
  return Use(new IsBooleanConstraint<TCoerceMode>(coerce));
}
