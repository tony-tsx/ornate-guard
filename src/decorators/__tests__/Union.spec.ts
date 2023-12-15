import { describe, expect, it, vi } from 'vitest';
import { Base } from '../../models/Base.js';
import { Union } from '../Union.js';
import { type Context } from '../../models/Context.js';
import { type Constraint } from '../../models/Constraint.js';
import assert from 'node:assert/strict';
import { IsGuard } from '../IsGuard.js';

describe('Union', () => {
  it('fall to second constraint', async () => {
    const fn1 = vi.fn(function (this: Constraint, context: Context) {
      context.issues.push(this.issue('nop'));
    });
    const fn2 = vi.fn(function (this: Constraint, context: Context) {
      context.value = 2;
    });

    @IsGuard
    class Test extends Base {
      @Union(fn1, fn2)
      public value!: string | number;
    }

    const result = await Test.analyze({
      union: 'however',
    });

    assert.equal(result.status, 'fulfilled');

    assert.equal(fn1.mock.calls.length, 1);

    assert.equal(fn2.mock.calls.length, 1);

    assert.equal(result.value.value, 2);
  });

  it('stop in first condition', async () => {
    const fn1 = vi.fn(function (this: Constraint, context: Context) {});
    const fn2 = vi.fn(function (this: Constraint, context: Context) {
      context.value = 2;
    });

    @IsGuard
    class Test extends Base {
      @Union(fn1, fn2)
      public value!: string | number;
    }

    const result = await Test.analyze({
      value: 'however',
    });

    assert.equal(result.status, 'fulfilled');

    expect(fn1).toHaveBeenCalled();
    expect(fn2).not.toHaveBeenCalled();

    expect(result.value.value).toBe('however');
  });

  it('second condition win union race', async () => {
    const sleep = async (ms: number) => {
      await new Promise<void>(resolve => setTimeout(resolve, ms));
    };
    const fn1 = vi.fn(async function (this: Constraint, context: Context) {
      await sleep(10);
      context.value = 1;
    });

    const fn2 = vi.fn(async function (this: Constraint, context: Context) {
      await sleep(5);
      context.value = 2;
    });

    @IsGuard
    class Test extends Base {
      @Union(fn1, fn2)
      public value!: string | number;
    }

    const result = await Test.analyze({
      union: 'however',
    });

    assert.equal(result.status, 'fulfilled');

    assert.equal(fn1.mock.calls.length, 1);

    assert.equal(fn2.mock.calls.length, 1);

    assert.equal(result.value.value, 1);
  });
});
