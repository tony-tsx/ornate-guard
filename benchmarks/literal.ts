import Benchmark from 'benchmark';
import { assert } from '../src/assert.js';
import { z } from 'zod';
import y from 'yup';
import * as cv from 'class-validator';
import * as ct from 'class-transformer';
import { IsLiteral } from '../src/decorators/IsLiteral.js';

class Lib {
  @IsLiteral(1)
  public property!: number;
}

class ClassValidator {
  @cv.IsEnum([1])
  public property!: number;
}

const zod = z.object({
  property: z.literal(1),
});

const yup = y.object({
  property: y.number().oneOf([1]),
});

const input = { property: 1 };

export default new Benchmark.Suite('literal')
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
