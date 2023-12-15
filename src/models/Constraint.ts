/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { isPromise } from '../tools/isPromise.js';
import { type Context } from './Context.js';
import { Issue } from './Issue.js';

export interface ConstraintOptions {
  optional?: boolean;
  nullable?: boolean;
  required?: boolean;
}

export abstract class Constraint<TInput = unknown, TOutput = unknown> {
  public declare readonly [' types:input']: TInput;

  public declare readonly [' types:output']: TOutput;

  public abstract parse(context: Context): unknown | Promise<unknown>;

  public execute(
    context: Context<TInput>,
    onPromise: (promise: Promise<unknown>) => void,
  ): void {
    const result = this.parse(context);

    if (!isPromise(result)) return;

    if (!context.async) throw new Error('Unexpected promise');

    onPromise(result);
  }

  public issue(message: string) {
    return new Issue(message, this);
  }
}

export interface Constraint extends OrnateGuard.Constraint {}

declare global {
  namespace OrnateGuard {
    interface Constraint {}
  }
}
