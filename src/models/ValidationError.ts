import { type Issue } from './Issue.js';

export interface ValidationErrorConfiguration {
  target: object;
  origin: object;
  value: unknown;
  path: PropertyKey[];
  issues: Issue[];
  inners: ValidationError[];
}

export class ValidationError<TTarget extends object = object> {
  public declare readonly ' type:target': TTarget;
  public readonly target: object;
  public readonly origin: object;
  public readonly value: unknown;
  public readonly path: PropertyKey[];
  public readonly issues: Issue[];
  public readonly inners: ValidationError[];

  constructor(configuration: ValidationErrorConfiguration) {
    this.target = configuration.target;
    this.origin = configuration.origin;
    this.value = configuration.value;
    this.path = configuration.path;
    this.issues = configuration.issues;
    this.inners = configuration.inners;
  }
}

export interface ValidationError extends OrnateGuard.ValidationError {}

declare global {
  namespace OrnateGuard {
    interface ValidationError {}
  }
}
