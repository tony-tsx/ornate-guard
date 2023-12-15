import Benchmark from 'benchmark';
import { IsNumber } from '../src/decorators/IsNumber.js';
import { assert } from '../src/assert.js';
import { z } from 'zod';
import y from 'yup';
import * as cv from 'class-validator';
import * as ct from 'class-transformer';

class Lib {
  @IsNumber()
  public property!: number;
}

class ClassValidator {
  @cv.IsNumber()
  public property!: number;
}

const zod = z.object({
  property: z.number(),
});

const yup = y.object({
  property: y.number(),
});

const input = { property: 123 };

export const basicNumber = new Benchmark.Suite('number')
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
