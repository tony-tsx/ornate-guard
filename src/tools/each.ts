export function each<T>(data: undefined | T | T[], fn: (item: T) => void) {
  if (data === undefined) return;

  if (Array.isArray(data)) data.forEach(fn);
  else fn(data);
}
