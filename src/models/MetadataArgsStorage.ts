import { type GuardOptions } from '../decorators/IsGuard.js';
import { type Class } from '../types.js';
import { type Constraint } from './Constraint.js';

export interface IMetadataGuardArgs extends GuardOptions {
  target: Class;
}

export interface IMetadataConstraintArgs {
  target: Class;
  propertyKey: PropertyKey | undefined;
  constraint: Constraint;
}

export interface IMetadataNullableArgs {
  target: Class;
  propertyKey: PropertyKey;
}

export interface IMetadataOptionalArgs {
  target: Class;
  propertyKey: PropertyKey;
}

export interface IMetadataAnyArgs {
  target: Class;
  propertyKey: PropertyKey;
}

export interface IMetadataAliasArgs {
  target: Class;
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
