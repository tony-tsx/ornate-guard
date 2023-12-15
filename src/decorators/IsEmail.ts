import { Constraint } from '../models/Constraint.js';
import { type Context } from '../models/Context.js';
import { Use } from './Use.js';

export interface IsEmailOptions {
  domainWhitelist?: string | RegExp | Array<string | RegExp>;
  domainBlacklist?: string | RegExp | Array<string | RegExp>;
}

export class IsEmailConstraint extends Constraint<string, string> {
  public readonly domainWhitelist?: Array<string | RegExp>;

  public readonly domainBlacklist?: Array<string | RegExp>;

  public static readonly EMAIL_REGEXP =
    /^(?!\.)(?!.*\.\.)(?<username>([A-Z0-9_+-.]*)[A-Z0-9_+-])@(?<domain>([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$)/i;

  public static parse(value: string) {
    return this.EMAIL_REGEXP.exec(value)?.groups as
      | Record<'username' | 'domain', string>
      | undefined;
  }

  constructor(options: IsEmailOptions) {
    super();

    if (options.domainWhitelist !== undefined)
      this.domainWhitelist = Array.isArray(options.domainWhitelist)
        ? options.domainWhitelist
        : [options.domainWhitelist];

    if (options.domainBlacklist !== undefined)
      this.domainBlacklist = Array.isArray(options.domainBlacklist)
        ? options.domainBlacklist
        : [options.domainBlacklist];
  }

  public parse(context: Context): unknown {
    if (typeof context.value !== 'string')
      return context.issues.push(this.issue('Must be email'));

    const groups = IsEmailConstraint.parse(context.value);

    if (!groups) return context.issues.push(this.issue('Must be valid email'));

    if (
      this.domainWhitelist !== undefined &&
      !this.domainWhitelist.some(allow =>
        typeof allow === 'string'
          ? groups.domain !== allow
          : !allow.test(groups.domain!),
      )
    )
      return context.issues.push(this.issue('Domain is not allowed'));

    if (
      this.domainBlacklist !== undefined &&
      this.domainBlacklist.some(deny =>
        typeof deny === 'string'
          ? groups.domain === deny
          : deny.test(groups.domain),
      )
    )
      return context.issues.push(this.issue('Domain is not allowed'));
  }
}

export function IsEmail(options: IsEmailOptions = {}) {
  return Use<IsEmailConstraint, Use.Type.Property>(
    new IsEmailConstraint(options),
  );
}
