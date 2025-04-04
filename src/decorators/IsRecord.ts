/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { Constraint } from '../models/Constraint.js';
import { type Context } from '../models/Context.js';
import { createValidationErrorFromContext } from '../tools/createValidationErrorFromContext.js';
import { hasErrorInContext } from '../tools/hasErrorInContext.js';
import { normalize } from '../tools/normalize.js';
import {
  type ExtractConstraintInput,
  type ExtractConstraintOutput,
  type AnyConstraintType,
  type ConstraintTypeToConstraint,
  type AnyConstraint,
} from '../types.js';
import { Use } from './Use.js';

export class IsRecordConstraint<
  TKeyConstraint extends Constraint | null,
  TValueConstraint extends Constraint,
> extends Constraint<
  Record<
    ExtractConstraintInput<TKeyConstraint> & (string | number | symbol),
    ExtractConstraintInput<TValueConstraint>
  >,
  Record<
    ExtractConstraintOutput<TKeyConstraint> & (string | number | symbol),
    ExtractConstraintOutput<TValueConstraint>
  >
> {
  constructor(
    public readonly key: TKeyConstraint | null,
    public readonly value: TValueConstraint,
  ) {
    super();
  }

  public parse(context: Context): unknown {
    if (typeof context.value !== 'object' || context.value === null)
      return context.issues.push(this.issue('Must be object'));

    const record: Record<PropertyKey, unknown> = {};

    const promises: Array<Promise<unknown>> = [];

    for (const key in context.value) {
      const value = (context.value as Record<PropertyKey, unknown>)[key];
      const path = context.path.slice();

      path.push(key);

      const valueContext: Context = {
        share: context.share,
        async: context.async,
        origin: context.value as Record<PropertyKey, unknown>,
        flags: context.flags,
        target: record,
        path,
        value: (context.value as Record<PropertyKey, unknown>)[key],
        raw: value,
        issues: [],
        inners: [],
      };
      let parsedKey: PropertyKey = key;
      let keyPromise: Promise<unknown> | undefined;
      let valuePromise: Promise<unknown> | undefined;
      let keyContext: Context | undefined;

      if (this.key) {
        keyContext = {
          share: context.share,
          async: context.async,
          flags: context.flags,
          target: record,
          origin: context.value as Record<PropertyKey, unknown>,
          value: key,
          raw: key,
          path: context.path,
          issues: [],
          inners: [],
        };
        this.key.execute(
          keyContext,
          // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/promise-function-async
          promise => (keyPromise = promise),
        );
        if (keyPromise)
          keyPromise = keyPromise.then(() => {
            if (hasErrorInContext(keyContext!))
              return context.inners.push(
                createValidationErrorFromContext(keyContext!),
              );
            parsedKey = keyContext!.value as PropertyKey;
          });
        else if (hasErrorInContext(keyContext))
          context.inners.push(createValidationErrorFromContext(keyContext));
        else parsedKey = keyContext.value as PropertyKey;
      }

      this.value.execute(
        valueContext,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/promise-function-async
        promise => (valuePromise = promise),
      );

      if (valuePromise)
        promises.push(
          valuePromise.then(async () => {
            if (keyPromise) await keyPromise;
            if (hasErrorInContext(valueContext))
              return context.inners.push(
                createValidationErrorFromContext(valueContext),
              );
            if (!(keyContext && hasErrorInContext(keyContext)))
              record[parsedKey] = valueContext.value;
          }),
        );
      else if (keyPromise)
        promises.push(
          keyPromise.then(() => {
            if (hasErrorInContext(valueContext))
              return context.inners.push(
                createValidationErrorFromContext(valueContext),
              );
            if (!(keyContext && hasErrorInContext(keyContext)))
              record[parsedKey] = valueContext.value;
          }),
        );
      else if (hasErrorInContext(valueContext))
        context.inners.push(createValidationErrorFromContext(valueContext));
      else if (!(keyContext && hasErrorInContext(keyContext)))
        record[parsedKey] = valueContext.value;
    }

    if (promises.length)
      return Promise.all(promises).then(() => {
        if (context.isRoot) Object.assign(context.target, record);
        context.value = record;
      });
    else {
      if (context.isRoot) Object.assign(context.target, record);
      context.value = record;
    }
  }
}

export function IsRecord<
  TValueConstraintType extends AnyConstraintType,
  TType extends Use.Type = Use.Type.Any,
>(
  value: TValueConstraintType,
): Use<
  IsRecordConstraint<null, ConstraintTypeToConstraint<TValueConstraintType>>,
  TType
>;
export function IsRecord<
  TKeyConstraintType extends AnyConstraintType,
  TValueConstraintType extends AnyConstraintType,
  TType extends Use.Type = Use.Type.Any,
>(
  key: TKeyConstraintType,
  value: TValueConstraintType,
): Use<
  IsRecordConstraint<
    ConstraintTypeToConstraint<TKeyConstraintType>,
    ConstraintTypeToConstraint<TValueConstraintType>
  >,
  TType
>;
export function IsRecord<TType extends Use.Type = Use.Type.Any>(
  keyOrValueConstraintRef: AnyConstraintType,
  maybeValueConstraint?: AnyConstraintType,
): Use<IsRecordConstraint<AnyConstraint, AnyConstraint>, TType> {
  return Use(
    new IsRecordConstraint(
      maybeValueConstraint ? normalize(keyOrValueConstraintRef) : null,
      maybeValueConstraint
        ? normalize(maybeValueConstraint)
        : normalize(keyOrValueConstraintRef),
    ),
  );
}
