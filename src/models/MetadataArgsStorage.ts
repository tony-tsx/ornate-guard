import { type Constructable } from '../types.js';
import { type Constraint } from './Constraint.js';

export interface IMetadataGuardArgs {
  target: Constructable;
}

export interface IMetadataConstraintArgs {
  target: Constructable;
  constraint: Constraint;

  propertyKey: PropertyKey | undefined;
}

export interface IMetadataNullableArgs {
  target: Constructable;
  propertyKey: PropertyKey;
}

export interface IMetadataOptionalArgs {
  target: Constructable;
  propertyKey: PropertyKey;
}

export interface IMetadataAnyArgs {
  target: Constructable;
  propertyKey: PropertyKey;
}

export interface IMetadataAliasArgs {
  target: Constructable;
  propertyKey: PropertyKey;
  alias: string;
}

export class MetadataArgsStorage {
  public readonly guards: IMetadataGuardArgs[] = [];
  public readonly constraints: IMetadataConstraintArgs[] = [];
  public readonly nullables: IMetadataNullableArgs[] = [];
  public readonly optionals: IMetadataOptionalArgs[] = [];
  public readonly aliases: IMetadataAliasArgs[] = [];
}

export interface MetadataStorageArgumentsList
  extends OrnateGuard.MetadataStorageArgumentsList {}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace OrnateGuard {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface MetadataStorageArgumentsList {}
  }
}
