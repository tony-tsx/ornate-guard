import { Constraint } from '../models/Constraint.js';
import { Use } from './Use.js';

export class IsAnyConstraint extends Constraint {
  public parse() {}
}

export function IsAny() {
  return Use<IsAnyConstraint, Use.Type.Property>(new IsAnyConstraint());
}
