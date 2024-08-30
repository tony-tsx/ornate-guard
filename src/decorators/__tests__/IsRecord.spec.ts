import { expect, it } from 'vitest';
import { IsGuard } from '../IsGuard.js';
import { IsRecord } from '../IsRecord.js';
import { IsString } from '../IsString.js';
import { analyze } from '../../analyze.js';

it('adds is record in property', async () => {
  @IsGuard
  class Root {
    @IsRecord(IsString(), IsString())
    public property!: Record<string, string>;
  }

  const result = await analyze({ property: { a: 'a' } }, Root);

  expect(result).toEqual({
    status: 'fulfilled',
    value: { property: { a: 'a' } },
  });
});

it('reject if record is invalid in property', async () => {
  @IsGuard
  class Root {
    @IsRecord(IsString(), IsString())
    public property!: Record<string, string>;
  }

  const result = await analyze({ property: { a: 1 } }, Root);

  expect(result.status).toBe('rejected');
});

it('adds is record in class', async () => {
  @IsGuard
  @IsRecord(IsString(), IsString())
  class Root {
    [key: string]: string;
  }

  const result = await analyze({ a: 'a' }, Root);

  expect(result).toEqual({
    status: 'fulfilled',
    value: { a: 'a' },
  });
});

it('reject if record is invalid in class', async () => {
  @IsGuard
  @IsRecord(IsString(), IsString())
  class Root {
    [key: string]: string;
  }

  const result = await analyze({ a: 1 }, Root);

  expect(result.status).toBe('rejected');
});
