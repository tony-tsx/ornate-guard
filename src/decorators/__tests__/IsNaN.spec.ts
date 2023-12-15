import { expect, it } from 'vitest';
import { IsNaN } from '../IsNaN.js';
import { analyze } from '../../analyze.js';
import { IsGuard } from '../IsGuard.js';

it('fulfilled nan value analyze', () => {
  @IsGuard
  class TestClass {
    @IsNaN('strict')
    public nan!: number;
  }

  const output = analyze.sync({ nan: NaN }, TestClass);

  expect(output).toEqual({
    status: 'fulfilled',
    value: { nan: NaN },
  });
});
