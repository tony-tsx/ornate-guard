import Benchmark from 'benchmark';
import { assert } from '../src/assert.js';
import { z } from 'zod';
import y from 'yup';
import * as cv from 'class-validator';
import * as ct from 'class-transformer';
import { IsEnum } from '../src/decorators/IsEnum.js';

enum Enum {
  A = 'a',
  B = 'b',
  C = 'c',
}

class Lib {
  @IsEnum(Enum)
  public property!: number;
}

class ClassValidator {
  @cv.IsEnum(Enum)
  public property!: number;
}

const zod = z.object({
  property: z.nativeEnum(Enum),
});

const yup = y.object({
  property: y.string().oneOf(Object.values(Enum)),
});

const input = { property: Enum.A };

export default new Benchmark.Suite('native enum')
  .add('lib', () => {
    assert.sync(input, Lib);
  })
  .add('zod', () => {
    zod.parse(input);
  })
  .add('yup', () => {
    yup.validateSync(input);
  })
  .add('class validator', () => {
    cv.validateSync(ct.plainToInstance(ClassValidator, input));
  });
