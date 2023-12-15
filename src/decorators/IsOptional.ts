import { Constraint } from '../models/Constraint.js';
import { type Context } from '../models/Context.js';
import { getMetadataArgsStorage } from '../tools/getMetadataArgsStorage.js';
import { normalize } from '../tools/normalize.js';
import { type Constructable, type ConstraintType } from '../types.js';
import { Use } from './Use.js';

export class IsOptionalConstraint<TInput, TOutput> extends Constraint<
  TInput | undefined,
  TOutput | undefined
> {
  constructor(public readonly constraint: Constraint) {
    super();
  }

  public parse(context: Context) {
    if (context.value === undefined) return;

    return this.constraint.parse(context);
  }
}

export function IsOptional(): (
  target: object,
  propertyKey: PropertyKey,
) => void;
export function IsOptional<TInput, TOutput>(
  constraint: ConstraintType<TInput, TOutput>,
): Use<IsOptionalConstraint<TInput, TOutput>, Use.Type.Property>;
export function IsOptional<TInput, TOutput>(
  constraint?: ConstraintType<TInput, TOutput>,
) {
  if (!constraint)
    return (target: object, propertyKey: PropertyKey) => {
      getMetadataArgsStorage()
        .optionals
        .push({
          target: target.constructor as Constructable,
          propertyKey,
        });
    };

  return Use<IsOptionalConstraint<TInput, TOutput>, Use.Type.Property>(
    new IsOptionalConstraint(normalize(constraint)),
  );
}
