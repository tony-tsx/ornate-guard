import { expectTypeOf, it } from 'vitest';
import { IsRecord } from '../IsRecord.js';
import { IsString } from '../IsString.js';
import { type ConstraintType } from '../../types.js';

it('key and value has string in input and output defitions', () => {
  expectTypeOf(IsRecord(IsString(), IsString())).toMatchTypeOf<
    ConstraintType<Record<string, string>, Record<string, string>>
  >();
});
