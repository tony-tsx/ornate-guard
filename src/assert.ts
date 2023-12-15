/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-throw-literal */
import { purify } from './purify.js';
import { type Constructable } from './types.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AssertOptions {
  share?: Record<PropertyKey, any>;
  flags?: string[];
}

export async function assert<
  TInput extends object | object[],
  TSchema extends object,
>(
  input: TInput,
  schema: Constructable<TSchema>,
  { flags = [], share = {} }: AssertOptions = {},
) {
  return await purify({
    share,
    input,
    constraint: schema,
    async: true,
    safe: false,
    path: [],
    flags,
  });
}

assert.sync = <TInput extends object | object[], TSchema extends object>(
  input: TInput,
  schema: Constructable<TSchema>,
  { flags = [], share = {} }: AssertOptions = {},
) =>
  purify({
    share,
    input,
    constraint: schema,
    async: false,
    safe: false,
    path: [],
    flags,
  });
