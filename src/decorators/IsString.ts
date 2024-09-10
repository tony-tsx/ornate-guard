import { Constraint } from '../models/Constraint.js';
import { type Context } from '../models/Context.js';
import { Issue } from '../models/Issue.js';
import { each } from '../tools/each.js';
import { Use } from './Use.js';

export interface IsStringOptions<TCoerce extends true | false = false> {
  coerce?: TCoerce;
  min?: number;
  max?: number;
  length?: number;
  pattern?: RegExp | RegExp[];
  includes?: string | string[];
  startsWith?: string | string[];
  endsWith?: string | string[];
  notStartsWith?: string | string[];
  notEndsWith?: string | string[];
  trim?: boolean;
  trimStart?: boolean;
  trimEnd?: boolean;
}

export class IsStringConstraint<
  TCoerce extends true | false = false,
> extends Constraint<TCoerce extends true ? unknown : string, string> {
  public readonly coerce?: boolean;
  public readonly min?: number;
  public readonly max?: number;
  public readonly length?: number;
  public readonly pattern?: RegExp | RegExp[];
  public readonly includes?: string | string[];
  public readonly startsWith?: string | string[];
  public readonly endsWith?: string | string[];
  public readonly notStartsWith?: string | string[];
  public readonly notEndsWith?: string | string[];
  public readonly trim?: boolean;
  public readonly trimStart?: boolean;
  public readonly trimEnd?: boolean;

  constructor(options: IsStringOptions<TCoerce>) {
    super();

    this.coerce = options.coerce ?? false;

    if (options.min !== undefined) this.min = options.min;

    if (options.max !== undefined) this.max = options.max;

    if (options.length !== undefined) this.length = options.length;

    if (options.pattern !== undefined) this.pattern = options.pattern;

    if (options.includes !== undefined) this.includes = options.includes;

    if (options.startsWith !== undefined) this.startsWith = options.startsWith;

    if (options.endsWith !== undefined) this.endsWith = options.endsWith;

    if (options.notStartsWith !== undefined)
      this.notStartsWith = options.notStartsWith;

    if (options.notEndsWith !== undefined)
      this.notEndsWith = options.notEndsWith;

    if (options.trim !== undefined) this.trim = options.trim;

    if (options.trimStart !== undefined) this.trimStart = options.trimStart;

    if (options.trimEnd !== undefined) this.trimEnd = options.trimEnd;
  }

  public parse(context: Context): unknown {
    if (this.coerce) context.value = String(context.value);

    if (typeof context.value !== 'string')
      return context.issues.push(this.issue(`Must be string`));

    if (this.trim) context.value = context.value.trim();

    if (this.trimStart) context.value = context.value.trimStart();

    if (this.trimEnd) context.value = context.value.trimEnd();

    if (this.min !== undefined && context.value.length < this.min)
      context.issues.push(
        new Issue(`Must be at least ${this.min} or more characters long`, this),
      );

    if (this.max !== undefined && context.value.length > this.max)
      context.issues.push(
        this.issue(`Must be at most ${this.max} or fewer characters long`),
      );

    if (this.length !== undefined && context.value.length !== this.length)
      context.issues.push(
        this.issue(`Must be exactly ${this.length} characters long`),
      );

    each(this.pattern, regexp => {
      if (!regexp.test(context.value as string))
        context.issues.push(this.issue(`Must be match the pattern ${regexp}`));
    });

    each(this.includes, value => {
      if (!(context.value as string).includes(value))
        context.issues.push(this.issue(`Must be include ${value}`));
    });

    each(this.startsWith, value => {
      if (!(context.value as string).startsWith(value))
        context.issues.push(this.issue(`Must be start with ${value}`));
    });

    each(this.endsWith, value => {
      if (!(context.value as string).endsWith(value))
        context.issues.push(this.issue(`Must be end with ${value}`));
    });

    each(this.notStartsWith, value => {
      if ((context.value as string).startsWith(value))
        context.issues.push(this.issue(`Must not start with ${value}`));
    });

    each(this.notEndsWith, value => {
      if ((context.value as string).endsWith(value))
        context.issues.push(this.issue(`Must not end with ${value}`));
    });
  }
}

export function IsString(): Use<IsStringConstraint, Use.Type.Property>;

export function IsString(
  regexp: RegExp,
): Use<IsStringConstraint, Use.Type.Property>;

export function IsString<TCoerce extends true | false = false>(
  options: IsStringOptions<TCoerce>,
): Use<IsStringConstraint<TCoerce>, Use.Type.Property>;

export function IsString<TCoerce extends true | false = false>(
  optionsOrRegExp: RegExp | IsStringOptions<TCoerce> = {},
) {
  const options: IsStringOptions<TCoerce> =
    optionsOrRegExp instanceof RegExp
      ? { pattern: optionsOrRegExp }
      : optionsOrRegExp;

  return Use<IsStringConstraint<TCoerce>, Use.Type.Property>(
    new IsStringConstraint(options),
  );
}
