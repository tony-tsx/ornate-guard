import { expect, it } from 'vitest';
import { Alias } from '../Alias.js';
import { Base } from '../../models/Base.js';
import { IsString } from '../IsString.js';
import { IsGuard } from '../IsGuard.js';

it('map to alias', async () => {
  @IsGuard
  class Test extends Base {
    @Alias('b')
    @IsString()
    public a!: string;
  }

  const test = await Test.assert({ b: 'test' });

  expect(test).toEqual({ a: 'test' });
});
