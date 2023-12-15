import { expect, it } from 'vitest';
import { analyze } from '../../analyze.js';
import { IsAny } from '../IsAny.js';
import { IsGuard } from '../IsGuard.js';

it.each([
  undefined,
  null,
  0,
  1,
  '',
  'string',
  {},
  [],
  () => {},
  new Date(),
  /regular-expression/,
  Symbol('symbol'),
  new Map(),
])('value "%o" pass', value => {
  @IsGuard
  class Test {
    @IsAny()
    public property!: unknown;
  }

  const output = analyze.sync({ property: value }, Test);

  expect(output.status).toBe('fulfilled');

  expect(output).toEqual(
    expect.objectContaining({
      value: { property: value },
    }),
  );
});
