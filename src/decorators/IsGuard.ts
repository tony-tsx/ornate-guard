import { getMetadataArgsStorage } from '../tools/getMetadataArgsStorage.js';
import { type Constructable } from '../types.js';

export function IsGuard(target: Constructable) {
  getMetadataArgsStorage().guards.push({ target });
}
