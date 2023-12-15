import { expect, it } from 'vitest';
import { IsEnum } from '../IsEnum.js';
import { analyze } from '../../analyze.js';
import { ValidationError } from '../../models/ValidationError.js';
import { IsGuard } from '../IsGuard.js';

it('accept a value for enum with a, b, c', () => {
  @IsGuard
  class Test {
    @IsEnum(['a', 'b', 'c'])
    public property!: unknown;
  }

  const output = analyze.sync({ property: 'a' }, Test);

  expect(output).toEqual({
    status: 'fulfilled',
    value: { property: 'a' },
  });
});

it('reject a value for enum with a, b, c', () => {
  @IsGuard
  class Test {
    @IsEnum(['a', 'b', 'c'])
    public property!: unknown;
  }

  const output = analyze.sync({ property: 'd' }, Test);

  expect(output).toEqual({
    status: 'rejected',
    reason: expect.any(ValidationError),
  });
});

it('accept a value for enum with 1, 2, 3', () => {
  @IsGuard
  class Test {
    @IsEnum([1, 2, 3])
    public property!: unknown;
  }

  const output = analyze.sync({ property: 2 }, Test);

  expect(output).toEqual({
    status: 'fulfilled',
    value: { property: 2 },
  });
});

it('reject a value for enum with 1, 2, 3', () => {
  @IsGuard
  class Test {
    @IsEnum([1, 2, 3])
    public property!: unknown;
  }

  const output = analyze.sync({ property: 4 }, Test);

  expect(output).toEqual({
    status: 'rejected',
    reason: expect.any(ValidationError),
  });
});

it('accept a value for enum with TypeScript enum syntax', () => {
  enum Colors {
    Red = 'red',
    Green = 'green',
    Blue = 'blue',
  }

  @IsGuard
  class Test {
    @IsEnum(Colors)
    public property!: unknown;
  }

  const output = analyze.sync({ property: 'red' }, Test);

  expect(output).toEqual({
    status: 'fulfilled',
    value: { property: 'red' },
  });
});

it('reject a value for enum with TypeScript enum syntax', () => {
  enum Colors {
    Red = 'red',
    Green = 'green',
    Blue = 'blue',
  }

  @IsGuard
  class Test {
    @IsEnum(Colors)
    public property!: unknown;
  }

  const output = analyze.sync({ property: 'yellow' }, Test);

  expect(output).toEqual({
    status: 'rejected',
    reason: expect.any(ValidationError),
  });
});
