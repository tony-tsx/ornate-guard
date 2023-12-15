import { expect, it } from 'vitest';
import { IsBoolean } from '../IsBoolean.js';
import { analyze } from '../../analyze.js';
import { IsGuard } from '../IsGuard.js';

it('accept boolean', () => {
  @IsGuard
  class Test {
    @IsBoolean()
    public property!: boolean;
  }

  const output = analyze.sync({ property: true }, Test);

  expect(output.status).toBe('fulfilled');
});

it('reject string', () => {
  @IsGuard
  class Test {
    @IsBoolean()
    public property!: boolean;
  }

  const output = analyze.sync({ property: 'string' }, Test);

  expect(output.status).toBe('rejected');
});

it('accept raw coerce', () => {
  @IsGuard
  class Test {
    @IsBoolean('raw')
    public property!: boolean;
  }

  const output = analyze.sync({ property: 'true' }, Test);

  expect(output).toEqual({
    status: 'fulfilled',
    value: { property: true },
  });
});

it('accept comprehensive coerce', () => {
  @IsGuard
  class Test {
    @IsBoolean('comprehensive')
    public property!: boolean;
  }

  const output = analyze.sync({ property: 'true' }, Test);

  expect(output).toEqual({
    status: 'fulfilled',
    value: { property: true },
  });
});

it('accept comprehensive coerce for false values', () => {
  @IsGuard
  class Test {
    @IsBoolean('comprehensive')
    public property!: boolean;
  }

  const output = analyze.sync({ property: 'false' }, Test);

  expect(output).toEqual({
    status: 'fulfilled',
    value: { property: false },
  });
});

it('reject number', () => {
  @IsGuard
  class Test {
    @IsBoolean('comprehensive')
    public property!: boolean;
  }

  const output = analyze.sync({ property: 123 }, Test);

  expect(output.status).toBe('rejected');
});

it('accept number 1', () => {
  @IsGuard
  class Test {
    @IsBoolean('comprehensive')
    public property!: boolean;
  }

  const output = analyze.sync({ property: 1 }, Test);

  expect(output).toEqual({
    status: 'fulfilled',
    value: { property: true },
  });
});

it('accept number 0', () => {
  @IsGuard
  class Test {
    @IsBoolean('comprehensive')
    public property!: boolean;
  }

  const output = analyze.sync({ property: 0 }, Test);

  expect(output).toEqual({
    status: 'fulfilled',
    value: { property: false },
  });
});

it('accept true coerce', () => {
  @IsGuard
  class Test {
    @IsBoolean(true)
    public property!: boolean;
  }

  const output = analyze.sync({ property: 1 }, Test);

  expect(output).toEqual({
    status: 'fulfilled',
    value: { property: true },
  });
});
