import { type Context } from '../models/Context.js';

export function hasErrorInContext(context: Context) {
  return !!(context.issues.length || context.inners.length || context._);
}
