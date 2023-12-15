import { type ConstraintType } from '../types.js';
import { If } from './If.js';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Flag {
  export function HasEvery(flags: string | string[], raw: ConstraintType) {
    if (Array.isArray(flags))
      return If(context => {
        for (let i = 0; i < flags.length; i++)
          if (!context.flags.includes(flags[i]!)) return false;
        return true;
      }, raw);
    return If(context => context.flags.includes(flags), raw);
  }

  export function HasSome(flags: string | string[], raw: ConstraintType) {
    if (Array.isArray(flags))
      return If(context => {
        for (let i = 0; i < flags.length; i++)
          if (context.flags.includes(flags[i]!)) return true;
        return false;
      }, raw);
    return If(context => context.flags.includes(flags), raw);
  }

  export namespace Not {
    export function HasEvery(flags: string | string[], raw: ConstraintType) {
      if (Array.isArray(flags))
        return If(context => {
          for (let i = 0; i < flags.length; i++)
            if (context.flags.includes(flags[i]!)) return false;
          return true;
        }, raw);
      return If(context => !context.flags.includes(flags), raw);
    }

    export function HasSome(flags: string | string[], raw: ConstraintType) {
      if (Array.isArray(flags))
        return If(context => {
          for (let i = 0; i < flags.length; i++)
            if (context.flags.includes(flags[i]!)) return false;
          return true;
        }, raw);
      return If(context => !context.flags.includes(flags), raw);
    }
  }
}
