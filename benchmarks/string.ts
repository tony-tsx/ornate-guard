import Benchmark from 'benchmark';
import { IsString } from '../src/decorators/IsString.js';
import { assert } from '../src/assert.js';
import { z } from 'zod';
import y from 'yup';
import * as cv from 'class-validator';
import * as ct from 'class-transformer';

class Lib {
  @IsString()
  public property!: string;
}

class ClassValidator {
  @cv.IsString()
  public property!: string;
}

const zod = z.object({
  property: z.string(),
});

const yup = y.object({
  property: y.string(),
});

const input = { property: 'testing' };

export const basicString = new Benchmark.Suite('string')
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
