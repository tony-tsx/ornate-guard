/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Constraint } from './models/Constraint.js';
import { type Context } from './models/Context.js';
import { type Issue } from './models/Issue.js';

export const IS_CONSTRAINT_REF = Symbol('todo:is-constraint-reference');

export type Constructable<T = any> = new (...args: any[]) => T;

export type AnyRecord = Record<PropertyKey, unknown>;

export interface ConstraintRef<TConstraint extends AnyConstraint> {
  [IS_CONSTRAINT_REF]: true;
  constraint: TConstraint;
}

export type AnyConstraint = Constraint<any, any>;

export type FunctionConstraintIssueFactory = (message: string) => Issue;

export type FunctionConstraint<TInput = unknown, TOutput = unknown> = (
  this: Constraint<TInput, TOutput>,
  context: Context<TInput>,
  issueFactory: FunctionConstraintIssueFactory,
) => unknown;

export type ConstraintType<TInput = unknown, TOutput = TInput> =
  | Constraint<TInput, TOutput>
  | ConstraintRef<Constraint<TInput, TOutput>>
  | FunctionConstraint<TInput, TOutput>;

export type AnyConstraintType = ConstraintType<any, any>;

export type ExtractConstraintInput<T> = T extends ConstraintType<
  infer I,
  infer O
>
  ? I
  : never;

export type ExtractConstraintOutput<T> = T extends ConstraintType<
  infer I,
  infer O
>
  ? O
  : never;

export type ConstraintTypeToConstraint<T> = T extends AnyConstraint
  ? T
  : T extends ConstraintRef<infer TConstraint>
    ? TConstraint
    : T extends (this: infer TThis, context: infer TContext) => unknown
      ? TThis extends AnyConstraint
        ? TThis
        : never
      : never;
