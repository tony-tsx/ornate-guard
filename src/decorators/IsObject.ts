import { type Constraint } from '../models/Constraint.js';
import {
  type ConstraintType,
  type ExtractConstraintOutput,
  type ExtractConstraintInput,
} from '../types.js';
import { Is } from './Is.js';
import { Use } from './Use.js';

export type IsObjectShapeInput<
  TShape extends Record<PropertyKey, ConstraintType>,
> = {
  [K in keyof TShape]: ExtractConstraintInput<TShape[K]>;
};

export type IsObjectShapeOutput<
  TShape extends Record<PropertyKey, ConstraintType>,
> = {
  [K in keyof TShape]: ExtractConstraintOutput<TShape[K]>;
};

export function IsObject<TShape extends Record<PropertyKey, ConstraintType>>(
  shape: TShape,
): Use<
  Constraint<IsObjectShapeInput<TShape>, IsObjectShapeOutput<TShape>>,
  Use.Type.Property
> {
  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
  class Prototype {}

  Object.entries(shape).forEach(([key, constraint]) => {
    Use(constraint)(Prototype.prototype, key);
  });

  return Is(() => Prototype) as unknown as Use<
    Constraint<IsObjectShapeInput<TShape>, IsObjectShapeOutput<TShape>>,
    Use.Type.Property
  >;
}
