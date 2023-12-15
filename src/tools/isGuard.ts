import { getMetadataArgsStorage } from './getMetadataArgsStorage.js';

export function isGuard(target: unknown): boolean {
  return getMetadataArgsStorage().guards.some(
    _guard => target === _guard.target,
  );
}
