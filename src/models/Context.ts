/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ValidationError } from './ValidationError.js';
import { type Issue } from './Issue.js';

export interface Context<TValue = any> {
  readonly share: Record<PropertyKey, any>;

  _?: ValidationError;

  readonly issues: Issue[];

  readonly inners: ValidationError[];

  readonly async: boolean;

  readonly raw: unknown;

  readonly target: Record<PropertyKey, unknown>;

  readonly origin: Record<PropertyKey, unknown>;

  readonly flags: string[];

  readonly isRoot?: boolean;

  value: TValue;

  readonly path: PropertyKey[];
}
