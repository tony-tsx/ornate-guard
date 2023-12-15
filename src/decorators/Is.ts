import { type Constructable } from '../types.js';
import { Use } from './Use.js';
import { Constraint } from '../models/Constraint.js';
import { type Context } from '../models/Context.js';
import { isPromise } from '../tools/isPromise.js';
import { purify } from '../purify.js';

export interface IsConstraintOptions<T extends object> {
  flags?: {
    set?: string | string[];
    add?: string | string[];
    remove?: string | string[];
  };
  discriminator?: {
    location?: 'child' | 'self';
    selector: PropertyKey;
    nonmatch?: 'issue' | 'fall';
    map:
      | Array<[unknown, () => Constructable<T>]>
      | Record<PropertyKey, () => Constructable<T>>
      | (() => Array<[unknown, () => Constructable<T>]>);
  };
}

export class IsContraint<T extends object> extends Constraint<object, T> {
  public readonly setFlags: undefined | string[];

  public readonly addFlags: undefined | string[];

  public readonly removeFlags: undefined | string[];

  public readonly discriminator?: {
    location: 'child' | 'self';
    selector: PropertyKey;
    map: () => Array<[unknown, () => Constructable<T>]>;
  };

  constructor(
    public getSchema: () => Constructable<T>,
    options: IsConstraintOptions<T>,
  ) {
    super();

    if (options.flags) {
      if (options.flags.set)
        this.setFlags = Array.isArray(options.flags.set)
          ? options.flags.set
          : [options.flags.set];

      if (options.flags.add)
        this.addFlags = Array.isArray(options.flags.add)
          ? options.flags.add
          : [options.flags.add];

      if (options.flags.remove)
        this.removeFlags = Array.isArray(options.flags.remove)
          ? options.flags.remove
          : [options.flags.remove];
    }

    if (options.discriminator)
      this.discriminator = {
        location: 'child',
        selector: 'type',
        map:
          typeof options.discriminator.map === 'function'
            ? options.discriminator.map
            : () =>
                Array.isArray(options.discriminator!.map)
                  ? (options.discriminator!.map as Array<
                      [unknown, () => Constructable<T>]
                    >)
                  : (Object.entries(options.discriminator!.map) as Array<
                      [unknown, () => Constructable<T>]
                    >),
      };
  }

  public parse(
    context: Context<object & Record<PropertyKey, unknown>>,
  ): unknown {
    if (typeof context.value !== 'object' || context.value === null)
      return context.issues.push(this.issue('Must be object'));

    let flags: string[] = context.flags;

    if (this.setFlags) flags = this.setFlags;

    if (this.addFlags) flags.push(...this.addFlags);

    if (this.removeFlags)
      flags = flags.filter(flag => !this.removeFlags?.includes(flag));

    if (this.discriminator) {
      const discriminator =
        this.discriminator.location === 'child'
          ? context.value[this.discriminator.selector]
          : context.origin[this.discriminator.selector];

      const options = this.discriminator.map();

      for (let i = 0; i < options.length; i++) {
        const key = options[i][0];

        if (key !== discriminator) continue;

        const result = purify({
          share: context.share,
          async: context.async,
          input: context.value,
          constraint: options[i][1](),
          path: context.path,
          safe: true,
          flags,
        });

        if (isPromise(result))
          return result.then(result => {
            if (result.status === 'fulfilled')
              // @ts-expect-error: TODO
              context.value = result.value;
            else context._ = result.reason;
          });

        if (result.status === 'fulfilled')
          // @ts-expect-error: TODO
          context.value = result.value;
        else context._ = result.reason;

        return;
      }

      context.issues.push(this.issue('Invalid discriminator'));

      return;
    }

    const schema = this.getSchema();

    const result = purify({
      share: context.share,
      async: context.async,
      input: context.value,
      constraint: schema,
      path: context.path,
      safe: true,
      flags,
    });

    if (isPromise(result))
      return result.then(result => {
        if (result.status === 'fulfilled')
          // @ts-expect-error: TODO
          context.value = result.value;
        else context._ = result.reason;
      });
    if (result.status === 'fulfilled')
      // @ts-expect-error: TODO
      context.value = result.value;
    else context._ = result.reason;
  }
}

export function Is<T extends object>(
  fn: () => Constructable<T>,
  options: IsConstraintOptions<T> = {},
) {
  return Use<IsContraint<T>, Use.Type.Property>(new IsContraint(fn, options));
}
