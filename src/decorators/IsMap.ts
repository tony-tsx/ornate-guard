/* eslint-disable no-labels */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { Constraint } from '../models/Constraint.js';
import { type Context } from '../models/Context.js';
import { createValidationErrorFromContext } from '../tools/createValidationErrorFromContext.js';
import { hasErrorInContext } from '../tools/hasErrorInContext.js';
import { normalize } from '../tools/normalize.js';
import { type ConstraintType } from '../types.js';
import { Use } from './Use.js';

export class IsMapConstraint extends Constraint {
  constructor(
    public readonly value: Constraint,
    public readonly key?: Constraint,
    public readonly options?: IsMapOptions,
  ) {
    super();
  }

  public parse(context: Context): unknown {
    if (typeof context.value !== 'object')
      return context.issues.push(this.issue('Must be a map'));

    if (context.value === null)
      return context.issues.push(this.issue('Must be a map'));

    context.value = (() => {
      if (context.value instanceof Map) return context.value;

      if (Array.isArray(context.value)) return new Map(context.value);

      return new Map(Object.entries(context.value));
    })();

    if (!(context.value instanceof Map))
      return context.issues.push(this.issue('Must be a map'));

    const map = new Map();

    const promises: Array<Promise<unknown>> = [];

    for (const entry of context.value) {
      const key = entry[0];
      const value = entry[1];
      const path = context.path.slice();

      path.push(key);

      const valueContext: Context = {
        share: context.share,
        async: context.async,
        flags: context.flags,
        target: map as unknown as Record<PropertyKey, unknown>,
        origin: context.value as unknown as Record<PropertyKey, unknown>,
        path,
        value,
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
          target: map as unknown as Record<PropertyKey, unknown>,
          origin: context.value as unknown as Record<PropertyKey, unknown>,
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
      if (valuePromise || keyPromise)
        promises.push(
          Promise.all([keyPromise, valuePromise]).then(async () => {
            if (hasErrorInContext(valueContext))
              return context.inners.push(
                createValidationErrorFromContext(valueContext),
              );
            if (!(keyContext && hasErrorInContext(keyContext)))
              map.set(parsedKey, valueContext.value);
          }),
        );
      else if (hasErrorInContext(valueContext))
        context.inners.push(createValidationErrorFromContext(valueContext));
      else if (!(keyContext && hasErrorInContext(keyContext)))
        map.set(parsedKey, valueContext.value);
    }

    if (promises.length)
      return Promise.all(promises).then(() => (context.value = map));
    else context.value = map;
  }
}

export interface IsMapOptions {
  coerce?: boolean;
}

export function IsMap(
  value: ConstraintType,
): Use<IsMapConstraint, Use.Type.Property>;
export function IsMap(
  key: ConstraintType,
  value: ConstraintType,
  options?: IsMapOptions,
): Use<IsMapConstraint, Use.Type.Property>;
export function IsMap(
  keyOrValueConstraint: ConstraintType,
  maybeValueConstraint?: ConstraintType,
  options?: IsMapOptions,
) {
  if (maybeValueConstraint)
    return Use<IsMapConstraint, Use.Type.Property>(
      new IsMapConstraint(
        normalize(maybeValueConstraint),
        normalize(keyOrValueConstraint),
        options,
      ),
    );
  return Use<IsMapConstraint, Use.Type.Property>(
    new IsMapConstraint(normalize(keyOrValueConstraint)),
  );
}
