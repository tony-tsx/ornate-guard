import Benchmark from 'benchmark';
import { IsBoolean } from '../src/decorators/IsBoolean.js';
import { assert } from '../src/assert.js';
import { z } from 'zod';
import y from 'yup';
import * as cv from 'class-validator';
import * as ct from 'class-transformer';

class Lib {
  @IsBoolean()
  public property!: boolean;
}

class ClassValidator {
  @cv.IsBoolean()
  public property!: boolean;
}

const zod = z.object({
  property: z.boolean(),
});

const yup = y.object({
  property: y.boolean(),
});

const input = { property: false };

export const basicBoolean = new Benchmark.Suite('boolean')
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
