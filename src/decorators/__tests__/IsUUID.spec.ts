import assert from 'node:assert/strict';
import { describe, it } from 'vitest';
import { analyze } from '../../analyze.js';
import { IsUUID } from '../IsUUID.js';
import { IsGuard } from '../IsGuard.js';

const v1 = '3d844c18-a512-11ee-a506-0242ac120002';
const v2 = '000003e8-a512-21ee-9c00-325096b39f47';
const v3 = '45a113ac-c7f2-30b0-90a5-a399ab912716';
const v4 = 'e7bc4f2d-81f3-404f-ad0e-73a532a46ca5';
const v5 = '4be0643f-1d98-573b-97cd-ca98a65347dd';

const uuids = { v1, v2, v3, v4, v5 };

describe('IsUUID', () => {
  it('reject when invalid uuid is analyzed', () => {
    @IsGuard
    class Test {
      @IsUUID()
      public test!: unknown;
    }

    const output = analyze.sync({ test: '123' }, Test);

    assert.equal(output.status, 'rejected');

    assert.equal(output.reason.inners.length, 1);

    assert.equal(output.reason.inners[0]!.issues.length, 1);

    assert.equal(output.reason.inners[0]!.issues[0]!.message, 'Must be UUID');
  });

  for (const [key, uuid] of Object.entries(uuids))
    it(`fulfill when valid ${key} uuid is analyzed`, () => {
      @IsGuard
      class Test {
        @IsUUID()
        public test!: unknown;
      }

      const output = analyze.sync({ test: uuid }, Test);

      assert.equal(output.status, 'fulfilled');
    });

  for (const [key, uuid] of Object.entries({ v2, v3, v4, v5 }))
    it(`reject when expected uuid v1 and analyze uuid ${key}`, () => {
      @IsGuard
      class Test {
        @IsUUID('v1')
        public test!: unknown;
      }

      const output = analyze.sync({ test: uuid }, Test);

      assert.equal(output.status, 'rejected');

      assert.equal(output.reason.inners.length, 1);

      assert.equal(output.reason.inners[0]!.issues.length, 1);

      assert.equal(
        output.reason.inners[0]!.issues[0]!.message,
        'Must be UUID v1',
      );
    });

  it(`filfill when valid uuid v1 is analyzed`, () => {
    @IsGuard
    class Test {
      @IsUUID('v1')
      public test!: unknown;
    }

    const output = analyze.sync({ test: v1 }, Test);

    assert(output.status === 'fulfilled');

    assert.equal(output.value.test, v1);
  });

  for (const [key, uuid] of Object.entries({ v1, v3, v4, v5 }))
    it(`reject when expected uuid v2 and analyze uuid ${key}`, () => {
      @IsGuard
      class Test {
        @IsUUID('v2')
        public test!: unknown;
      }

      const output = analyze.sync({ test: uuid }, Test);

      assert.equal(output.status, 'rejected');

      assert.equal(output.reason.inners.length, 1);

      assert.equal(output.reason.inners[0]!.issues.length, 1);

      assert.equal(
        output.reason.inners[0]!.issues[0]!.message,
        'Must be UUID v2',
      );
    });

  it(`filfill when valid uuid v2 is analyzed`, () => {
    @IsGuard
    class Test {
      @IsUUID('v2')
      public test!: unknown;
    }

    const output = analyze.sync({ test: v2 }, Test);

    assert(output.status === 'fulfilled');

    assert.equal(output.value.test, v2);
  });

  for (const [key, uuid] of Object.entries({ v1, v2, v4, v5 }))
    it(`reject when expected uuid v3 and analyze uuid ${key}`, () => {
      @IsGuard
      class Test {
        @IsUUID('v3')
        public test!: unknown;
      }

      const output = analyze.sync({ test: uuid }, Test);

      assert.equal(output.status, 'rejected');

      assert.equal(output.reason.inners.length, 1);

      assert.equal(output.reason.inners[0]!.issues.length, 1);

      assert.equal(
        output.reason.inners[0]!.issues[0]!.message,
        'Must be UUID v3',
      );
    });

  it(`filfill when valid uuid v3 is analyzed`, () => {
    @IsGuard
    class Test {
      @IsUUID('v3')
      public test!: unknown;
    }

    const output = analyze.sync({ test: v3 }, Test);

    assert(output.status === 'fulfilled');

    assert.equal(output.value.test, v3);
  });

  for (const [key, uuid] of Object.entries({ v1, v2, v3, v5 }))
    it(`reject when expected uuid v4 and analyze uuid ${key}`, () => {
      @IsGuard
      class Test {
        @IsUUID('v4')
        public test!: unknown;
      }

      const output = analyze.sync({ test: uuid }, Test);

      assert.equal(output.status, 'rejected');

      assert.equal(output.reason.inners.length, 1);

      assert.equal(output.reason.inners[0]!.issues.length, 1);

      assert.equal(
        output.reason.inners[0]!.issues[0]!.message,
        'Must be UUID v4',
      );
    });

  it(`filfill when valid uuid v4 is analyzed`, () => {
    @IsGuard
    class Test {
      @IsUUID('v4')
      public test!: unknown;
    }

    const output = analyze.sync({ test: v4 }, Test);

    assert(output.status === 'fulfilled');

    assert.equal(output.value.test, v4);
  });

  for (const [key, uuid] of Object.entries({ v1, v2, v3, v4 }))
    it(`reject when expected uuid v5 and analyze uuid ${key}`, () => {
      @IsGuard
      class Test {
        @IsUUID('v5')
        public test!: unknown;
      }

      const output = analyze.sync({ test: uuid }, Test);

      assert.equal(output.status, 'rejected');

      assert.equal(output.reason.inners.length, 1);

      assert.equal(output.reason.inners[0]!.issues.length, 1);

      assert.equal(
        output.reason.inners[0]!.issues[0]!.message,
        'Must be UUID v5',
      );
    });

  it(`filfill when valid uuid v5 is analyzed`, () => {
    @IsGuard
    class Test {
      @IsUUID('v5')
      public test!: unknown;
    }

    const output = analyze.sync({ test: v5 }, Test);

    assert(output.status === 'fulfilled');

    assert.equal(output.value.test, v5);
  });

  it(`throw when invalid uuid version is provided`, () => {
    assert.throws(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      @IsGuard
      class Test {
        // @ts-expect-error: purposeful
        @IsUUID('v6')
        public test!: unknown;
      }
    });
  });
});
