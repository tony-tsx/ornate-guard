import { type Constraint } from './Constraint.js';
import { type Context } from './Context.js';
import {
  ValidationError,
  type ValidationErrorConfiguration,
} from './ValidationError.js';

export interface UnionContext extends Context {
  constraint: Constraint;
}

export interface UnionValidationErrorConfiguration
  extends Omit<ValidationErrorConfiguration, 'issues' | 'inners'> {
  constraints: Array<[Constraint, ValidationError]>;
}

export class UnionValidationError extends ValidationError {
  public readonly constraints: Map<Constraint, ValidationError>;

  constructor(configuration: UnionValidationErrorConfiguration) {
    super({
      target: configuration.target,
      origin: configuration.origin,
      value: configuration.value,
      path: configuration.path,
      issues: configuration.constraints.flatMap(([, error]) => error.issues),
      inners: configuration.constraints.flatMap(([, error]) => error.inners),
    });

    this.constraints = new Map(configuration.constraints);
  }
}

export interface UnionValidationError extends OrnateGuard.UnionValidationError {}

declare global {
  namespace OrnateGuard {
    interface UnionValidationError {}
  }
}
