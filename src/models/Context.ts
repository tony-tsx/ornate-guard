import { type ValidationError } from './ValidationError.js';
import { type Issue } from './Issue.js';

export interface Context<TValue = unknown> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly share: Record<PropertyKey, any>;

  _?: ValidationError;

  readonly issues: Issue[];

  readonly inners: ValidationError[];

  readonly async: boolean;

  readonly raw: unknown;

  readonly target: Record<PropertyKey, unknown>;

  readonly origin: Record<PropertyKey, unknown>;

  readonly flags: string[];

  value: TValue;

  readonly path: PropertyKey[];
}
