/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { type Context } from './models/Context.js';
import { type ValidationError } from './models/ValidationError.js';
import { createValidationErrorFromContext } from './tools/createValidationErrorFromContext.js';
import { getMetadata } from './tools/getMetadata.js';
import { hasErrorInContext } from './tools/hasErrorInContext.js';
import { isConstraint } from './tools/isConstraint.js';
import { normalize } from './tools/normalize.js';
import {
  type FunctionConstraint,
  type ConstraintType,
  type Constructable,
} from './types.js';

export interface PurifyConfiguration<
  TOutput,
  TAsync extends boolean,
  TSafe extends boolean,
  TInput,
> {
  share: any;
  path: PropertyKey[];
  input: TInput;
  constraint:
    | Constructable<TOutput>
    | Exclude<
        ConstraintType<TInput, TOutput>,
        FunctionConstraint<TInput, TOutput>
      >;
  async: TAsync;
  safe: TSafe;
  flags: string[];
}

export interface PurifySafeOutputFulfilled<TSchema> {
  status: 'fulfilled';
  value: TSchema;
}

export interface PurifySafeOutputReject<TSchema extends object> {
  status: 'rejected';
  reason: ValidationError<TSchema>;
}

export type PurifySafeOutput<TSchema extends object> =
  | PurifySafeOutputFulfilled<TSchema>
  | PurifySafeOutputReject<TSchema>;

export type PurifyOutput<
  TOutput extends object,
  TAsync extends boolean,
  TSafe extends boolean,
> = TAsync extends true
  ? TSafe extends true
    ? Promise<PurifySafeOutput<TOutput>>
    : Promise<TOutput>
  : TSafe extends true
    ? PurifySafeOutput<TOutput>
    : TOutput;

// eslint-disable-next-line @typescript-eslint/promise-function-async
export function purify<
  TSchema extends object,
  TAsync extends boolean,
  TSafe extends boolean,
  TInput,
>(
  configuration: PurifyConfiguration<TSchema, TAsync, TSafe, TInput>,
): PurifyOutput<TSchema, TAsync, TSafe>;
export function purify(
  configuration: PurifyConfiguration<
    Record<PropertyKey, unknown>,
    boolean,
    boolean,
    Record<PropertyKey, unknown> | Array<Record<PropertyKey, unknown>>
  >,
): PurifyOutput<Record<PropertyKey, unknown>, boolean, boolean> {
  if (isConstraint(configuration.constraint)) {
    const context: Context = {
      share: configuration.share,
      target: {},
      origin: {},
      value: configuration.input,
      flags: configuration.flags,
      raw: configuration.input,
      path: configuration.path,
      async: configuration.async,
      inners: [],
      issues: [],
    };

    const promises: Array<Promise<unknown>> = [];

    normalize(configuration.constraint).execute(context, promise => {
      promises.push(promise);
    });

    if (promises.length)
      return Promise.all(promises).then(() => {
        if (hasErrorInContext(context))
          if (configuration.safe)
            return {
              status: 'rejected',
              reason: createValidationErrorFromContext(context),
            };
          else throw createValidationErrorFromContext(context);
        else if (configuration.safe)
          return { status: 'fulfilled', value: context.value };
        else return context.value;
      }) as PurifyOutput<Record<PropertyKey, unknown>, boolean, boolean>;
    else if (hasErrorInContext(context))
      if (configuration.safe)
        return {
          status: 'rejected',
          reason: createValidationErrorFromContext(context),
        };
      else throw createValidationErrorFromContext(context);
    else if (configuration.safe)
      return { status: 'fulfilled', value: context.value };
    else return context.value;
  }

  // eslint-disable-next-line new-cap
  const target = new configuration.constraint();

  const metadata = getMetadata(configuration.constraint)!;

  const promises: Array<Promise<unknown>> = [];
  const raw = configuration.input;
  const path = configuration.path;
  const context: Context = {
    isRoot: true,
    share: configuration.share,
    target,
    // @ts-expect-error: TODO
    origin: raw,
    value: raw,
    flags: configuration.flags,
    raw,
    path,
    async: configuration.async,
    inners: [],
    issues: [],
  };

  if (metadata.constraints.length)
    for (let i = 0; i < metadata.constraints.length; i++)
      metadata.constraints[i]!.execute(context, promise =>
        promises.push(promise),
      );

  for (let i = 0; i < metadata.properties.length; i++) {
    const property = metadata.properties[i]!;

    const defaultValue = target[property.propertyKey];

    // @ts-expect-error: TODO
    let raw = configuration.input[property.propertyKey];

    if (raw === undefined && metadata.aliases.has(property.propertyKey)) {
      const aliases = metadata.aliases.get(property.propertyKey)!;

      for (const alias of aliases) {
        // @ts-expect-error: TODO
        if (configuration.input[alias] === undefined) continue;

        // @ts-expect-error: TODO
        raw = configuration.input[alias];

        break;
      }
    }

    if (raw === undefined) raw = defaultValue;

    if (property.nullable && raw === null) continue;

    if (property.optional && raw === undefined) continue;

    const _promises: Array<Promise<unknown>> = [];

    const path = context.path.slice();

    path.push(property.propertyKey);

    const _context: Context = {
      share: context.share,
      async: context.async,
      origin: context.origin,
      target: context.target,
      flags: context.flags,
      path,
      value: raw,
      raw,
      issues: [],
      inners: [],
    };

    for (let i = 0; i < property.constraints.length; i++) {
      property.constraints[i]!.execute(_context, promise =>
        _promises.push(promise),
      );
    }

    if (_promises.length)
      promises.push(
        Promise.all(_promises).then(() => {
          if (hasErrorInContext(_context))
            context.inners.push(createValidationErrorFromContext(_context));
          else context.target[property.propertyKey] = _context.value;
        }),
      );
    else if (hasErrorInContext(_context))
      context.inners.push(createValidationErrorFromContext(_context));
    else context.target[property.propertyKey] = _context.value;
  }

  if (promises.length)
    return Promise.all(promises).then(() => {
      if (hasErrorInContext(context))
        if (configuration.safe)
          return {
            status: 'rejected',
            reason: createValidationErrorFromContext(context),
          };
        else throw createValidationErrorFromContext(context);
      else if (configuration.safe)
        return { status: 'fulfilled', value: context.target };
      else return context.target;
    }) as PurifyOutput<Record<PropertyKey, unknown>, boolean, boolean>;
  else if (hasErrorInContext(context))
    if (configuration.safe)
      return {
        status: 'rejected',
        reason: createValidationErrorFromContext(context),
      };
    else throw createValidationErrorFromContext(context);
  else if (configuration.safe)
    return { status: 'fulfilled', value: context.target };
  else return context.target;
}
