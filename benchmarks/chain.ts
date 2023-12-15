import Benchmark from 'benchmark';
import { IsUUID } from '../src/decorators/IsUUID.js';
import { Chain } from '../src/decorators/Chain.js';

import { assert } from '../src/assert.js';
import { z } from 'zod';
import y from 'yup';
import { Transform } from '../src/models/Transform.js';

class Lib {
  @Chain(IsUUID(), Transform.with(value => ({ id: value })))
  public property!: { id: string };
}

const zod = z.object({
  property: z
    .string()
    .uuid()
    .refine(value => ({ id: value })),
});

const yup = y.object({
  property: y.mixed().when({
    is: (value: unknown) => typeof value === 'object',
    then: () => y.object({ id: y.string().uuid() }),
    otherwise: () =>
      y
        .string()
        .uuid()
        .transform(value => ({ id: value })),
  }),
});

const input = { property: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' };

export default new Benchmark.Suite('chain')
  .add('lib', () => {
    assert.sync(input, Lib);
  })
  .add('zod', () => {
    zod.parse(input);
  })
  .add('yup', () => {
    yup.validateSync(input);
  });
