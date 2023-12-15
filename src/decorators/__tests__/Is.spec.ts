import { expect, it } from 'vitest';
import { Is } from '../Is.js';
import { IsUUID } from '../IsUUID.js';
import { Base } from '../../models/Base.js';
import { randomUUID } from 'node:crypto';
import { IsString } from '../IsString.js';
import { ValidationError } from '../../models/ValidationError.js';
import { IsNullable } from '../IsNullable.js';
import { IsGuard } from '../IsGuard.js';

it('use nested class', async () => {
  @IsGuard
  class Nested {
    @IsString()
    public name!: string;
  }

  @IsGuard
  class Test extends Base {
    @Is(() => Nested)
    public nested!: Nested;
  }

  const testData = {
    nested: {
      name: 'John Doe',
    },
  };

  const result = await Test.analyze(testData);

  expect(result).toEqual({
    status: 'fulfilled',
    value: {
      nested: expect.any(Nested),
    },
  });
});

it('use multiple nested classes', async () => {
  @IsGuard
  class NestedA {
    @IsString()
    public name!: string;
  }

  @IsGuard
  class NestedB {
    @IsUUID()
    public id!: string;
  }

  @IsGuard
  class Test extends Base {
    @Is(() => NestedA)
    public nestedA!: NestedA;

    @Is(() => NestedB)
    public nestedB!: NestedB;
  }

  const testData = {
    nestedA: {
      name: 'John Doe',
    },
    nestedB: {
      id: randomUUID(),
    },
  };

  const result = await Test.analyze(testData);

  expect(result).toEqual({
    status: 'fulfilled',
    value: {
      nestedA: expect.any(NestedA),
      nestedB: expect.any(NestedB),
    },
  });
});

it('reject invalid nested analyze', async () => {
  @IsGuard
  class Nested {
    @IsString()
    public name!: string;
  }

  @IsGuard
  class Test extends Base {
    @Is(() => Nested)
    public nested!: Nested;
  }

  const testData = {
    nested: {
      name: 123, // Invalid value, should be a string
    },
  };

  const result = await Test.analyze(testData);

  expect(result).toEqual({
    status: 'rejected',
    reason: expect.any(ValidationError),
  });
});

it('use discriminator', async () => {
  class Sub<TType extends string> {
    @IsString()
    public type!: TType;

    @IsUUID()
    public id!: string;
  }

  @IsGuard
  class SubA extends Sub<'A'> {}
  @IsGuard
  class SubB extends Sub<'B'> {}
  @IsGuard
  class SubC extends Sub<'C'> {}

  @IsGuard
  class Test extends Base {
    @Is(() => Sub, {
      discriminator: {
        selector: 'type',
        map: {
          a: () => SubA,
          b: () => SubB,
          c: () => SubC,
        },
      },
    })
    public sub!: Sub<string>;
  }

  let result = await Test.analyze({ sub: { id: randomUUID(), type: 'a' } });

  expect(result).toEqual({
    status: 'fulfilled',
    value: { sub: expect.any(SubA) },
  });

  result = await Test.analyze({ sub: { id: randomUUID(), type: 'b' } });

  expect(result).toEqual({
    status: 'fulfilled',
    value: { sub: expect.any(SubB) },
  });

  result = await Test.analyze({ sub: { id: randomUUID(), type: 'c' } });

  expect(result).toEqual({
    status: 'fulfilled',
    value: { sub: expect.any(SubC) },
  });
});

it('reject invalid discriminator', async () => {
  class Sub<TType extends string> {
    @IsString()
    public type!: TType;

    @IsUUID()
    public id!: string;
  }

  class SubA extends Sub<'A'> {}
  class SubB extends Sub<'B'> {}
  class SubC extends Sub<'C'> {}

  @IsGuard
  class Test extends Base {
    @Is(() => Sub, {
      discriminator: {
        selector: 'type',
        map: {
          a: () => SubA,
          b: () => SubB,
          c: () => SubC,
        },
      },
    })
    public sub!: Sub<string>;
  }

  const testData = {
    sub: {
      id: randomUUID(),
      type: 'd', // Invalid discriminator value
    },
  };

  const result = await Test.analyze(testData);

  expect(result).toEqual({
    status: 'rejected',
    reason: expect.any(ValidationError),
  });
});
it('use nested class with additional properties', async () => {
  @IsGuard
  class Nested {
    @IsString()
    public name!: string;
  }

  @IsGuard
  class Test extends Base {
    @Is(() => Nested)
    public nested!: Nested;

    @IsString()
    public additionalProperty!: string;
  }

  const testData = {
    nested: {
      name: 'John Doe',
    },
    additionalProperty: 'Additional Property',
  };

  const result = await Test.analyze(testData);

  expect(result).toEqual({
    status: 'fulfilled',
    value: {
      nested: expect.any(Nested),
      additionalProperty: 'Additional Property',
    },
  });
});

it('use nested class with optional property', async () => {
  @IsGuard
  class Nested {
    @IsString()
    public name?: string;
  }

  @IsGuard
  class Test extends Base {
    @Is(() => Nested)
    public nested?: Nested;
  }

  const testData = {
    nested: {
      name: 'John Doe',
    },
  };

  const result = await Test.analyze(testData);

  expect(result).toEqual({
    status: 'fulfilled',
    value: {
      nested: expect.any(Nested),
    },
  });
});

it('use nested class with nullable property', async () => {
  @IsGuard
  class Nested {
    @IsString()
    @IsNullable()
    public name!: string | null;
  }

  @IsGuard
  class Test extends Base {
    @Is(() => Nested)
    public nested!: Nested;
  }

  const testData = {
    nested: {
      name: null,
    },
  };

  const output = await Test.analyze(testData);

  expect(output).toEqual({
    status: 'fulfilled',
    value: {
      nested: expect.any(Nested),
    },
  });
});

it('use nested class with multiple decorators', async () => {
  @IsGuard
  class Nested {
    @IsString()
    public name!: string;

    @IsUUID()
    public id!: string;
  }

  @IsGuard
  class Test extends Base {
    @Is(() => Nested)
    public nested!: Nested;
  }

  const testData = {
    nested: {
      name: 'John Doe',
      id: randomUUID(),
    },
  };

  const result = await Test.analyze(testData);

  expect(result).toEqual({
    status: 'fulfilled',
    value: {
      nested: expect.any(Nested),
    },
  });
});
