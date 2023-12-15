import { type FunctionConstraintIssueFactory } from '../types.js';
import { Constraint } from './Constraint.js';
import { type Context } from './Context.js';
import { type Issue } from './Issue.js';

export class AnonymousConstraint<
  TInput = unknown,
  TOutput = unknown,
> extends Constraint<TInput, TOutput> {
  readonly #parse: (
    context: Context<TInput>,
    issue: (message: string) => Issue,
  ) => unknown;

  readonly #factoryIssue: FunctionConstraintIssueFactory;

  constructor(
    parse: (
      context: Context<TInput>,
      issue: FunctionConstraintIssueFactory,
    ) => unknown,
  ) {
    super();
    this.#parse = parse;
    this.#factoryIssue = message => this.issue(message);
  }

  public parse(context: Context<TInput>): unknown {
    return this.#parse(context, this.#factoryIssue);
  }
}

export interface AnonymousConstraint extends OrnateGuard.AnonymousConstraint {}

declare global {
  namespace OrnateGuard {
    interface AnonymousConstraint {}
  }
}
