import { describe, expect, it } from 'vitest';
import { IsGuard } from '../IsGuard.js';
import { IsMap } from '../IsMap.js';
import { IsBoolean } from '../IsBoolean.js';
import { IsString } from '../IsString.js';
import { analyze } from '../../analyze.js';
import { IsNumber } from '../IsNumber.js';

describe('IsMap', () => {
  it('coerce with boolean as a key', () => {
    @IsGuard
    class Root {
      @IsMap(IsBoolean('comprehensive'), IsString(), { coerce: true })
      public map!: Map<boolean, string>;
    }

    const output = analyze.sync({ map: { true: 'test' } }, Root);

    expect(output).toEqual({
      status: 'fulfilled',
      value: { map: expect.any(Map) },
    });

    // @ts-expect-error: ...
    const map = output.value.map as unknown as Map<unknown, unknown>;

    expect(Array.from(map.entries())).toEqual([[true, 'test']]);
  });

  it('coerce with number as a key', () => {
    @IsGuard
    class Root {
      @IsMap(IsNumber({ coerce: true }), IsString(), { coerce: true })
      public map!: Map<number, string>;
    }

    const output = analyze.sync({ map: { 0: 'test', 1: 'test' } }, Root);

    expect(output).toEqual({
      status: 'fulfilled',
      value: { map: expect.any(Map) },
    });

    // @ts-expect-error: ...
    const map = output.value.map as unknown as Map<unknown, unknown>;

    expect(Array.from(map.entries())).toEqual([
      [0, 'test'],
      [1, 'test'],
    ]);
  });
});
