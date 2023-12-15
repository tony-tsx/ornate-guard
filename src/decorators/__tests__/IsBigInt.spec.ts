import { expect, it } from 'vitest';
import { IsBigInt } from '../IsBigInt.js';
import { analyze } from '../../analyze.js';
import { ValidationError } from '../../models/ValidationError.js';
import { IsGuard } from '../IsGuard.js';

it('fulfilled analyze bigint value', () => {
  @IsGuard
  class TestClass {
    @IsBigInt()
    public value!: bigint;
  }

  const output = analyze.sync({ value: BigInt(1234567890) }, TestClass);

  expect(output).toEqual({
    status: 'fulfilled',
    value: { value: BigInt(1234567890) },
  });
});

it('reject analyze non-bigint value', () => {
  @IsGuard
  class TestClass {
    @IsBigInt()
    public value!: bigint;
  }

  const output = analyze.sync({ value: 1234567890 }, TestClass);

  expect(output).toEqual({
    status: 'rejected',
    reason: expect.any(ValidationError),
  });
});

it('fulfilled analyze bigint value with coerce option', () => {
  @IsGuard
  class TestClass {
    @IsBigInt({ coerce: true })
    public value!: bigint;
  }

  const output = analyze.sync({ value: '1234567890' }, TestClass);

  expect(output).toEqual({
    status: 'fulfilled',
    value: { value: BigInt(1234567890) },
  });
});

it('fulfilled analyze bigint value with min option', () => {
  @IsGuard
  class TestClass {
    @IsBigInt({ min: 100 })
    public value!: bigint;
  }

  const output = analyze.sync({ value: BigInt(1234567890) }, TestClass);

  expect(output).toEqual({
    status: 'fulfilled',
    value: { value: BigInt(1234567890) },
  });
});

it('reject analyze bigint value with min option', () => {
  @IsGuard
  class TestClass {
    @IsBigInt({ min: 100 })
    public value!: bigint;
  }

  const output = analyze.sync({ value: BigInt(50) }, TestClass);

  expect(output).toEqual({
    status: 'rejected',
    reason: expect.any(ValidationError),
  });
});

it('fulfilled analyze bigint value with max option', () => {
  @IsGuard
  class TestClass {
    @IsBigInt({ max: 100 })
    public value!: bigint;
  }

  const output = analyze.sync({ value: BigInt(50) }, TestClass);

  expect(output).toEqual({
    status: 'fulfilled',
    value: { value: BigInt(50) },
  });
});

it('reject analyze bigint value with max option', () => {
  @IsGuard
  class TestClass {
    @IsBigInt({ max: 100 })
    public value!: bigint;
  }

  const output = analyze.sync({ value: BigInt(1234567890) }, TestClass);

  expect(output).toEqual({
    status: 'rejected',
    reason: expect.any(ValidationError),
  });
});

it('fulfilled analyze bigint value with positive option', () => {
  @IsGuard
  class TestClass {
    @IsBigInt({ positive: true })
    public value!: bigint;
  }

  const output = analyze.sync({ value: BigInt(1234567890) }, TestClass);

  expect(output).toEqual({
    status: 'fulfilled',
    value: { value: BigInt(1234567890) },
  });
});

it('reject analyze bigint value with positive option', () => {
  @IsGuard
  class TestClass {
    @IsBigInt({ positive: true })
    public value!: bigint;
  }

  const output = analyze.sync({ value: BigInt(-1234567890) }, TestClass);

  expect(output).toEqual({
    status: 'rejected',
    reason: expect.any(ValidationError),
  });
});

it('fulfilled analyze bigint value with nonpositive option', () => {
  @IsGuard
  class TestClass {
    @IsBigInt({ nonpositive: true })
    public value!: bigint;
  }

  const output = analyze.sync({ value: BigInt(-1234567890) }, TestClass);

  expect(output).toEqual({
    status: 'fulfilled',
    value: { value: BigInt(-1234567890) },
  });
});

it('reject analyze bigint value with nonpositive option', () => {
  @IsGuard
  class TestClass {
    @IsBigInt({ nonpositive: true })
    public value!: bigint;
  }

  const output = analyze.sync({ value: BigInt(1234567890) }, TestClass);

  expect(output).toEqual({
    status: 'rejected',
    reason: expect.any(ValidationError),
  });
});

it('fulfilled analyze bigint value with negative option', () => {
  @IsGuard
  class TestClass {
    @IsBigInt({ negative: true })
    public value!: bigint;
  }

  const output = analyze.sync({ value: BigInt(-1234567890) }, TestClass);

  expect(output).toEqual({
    status: 'fulfilled',
    value: { value: BigInt(-1234567890) },
  });
});

it('reject analyze bigint value with negative option', () => {
  @IsGuard
  class TestClass {
    @IsBigInt({ negative: true })
    public value!: bigint;
  }

  const output = analyze.sync({ value: BigInt(1234567890) }, TestClass);

  expect(output).toEqual({
    status: 'rejected',
    reason: expect.any(ValidationError),
  });
});

it('fulfilled analyze bigint value with nonnegative option', () => {
  @IsGuard
  class TestClass {
    @IsBigInt({ nonnegative: true })
    public value!: bigint;
  }

  const output = analyze.sync({ value: BigInt(1234567890) }, TestClass);

  expect(output).toEqual({
    status: 'fulfilled',
    value: { value: BigInt(1234567890) },
  });
});

it('reject analyze bigint value with nonnegative option', () => {
  @IsGuard
  class TestClass {
    @IsBigInt({ nonnegative: true })
    public value!: bigint;
  }

  const output = analyze.sync({ value: BigInt(-1234567890) }, TestClass);

  expect(output).toEqual({
    status: 'rejected',
    reason: expect.any(ValidationError),
  });
});

it('fulfilled analyze bigint value with coerce option and boolean value', () => {
  @IsGuard
  class TestClass {
    @IsBigInt({ coerce: true })
    public value!: bigint;
  }

  const output = analyze.sync({ value: true }, TestClass);

  expect(output).toEqual({
    status: 'fulfilled',
    value: { value: BigInt(1) },
  });
});

it('fulfilled analyze bigint value with coerce option and boolean value (false)', () => {
  @IsGuard
  class TestClass {
    @IsBigInt({ coerce: true })
    public value!: bigint;
  }

  const output = analyze.sync({ value: false }, TestClass);

  expect(output).toEqual({
    status: 'fulfilled',
    value: { value: BigInt(0) },
  });
});

it('fulfilled analyze bigint value with coerce option and boolean value (true)', () => {
  @IsGuard
  class TestClass {
    @IsBigInt({ coerce: true })
    public value!: bigint;
  }

  const output = analyze.sync({ value: true }, TestClass);

  expect(output).toEqual({
    status: 'fulfilled',
    value: { value: BigInt(1) },
  });
});

it('fulfilled analyze bigint value with coerce option and boolean value (true)', () => {
  @IsGuard
  class TestClass {
    @IsBigInt({ coerce: true })
    public value!: bigint;
  }

  const output = analyze.sync({ value: true }, TestClass);

  expect(output).toEqual({
    status: 'fulfilled',
    value: { value: BigInt(1) },
  });
});

it('fulfilled analyze bigint value with coerce option and boolean value (false)', () => {
  @IsGuard
  class TestClass {
    @IsBigInt({ coerce: true })
    public value!: bigint;
  }

  const output = analyze.sync({ value: false }, TestClass);

  expect(output).toEqual({
    status: 'fulfilled',
    value: { value: BigInt(0) },
  });
});

it('reject analyze non-bigint value without coerce option', () => {
  @IsGuard
  class TestClass {
    @IsBigInt({ coerce: false })
    public value!: bigint;
  }

  const output = analyze.sync({ value: 'not a bigint' }, TestClass);

  expect(output).toEqual({
    status: 'rejected',
    reason: expect.any(ValidationError),
  });
});
