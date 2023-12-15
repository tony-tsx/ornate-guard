/* eslint-disable @typescript-eslint/method-signature-style */
/* eslint-disable @typescript-eslint/no-redeclare */
import { getMetadataArgsStorage } from '../tools/getMetadataArgsStorage.js';
import { normalize } from '../tools/normalize.js';
import {
  IS_CONSTRAINT_REF,
  type ConstraintRef,
  type Constructable,
  type AnyConstraintType,
  type ConstraintTypeToConstraint,
} from '../types.js';

interface Map {
  class(target: Constructable): void;
  class(target: Constructable, context?: ClassDecoratorContext): void;
  property(
    target: object | undefined,
    propertyKeyOrContext: PropertyKey | ClassMemberDecoratorContext,
  ): void;
  any(
    target: Constructable | object | undefined,
    propertyKeyOrContext?:
      | PropertyKey
      | ClassDecoratorContext
      | ClassFieldDecoratorContext,
  ): void;
}

export const IS_USE = Symbol.for('ornate-guard:is-use');

export type Use<
  TConstraint extends AnyConstraintType,
  TType extends Use.Type = Use.Type.Any,
> = Map[TType] & ConstraintRef<ConstraintTypeToConstraint<TConstraint>>;

export function Use<
  TRawConstraint extends AnyConstraintType,
  TType extends Use.Type = Use.Type.Any,
>(raw: TRawConstraint): Use<TRawConstraint, TType> {
  const use: Use<TRawConstraint, TType> = (
    target: Constructable | object | undefined,
    maybePropertyKeyOrClassDecoratorContextOrClassFieldDecoratorContext?:
      | PropertyKey
      | ClassDecoratorContext
      | ClassMemberDecoratorContext,
  ) => {
    let propertyKey: PropertyKey | undefined;

    if (
      typeof maybePropertyKeyOrClassDecoratorContextOrClassFieldDecoratorContext ===
      'object'
    ) {
      const context =
        maybePropertyKeyOrClassDecoratorContextOrClassFieldDecoratorContext;

      if (context.kind === 'field') {
        propertyKey = context.name;
      }

      let initialized = false;

      context.addInitializer(function (this) {
        if (initialized) return;

        initialized = true;

        getMetadataArgsStorage().constraints.push({
          target:
            typeof this === 'function'
              ? (this as Constructable)
              : ((this as object).constructor as Constructable),
          propertyKey,
          constraint: use.constraint,
        });
      });

      return;
    } else
      propertyKey =
        maybePropertyKeyOrClassDecoratorContextOrClassFieldDecoratorContext;

    getMetadataArgsStorage().constraints.push({
      target: (typeof target === 'function'
        ? target
        : target!.constructor) as Constructable,
      propertyKey,
      constraint: use.constraint,
    });
  };

  use[IS_CONSTRAINT_REF] = true as const;

  Object.defineProperty(use, IS_USE, {
    enumerable: false,
    configurable: false,
    writable: false,
  });

  use.constraint = normalize(raw);

  return use;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Use {
  export enum Type {
    Class = 'class',
    Property = 'property',
    Any = 'any',
  }
}
