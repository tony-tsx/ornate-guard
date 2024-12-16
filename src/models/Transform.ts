import { isPromise } from '../tools/isPromise.js';
import { Constraint } from './Constraint.js';
import { type Context } from './Context.js';

export abstract class Transform<
  TInput = unknown,
  TOutput = unknown,
> extends Constraint<TInput, TOutput> {
  public abstract transform(input: TInput): TOutput | Promise<TOutput>;

  public static toArray() {
    return this.with((value: unknown) => {
      if (Array.isArray(value)) return value;
      return [value];
    });
  }

  public static with<TInput, TOutput>(
    transform: (input: TInput) => TOutput | Promise<TOutput>,
  ): Transform<TInput, TOutput> {
    return new AnonymousTransform(transform);
  }

  public parse(context: Context<unknown>): void | Promise<void> {
    const value = this.transform(context.value as TInput);

    if (isPromise(value))
      return value.then(value => {
        context.value = value;
      });

    context.value = value;
  }
}

export class AnonymousTransform<
  TInput = unknown,
  TOutput = unknown,
> extends Transform<TInput, TOutput> {
  private readonly _transform: (input: TInput) => TOutput | Promise<TOutput>;

  constructor(transform: (input: TInput) => TOutput | Promise<TOutput>) {
    super();
    this._transform = transform;
  }

  public transform(input: TInput): TOutput | Promise<TOutput> {
    return this._transform(input);
  }
}
