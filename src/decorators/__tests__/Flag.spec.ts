import { describe, it } from 'vitest';
import { Base } from '../../models/Base.js';
import { Flag } from '../Flag.js';
import { IsString } from '../IsString.js';
import { IsNumber } from '../IsNumber.js';
import assert from 'node:assert/strict';
import { IsGuard } from '../IsGuard.js';

describe('Flag', () => {
  describe('.Have', () => {
    it('', async () => {
      @IsGuard
      class Test extends Base {
        @Flag.HasEvery('string', IsString({ coerce: true }))
        @Flag.HasEvery('number', IsNumber({ coerce: true }))
        public property!: unknown;
      }

      let result = await Test.analyze({ property: 123 }, { flags: ['string'] });

      assert.equal(result.status, 'fulfilled');

      assert.equal(result.value.property, '123');

      result = await Test.analyze({ property: '123' }, { flags: ['number'] });

      assert.equal(result.status, 'fulfilled');

      assert.equal(result.value.property, 123);
    });
  });
});
