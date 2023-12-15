import Benchmark from 'benchmark';
import { assert } from '../src/assert.js';
import { z } from 'zod';
import y from 'yup';
import * as cv from 'class-validator';
import * as ct from 'class-transformer';
import { IsEnum } from '../src/decorators/IsEnum.js';

const _enum = ['a', 'b', 'c'] as const;

class Lib {
  @IsEnum(_enum)
  public property!: number;
}

class ClassValidator {
  @cv.IsEnum(_enum)
  public property!: number;
}

const zod = z.object({
  property: z.enum(_enum),
});

const yup = y.object({
  property: y.string().oneOf(Object.values(_enum)),
});

const input = { property: _enum[1] };

export default new Benchmark.Suite('enum')
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
