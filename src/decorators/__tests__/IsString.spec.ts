import { describe, it } from 'vitest';
import { IsString } from '../IsString.js';
import { analyze } from '../../analyze.js';
import assert from 'node:assert/strict';
import { IsGuard } from '../IsGuard.js';

describe('IsString', () => {
  it(`adds must be string issue when receive a number`, () => {
    @IsGuard
    class Test {
      @IsString()
      public test!: string;
    }

    const output = analyze.sync({ test: 123 }, Test);

    assert.equal(output.status, 'rejected');

    assert.ok(output.reason.inners.length);

    assert.ok(output.reason.inners[0]!.issues.length);

    assert.equal(output.reason.inners[0]!.issues[0]!.message, 'Must be string');
  });

  it('coerce support', () => {
    @IsGuard
    class Test {
      @IsString({ coerce: true })
      public test!: string;
    }

    const output = analyze.sync({ test: 123 }, Test);

    assert.equal(output.status, 'fulfilled');

    assert.equal(output.value.test, '123');
  });

  it('reject when min length is not satisfied', () => {
    @IsGuard
    class Test {
      @IsString({ min: 5 })
      public test!: string;
    }

    const output = analyze.sync({ test: '123' }, Test);

    assert.equal(output.status, 'rejected');

    assert.ok(output.reason.inners.length);

    assert.ok(output.reason.inners[0]!.issues.length);

    assert.equal(
      output.reason.inners[0]!.issues[0]!.message,
      'Must be at least 5 or more characters long',
    );
  });

  it('fulfill when min length is satisfied', () => {
    @IsGuard
    class Test {
      @IsString({ min: 5 })
      public test!: string;
    }

    const output = analyze.sync({ test: '12345' }, Test);

    assert.equal(output.status, 'fulfilled');
  });

  it('reject when max length is not satisfied', () => {
    @IsGuard
    class Test {
      @IsString({ max: 5 })
      public test!: string;
    }

    const output = analyze.sync({ test: '123456' }, Test);

    assert.equal(output.status, 'rejected');

    assert.ok(output.reason.inners.length);

    assert.ok(output.reason.inners[0]!.issues.length);

    assert.equal(
      output.reason.inners[0]!.issues[0]!.message,
      'Must be at most 5 or fewer characters long',
    );
  });

  it('fulfill when max length is satisfied', () => {
    @IsGuard
    class Test {
      @IsString({ max: 5 })
      public test!: string;
    }

    const output = analyze.sync({ test: '12345' }, Test);

    assert.equal(output.status, 'fulfilled');
  });

  it('reject when length is not satisfied', () => {
    @IsGuard
    class Test {
      @IsString({ length: 5 })
      public test!: string;
    }

    const output = analyze.sync({ test: '123456' }, Test);

    assert.equal(output.status, 'rejected');
  });

  it('fulfill when length is satisfied', () => {
    @IsGuard
    class Test {
      @IsString({ length: 5 })
      public test!: string;
    }

    const output = analyze.sync({ test: '12345' }, Test);

    assert.equal(output.status, 'fulfilled');
  });

  it('reject when pattern is not satisfied', () => {
    @IsGuard
    class Test {
      @IsString({ pattern: /abc/ })
      public test!: string;
    }

    const output = analyze.sync({ test: '12345' }, Test);

    assert.equal(output.status, 'rejected');
  });

  it('fulfill when pattern is satisfied', () => {
    @IsGuard
    class Test {
      @IsString({ pattern: /abc/ })
      public test!: string;
    }

    const output = analyze.sync({ test: 'abc' }, Test);

    assert.equal(output.status, 'fulfilled');
  });

  it('reject when includes is not satisfied', () => {
    @IsGuard
    class Test {
      @IsString({ includes: 'abc' })
      public test!: string;
    }

    const output = analyze.sync({ test: '12345' }, Test);

    assert.equal(output.status, 'rejected');
  });

  it('fulfill when includes is satisfied', () => {
    @IsGuard
    class Test {
      @IsString({ includes: 'abc' })
      public test!: string;
    }

    const output = analyze.sync({ test: 'abc' }, Test);

    assert.equal(output.status, 'fulfilled');
  });

  it('reject when startsWith is not satisfied', () => {
    @IsGuard
    class Test {
      @IsString({ startsWith: 'abc' })
      public test!: string;
    }

    const output = analyze.sync({ test: '12345' }, Test);

    assert.equal(output.status, 'rejected');
  });

  it('fulfill when startsWith is satisfied', () => {
    @IsGuard
    class Test {
      @IsString({ startsWith: 'abc' })
      public test!: string;
    }

    const output = analyze.sync({ test: 'abc123' }, Test);

    assert.equal(output.status, 'fulfilled');
  });

  it('reject when endsWith is not satisfied', () => {
    @IsGuard
    class Test {
      @IsString({ endsWith: 'abc' })
      public test!: string;
    }

    const output = analyze.sync({ test: '12345' }, Test);

    assert.equal(output.status, 'rejected');
  });

  it('fulfill when endsWith is satisfied', () => {
    @IsGuard
    class Test {
      @IsString({ endsWith: 'abc' })
      public test!: string;
    }

    const output = analyze.sync({ test: '123abc' }, Test);

    assert.equal(output.status, 'fulfilled');
  });

  it('reject when notStartsWith is not satisfied', () => {
    @IsGuard
    class Test {
      @IsString({ notStartsWith: 'abc' })
      public test!: string;
    }

    const output = analyze.sync({ test: 'abc123' }, Test);

    assert.equal(output.status, 'rejected');
  });

  it('fulfill when notStartsWith is satisfied', () => {
    @IsGuard
    class Test {
      @IsString({ notStartsWith: 'abc' })
      public test!: string;
    }

    const output = analyze.sync({ test: '123abc' }, Test);

    assert.equal(output.status, 'fulfilled');
  });

  it('reject when notEndsWith is not satisfied', () => {
    @IsGuard
    class Test {
      @IsString({ notEndsWith: 'abc' })
      public test!: string;
    }

    const output = analyze.sync({ test: '123abc' }, Test);

    assert.equal(output.status, 'rejected');
  });

  it('fulfill when notEndsWith is satisfied', () => {
    @IsGuard
    class Test {
      @IsString({ notEndsWith: 'abc' })
      public test!: string;
    }

    const output = analyze.sync({ test: 'abc123' }, Test);

    assert.equal(output.status, 'fulfilled');
  });
});
