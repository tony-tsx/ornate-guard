import { purify } from './purify.js';
import { type Constructable } from './types.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AnalyzeOptions {
  share?: Record<PropertyKey, any>;
  flags?: string[];
}

export async function analyze<
  TInput extends object | object[],
  TSchema extends object,
>(
  input: TInput,
  schema: Constructable<TSchema>,
  { flags = [], share = {} }: AnalyzeOptions = {},
) {
  return await purify({
    share,
    input,
    constraint: schema,
    async: true,
    safe: true,
    path: [],
    flags,
  });
}

analyze.sync = <TInput extends object | object[], TSchema extends object>(
  input: TInput,
  schema: Constructable<TSchema>,
  { flags = [], share = {} }: AnalyzeOptions = {},
) =>
  purify({
    share,
    input,
    constraint: schema,
    async: false,
    safe: true,
    path: [],
    flags,
  });
