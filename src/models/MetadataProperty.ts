import { getMetadataArgsStorage } from '../tools/getMetadataArgsStorage.js';
import { type Constructable } from '../types.js';
import { type Constraint } from './Constraint.js';

export class MetadataProperty {
  public readonly constraints: readonly Constraint[];

  public readonly nullable: boolean;

  public readonly optional: boolean;

  constructor(
    public target: Constructable,
    public propertyKey: PropertyKey,
  ) {
    this.constraints = getMetadataArgsStorage()
      .constraints.filter(
        args =>
          (target === args.target || target.prototype instanceof args.target) &&
          args.propertyKey === propertyKey,
      )
      .map(args => args.constraint);

    this.optional = getMetadataArgsStorage().optionals.some(
      args =>
        (target === args.target || target.prototype instanceof args.target) &&
        args.propertyKey === propertyKey,
    );

    this.nullable = getMetadataArgsStorage().nullables.some(
      args =>
        (target === args.target || target.prototype instanceof args.target) &&
        args.propertyKey === propertyKey,
    );
  }
}

export interface MetadataProperty extends OrnateGuard.MetadataProperty {}

declare global {
  namespace OrnateGuard {
    interface MetadataProperty {}
  }
}
