/* eslint-disable @typescript-eslint/no-explicit-any */
import { purify } from '../purify.js';
import { getMetadata } from '../tools/getMetadata.js';
import { type Metadata } from './Metadata.js';

export interface BaseAnalyzeOptions<TSync extends true | false = false> {
  sync?: TSync;
  flags?: string[];
  share?: Record<PropertyKey, any>;
}

export interface BaseAssertOptions<TSync extends true | false = false>
  extends BaseAnalyzeOptions<TSync> {}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Base {
  public static getMetadata<T extends Base>(
    this: (new () => T) & typeof Base,
  ): Metadata {
    return getMetadata(this);
  }

  public static analyze<
    T extends Base,
    TInput extends object | object[],
    TSync extends true | false = false,
  >(
    this: (new () => T) & typeof Base,
    input: TInput,
    {
      flags = [],
      share = {},
      sync = false as TSync,
    }: BaseAnalyzeOptions<TSync> = {},
  ) {
    return purify<T, TSync extends true ? false : true, true, TInput>({
      share,
      input,
      constraint: this,
      async: !sync as TSync extends true ? false : true,
      safe: true,
      path: [],
      flags,
    });
  }

  public static assert<
    T extends Base,
    TInput extends object | object[],
    TSync extends true | false = false,
  >(
    this: (new () => T) & typeof Base,
    input: TInput,
    {
      flags = [],
      share = {},
      sync = false as TSync,
    }: BaseAnalyzeOptions<TSync> = {},
  ) {
    return purify<T, TSync extends true ? false : true, false, TInput>({
      share,
      input,
      constraint: this,
      async: !sync as TSync extends true ? false : true,
      safe: false,
      path: [],
      flags,
    });
  }
}

export interface Base extends OrnateGuard.Base {}

declare global {
  namespace OrnateGuard {
    interface Base {}
  }
}
