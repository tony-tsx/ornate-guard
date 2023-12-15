import Benchmark from 'benchmark';
import { IsString } from '../src/decorators/IsString.js';
import { assert } from '../src/assert.js';
import { z } from 'zod';
import y from 'yup';
import * as cv from 'class-validator';
import * as ct from 'class-transformer';
import { IsArray } from '../src/decorators/IsArray.js';

class Lib {
  @IsArray(IsString())
  public property!: string;
}

class ClassValidator {
  @cv.IsArray()
  @cv.IsString({ each: true })
  public property!: string;
}

const zod = z.object({
  property: z.array(z.string()),
});

const yup = y.object({
  property: y.array(y.string()),
});

const input = { property: ['testing'] };

export const basicString = new Benchmark.Suite('array<string>')
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
