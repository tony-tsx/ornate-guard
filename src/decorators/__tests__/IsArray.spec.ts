import { expect, it } from 'vitest';
import { IsArray } from '../IsArray.js';
import { IsString } from '../IsString.js';
import { analyze } from '../../analyze.js';
import { IsGuard } from '../IsGuard.js';

it('fulfilled array with strings', () => {
  @IsGuard
  class Test {
    @IsArray(IsString(), { min: 1 })
    public items!: string[];
  }

  const output = analyze.sync({ items: ['hello', 'world'] }, Test);

  expect(output.status).toBe('fulfilled');
});

it('reject array with numbers', () => {
  @IsGuard
  class Test {
    @IsArray(IsString(), { min: 1 })
    public items!: string[];
  }

  const output = analyze.sync({ items: [1, 2] }, Test);

  expect(output.status).toBe('rejected');
});

it('fulfilled array with minimum length', () => {
  @IsGuard
  class Test {
    @IsArray(IsString(), { min: 2 })
    public items!: string[];
  }

  const output = analyze.sync({ items: ['hello', 'world'] }, Test);

  expect(output.status).toBe('fulfilled');
});

it('reject array with less than minimum length', () => {
  @IsGuard
  class Test {
    @IsArray(IsString(), { min: 2 })
    public items!: string[];
  }

  const output = analyze.sync({ items: ['hello'] }, Test);

  expect(output.status).toBe('rejected');
});

it('fulfilled array with maximum length', () => {
  @IsGuard
  class Test {
    @IsArray(IsString(), { max: 3 })
    public items!: string[];
  }

  const output = analyze.sync({ items: ['hello', 'world', 'github'] }, Test);

  expect(output.status).toBe('fulfilled');
});

it('reject array with more than maximum length', () => {
  @IsGuard
  class Test {
    @IsArray(IsString(), { max: 3 })
    public items!: string[];
  }

  const output = analyze.sync(
    { items: ['hello', 'world', 'github', 'copilot'] },
    Test,
  );

  expect(output.status).toBe('rejected');
});

it('fulfilled array with specific length', () => {
  @IsGuard
  class Test {
    @IsArray(IsString(), { length: 2 })
    public items!: string[];
  }

  const output = analyze.sync({ items: ['hello', 'world'] }, Test);

  expect(output.status).toBe('fulfilled');
});

it('reject array with different length', () => {
  @IsGuard
  class Test {
    @IsArray(IsString(), { length: 2 })
    public items!: string[];
  }

  const output = analyze.sync({ items: ['hello'] }, Test);

  expect(output.status).toBe('rejected');
});

it('fulfilled non-empty array', () => {
  @IsGuard
  class Test {
    @IsArray(IsString(), { nonempty: true })
    public items!: string[];
  }

  const output = analyze.sync({ items: ['hello', 'world'] }, Test);

  expect(output.status).toBe('fulfilled');
});

it('reject empty array', () => {
  @IsGuard
  class Test {
    @IsArray(IsString(), { nonempty: true })
    public items!: string[];
  }

  const output = analyze.sync({ items: [] }, Test);

  expect(output.status).toBe('rejected');
});
