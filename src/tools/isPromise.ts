export function isPromise(value: unknown): value is Promise<unknown> {
  return typeof value === 'object' && value instanceof Promise;
}
