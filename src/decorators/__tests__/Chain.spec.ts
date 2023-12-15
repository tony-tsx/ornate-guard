import { describe, expect, it, vi } from 'vitest';
import { IsString } from '../IsString.js';
import { Chain } from '../Chain.js';
import { type Context } from '../../models/Context.js';
import { Base } from '../../models/Base.js';
import { Constraint } from '../../models/Constraint.js';
import { IsGuard } from '../IsGuard.js';

describe('Chain', () => {
  it('should chain decorators', async () => {
    const constraint = vi.fn((context: Context<string>) => {});

    class TestConstraint extends Constraint<string, string> {
      public parse = vi.fn((context: Context<string>) => {});
    }

    const testConstraint = new TestConstraint();

    @IsGuard
    class Test extends Base {
      @Chain(IsString({ coerce: true }), testConstraint, constraint)
      public readonly property!: string;
    }

    expect(constraint).not.toHaveBeenCalled();

    await Test.assert({ property: 123 });

    expect(constraint).toHaveBeenCalledWith(
      expect.objectContaining({ value: '123' }),
      expect.anything(),
    );

    expect(testConstraint.parse).toHaveBeenCalledWith(
      expect.objectContaining({ value: '123' }),
    );
  });
});
