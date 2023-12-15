import { expect, it } from 'vitest';
import { Union } from '../../decorators/Union.js';
import { analyze } from '../../analyze.js';
import { IsLiteral } from '../../decorators/IsLiteral.js';
import { IsString } from '../../decorators/IsString.js';
import { IsEmail } from '../../decorators/IsEmail.js';
import { type PurifySafeOutputReject } from '../../purify.js';
import { toObject } from '../toObject.js';
import { IsDate } from '../../decorators/IsDate.js';
import { type Constructable } from '../../types.js';
import { Is } from '../../decorators/Is.js';
import { IsGuard } from '../../decorators/IsGuard.js';

@IsGuard
class UnionLiterals {
  @Union(IsLiteral(1), IsLiteral(2), IsLiteral(3))
  public property!: unknown;
}

@IsGuard
class User {
  @IsString()
  public name!: string;

  @IsEmail()
  public email!: string;

  @IsDate({ coerce: true })
  public birthDate!: Date;
}

@IsGuard
class Address {
  @IsString()
  public street!: string;

  @IsString()
  public city!: string;

  @IsString()
  public state!: string;

  @IsString()
  public zip!: string;
}

@IsGuard
class UserWithAddress {
  @Is(() => User)
  public user!: User;

  @Is(() => Address)
  public address!: Address;
}

it.each([
  {
    target: UnionLiterals,
    input: { property: 4 },
    expected: {
      property: {
        _errors: ['Must be 1', 'Must be 2', 'Must be 3'],
      },
    },
  },
  {
    target: User,
    input: { name: 123 },
    expected: {
      name: { _errors: ['Must be string'] },
      email: { _errors: ['Must be email'] },
      birthDate: { _errors: ['Must be valid date'] },
    },
  },
  {
    target: Address,
    input: { street: 123, city: 123, state: 123, zip: 123 },
    expected: {
      street: { _errors: ['Must be string'] },
      city: { _errors: ['Must be string'] },
      state: { _errors: ['Must be string'] },
      zip: { _errors: ['Must be string'] },
    },
  },
  {
    target: UserWithAddress,
    input: {
      user: { name: 123, email: 123, birthDate: undefined },
      address: { street: 123, city: 123, state: 123, zip: 123 },
    },
    expected: {
      user: {
        name: { _errors: ['Must be string'] },
        email: { _errors: ['Must be email'] },
        birthDate: { _errors: ['Must be valid date'] },
      },
      address: {
        street: { _errors: ['Must be string'] },
        city: { _errors: ['Must be string'] },
        state: { _errors: ['Must be string'] },
        zip: { _errors: ['Must be string'] },
      },
    },
  },
])(
  '$target.name validation error with $input expected $expected',
  ({ target, input, expected }) => {
    const output = analyze.sync(
      input,
      target as Constructable,
    ) as PurifySafeOutputReject<object>;

    expect(output.status).toBe('rejected');

    expect(toObject(output.reason, null, '_errors')).toEqual(expected);
  },
);
