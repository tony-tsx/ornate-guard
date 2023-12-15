import Benchmark from 'benchmark';
import { IsBoolean } from '../src/decorators/IsBoolean.js';
import { assert } from '../src/assert.js';
import { z } from 'zod';
import y from 'yup';
import * as cv from 'class-validator';
import * as ct from 'class-transformer';

class Lib {
  @IsBoolean(true)
  public property!: boolean;
}

class ClassValidator {
  @cv.IsBoolean()
  public property!: boolean;
}

const zod = z.object({
  property: z.coerce.boolean(),
});

const yup = y.object({
  property: y.boolean().transform(value => Boolean(value)),
});

const input = { property: 3 };

export const basicBoolean = new Benchmark.Suite('boolean-coerce')
  .add('lib', () => {
    assert.sync(input, Lib);
  })
  .add('zod', () => {
    zod.parse(input);
  })
  .add('yup', () => {
    yup.validateSync(input, { strict: false, abortEarly: false });
  })
  .add('class validator', () => {
    cv.validateSync(ct.plainToInstance(ClassValidator, input));
  });
