import { describe, it } from 'vitest';
import { Use } from '../Use.js';
import { analyze } from '../../analyze.js';
import assert from 'node:assert/strict';
import { IsGuard } from '../IsGuard.js';

describe('Use', () => {
  it('should test fail with callback to adds issue', () => {
    @IsGuard
    class Test {
      @Use(function (context) {
        context.issues.push(this.issue('Not ok'));
      })
      public test!: unknown;
    }

    const output = analyze.sync({ test: 123 }, Test);

    assert.equal(output.status, 'rejected');

    assert.equal(output.reason.inners.length, 1);

    assert.equal(output.reason.inners[0]!.issues.length, 1);

    assert.equal(output.reason.inners[0]!.issues[0]!.message, 'Not ok');
  });
});
