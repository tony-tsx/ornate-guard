import { getMetadataArgsStorage } from '../tools/getMetadataArgsStorage.js';
import { type Class, type Constructable } from '../types.js';

export interface GuardOptions {
  discriminatorProperty?: string | symbol;
  discriminatorValue?: unknown;
}

export function IsGuard(options?: GuardOptions): (target: Class) => void;
export function IsGuard(target: Constructable): void;
export function IsGuard(maybeTargetOrOptions?: Constructable | GuardOptions) {
  if (typeof maybeTargetOrOptions === 'function')
    return void getMetadataArgsStorage().guards.push({
      target: maybeTargetOrOptions,
    });

  return (target: Class) => {
    getMetadataArgsStorage().guards.push({
      target,
      ...maybeTargetOrOptions,
    });
  };
}
