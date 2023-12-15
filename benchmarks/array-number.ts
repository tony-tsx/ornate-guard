import Benchmark from 'benchmark';
import { assert } from '../src/assert.js';
import { z } from 'zod';
import y from 'yup';
import * as cv from 'class-validator';
import * as ct from 'class-transformer';
import { IsArray } from '../src/decorators/IsArray.js';
import { IsNumber } from '../src/decorators/IsNumber.js';

class Lib {
  @IsArray(IsNumber())
  public property!: string;
}

class ClassValidator {
  @cv.IsArray()
  @cv.IsNumber({}, { each: true })
  public property!: string;
}

const zod = z.object({
  property: z.array(z.number()),
});

const yup = y.object({
  property: y.array(y.number()),
});

const input = { property: [123] };

export const basicString = new Benchmark.Suite('array<number>')
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
