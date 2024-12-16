/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ValidationError } from './ValidationError.js';
import { type Issue } from './Issue.js';

export interface ContextShare {
  [key: PropertyKey]: any
}

export interface Context<TValue = any> {
  readonly share: ContextShare;

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
