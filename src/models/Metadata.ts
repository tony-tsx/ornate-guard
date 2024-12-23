import { getMetadataArgsStorage } from '../tools/getMetadataArgsStorage.js';
import { type Constructable } from '../types.js';
import { type Constraint } from './Constraint.js';
import { MetadataProperty } from './MetadataProperty.js';

export class Metadata {
  public readonly constraints: readonly Constraint[];

  public readonly properties: readonly MetadataProperty[];

  public readonly aliases = new Map<PropertyKey, PropertyKey[]>();

  public readonly target: Constructable;

  public readonly discriminatorProperty: string | symbol | undefined;

  public readonly discriminatorValue: unknown | undefined;

  public get name() {
    return this.target.name;
  }

  constructor(target: Constructable) {
    const args = getMetadataArgsStorage();

    const arg = args.guards.find(_guard => _guard.target === target);

    if (!arg) throw new TypeError();

    this.target = target;

    this.discriminatorProperty = arg.discriminatorProperty;

    this.discriminatorValue = arg.discriminatorValue;

    this.constraints = args.constraints
      .filter(
        args =>
          (target === args.target || target.prototype instanceof args.target) &&
          !args.propertyKey,
      )
      .map(args => args.constraint);

    const properties = args.constraints.filter(
      args =>
        (target === args.target || target.prototype instanceof args.target) &&
        !!args.propertyKey,
    );

    args.aliases
      .filter(
        args =>
          target === args.target || target.prototype instanceof args.target,
      )
      .forEach(args => {
        if (!this.aliases.has(args.propertyKey))
          this.aliases.set(args.propertyKey, []);

        this.aliases.get(args.propertyKey)!.push(args.alias);
      });

    this.properties = Array.from(new Set(properties)).map(
      arg => new MetadataProperty(target, arg.propertyKey!, arg.target),
    );
  }
}

export interface Metadata extends OrnateGuard.Metadata {}

declare global {
  namespace OrnateGuard {
    interface Metadata {}
  }
}
