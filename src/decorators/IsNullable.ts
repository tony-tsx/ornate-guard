import { Constraint } from '../models/Constraint.js';
import { type Context } from '../models/Context.js';
import { getMetadataArgsStorage } from '../tools/getMetadataArgsStorage.js';
import { normalize } from '../tools/normalize.js';
import { type Constructable, type ConstraintType } from '../types.js';
import { Use } from './Use.js';

export class IsNullableConstraint<TInput, TOutput> extends Constraint<
  TInput | null,
  TOutput | null
> {
  constructor(public readonly constraint: Constraint) {
    super();
  }

  public parse(context: Context) {
    if (context.value === null) return;

    return this.constraint.parse(context);
  }
}

export function IsNullable(): (
  target: object,
  propertyKey: PropertyKey,
) => void;
export function IsNullable<TInput, TOutput>(
  constraint: ConstraintType<TInput, TOutput>,
): Use<IsNullableConstraint<TInput, TOutput>, Use.Type.Property>;
export function IsNullable<TInput, TOutput>(
  constraint?: ConstraintType<TInput, TOutput>,
) {
  if (!constraint)
    return (target: object, propertyKey: PropertyKey) => {
      getMetadataArgsStorage()
        .nullables
        .push({
          target: target.constructor as Constructable,
          propertyKey,
        });
    };

  return Use<IsNullableConstraint<TInput, TOutput>, Use.Type.Property>(
    new IsNullableConstraint(normalize(constraint)),
  );
}
