import { getMetadataArgsStorage } from '../tools/getMetadataArgsStorage.js';
import { type Constructable } from '../types.js';

export function Alias(alias: string) {
  return (target: Constructable | object, propertyKey: PropertyKey) => {
    getMetadataArgsStorage().aliases.push({
      target: (typeof target === 'function'
        ? target
        : target.constructor) as Constructable,
      propertyKey,
      alias,
    });
  };
}
