import { describe, expect, it } from 'vitest';
import { analyze } from '../analyze.js';
// import assert from 'node:assert/strict';
// import { IsString } from '../decorators/IsString.js';
import { Constraint } from '../models/Constraint.js';
import { type Context } from '../models/Context.js';
import { Use } from '../decorators/Use.js';
import { Is } from '../decorators/Is.js';
import { IsGuard } from '../decorators/IsGuard.js';
import { isGuard } from '../tools/isGuard.js';

describe('purify', () => {
  // it('default values', () => {
  //   class Schema {
  //     @IsString()
  //     public property = 'a';
  //   }

  //   const output = analyze.sync({}, Schema);

  //   assert.equal(output.status, 'fulfilled');

  //   assert.equal(output.value.property, 'a');
  // });

  // it('presever input value', () => {
  //   class Schema {
  //     @IsString()
  //     public property = 'a';
  //   }

  //   const output = analyze.sync({ string: 'b' }, Schema);

  //   assert.equal(output.status, 'fulfilled');

  //   assert.equal(output.value.property, 'b');
  // });

  it.only('', async () => {
    class TestConstaint extends Constraint {
      public async parse(context: Context<unknown>) {
        return context.issues.push(this.issue('tests'));
      }
    }

    @IsGuard
    class TestSubLevel {
      @Use(new TestConstaint())
      public property: unknown;
    }

    @IsGuard
    class TestFirstLevel {
      @Is(() => TestSubLevel)
      public property: unknown;
    }

    await analyze({ property: { property: {} } }, TestFirstLevel);

    expect(isGuard(TestSubLevel)).toBe(true);
    expect(isGuard(TestFirstLevel)).toBe(true);
  });
});
