import { Constraint } from '../models/Constraint.js';
import { type Context } from '../models/Context.js';
import { Use } from './Use.js';

export class IsUUIDV1Constraint extends Constraint<any, string> {
  public static readonly REG_EXP =
    /^[0-9A-F]{8}-[0-9A-F]{4}-1[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

  public parse(context: Context): unknown {
    if (typeof context.value !== 'string')
      return context.issues.push(this.issue('Must be UUID v1'));

    if (!IsUUIDV1Constraint.REG_EXP.test(context.value))
      return context.issues.push(this.issue('Must be UUID v1'));
  }
}

export class IsUUIDV2Constraint extends Constraint<any, string> {
  public static readonly REG_EXP =
    /^[0-9A-F]{8}-[0-9A-F]{4}-2[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

  public parse(context: Context): unknown {
    if (typeof context.value !== 'string')
      return context.issues.push(this.issue('Must be UUID v2'));

    if (!IsUUIDV2Constraint.REG_EXP.test(context.value))
      return context.issues.push(this.issue('Must be UUID v2'));
  }
}

export class IsUUIDV3Constraint extends Constraint<any, string> {
  public static readonly REG_EXP =
    /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

  public parse(context: Context): unknown {
    if (typeof context.value !== 'string')
      return context.issues.push(this.issue('Must be UUID v3'));

    if (!IsUUIDV3Constraint.REG_EXP.test(context.value))
      return context.issues.push(this.issue('Must be UUID v3'));
  }
}

export class IsUUIDV4Constraint extends Constraint<any, string> {
  public static readonly REG_EXP =
    /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

  public parse(context: Context): unknown {
    if (typeof context.value !== 'string')
      return context.issues.push(this.issue('Must be UUID v4'));

    if (!IsUUIDV4Constraint.REG_EXP.test(context.value))
      return context.issues.push(this.issue('Must be UUID v4'));
  }
}

export class IsUUIDV5Constraint extends Constraint<any, string> {
  public static readonly REG_EXP =
    /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

  public parse(context: Context): unknown {
    if (typeof context.value !== 'string')
      return context.issues.push(this.issue('Must be UUID v5'));

    if (!IsUUIDV5Constraint.REG_EXP.test(context.value))
      return context.issues.push(this.issue('Must be UUID v5'));
  }
}

export class IsUUIDConstraint extends Constraint<any, string> {
  public static readonly REG_EXP =
    /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

  public parse(context: Context): unknown {
    if (typeof context.value !== 'string')
      return context.issues.push(this.issue('Must be UUID'));

    if (!IsUUIDConstraint.REG_EXP.test(context.value))
      return context.issues.push(this.issue('Must be UUID'));
  }
}

export function IsUUID(version?: 'v1' | 'v2' | 'v3' | 'v4' | 'v5') {
  switch (version) {
    case 'v1':
      return Use(new IsUUIDV1Constraint());
    case 'v2':
      return Use(new IsUUIDV2Constraint());
    case 'v3':
      return Use(new IsUUIDV3Constraint());
    case 'v4':
      return Use(new IsUUIDV4Constraint());
    case 'v5':
      return Use(new IsUUIDV5Constraint());
    case undefined:
      return Use(new IsUUIDConstraint());
    default:
      throw new TypeError(`Invalid uuid version ${String(version)}`);
  }
}
