import { expect, it } from 'vitest';
import { analyze } from '../analyze.js';
// import assert from 'node:assert/strict';
// import { IsString } from '../decorators/IsString.js';
import { Constraint } from '../models/Constraint.js';
import { type Context } from '../models/Context.js';
import { Use } from '../decorators/Use.js';
import { Is } from '../decorators/Is.js';
import { IsGuard } from '../decorators/IsGuard.js';
import { isGuard } from '../tools/isGuard.js';
import { IsString } from '../decorators/IsString.js';

it('custom constraint test', async () => {
  class TestConstaint extends Constraint {
    public async parse(context: Context<unknown>) {
      return context.issues.push(this.issue('tests'));
    }
  }

  @IsGuard
  class TestSubLevel {
    @Use(new TestConstaint())
    public property: unknown;
  }

  @IsGuard
  class TestFirstLevel {
    @Is(() => TestSubLevel)
    public property: unknown;
  }

  await analyze({ property: { property: {} } }, TestFirstLevel);

  expect(isGuard(TestSubLevel)).toBe(true);
  expect(isGuard(TestFirstLevel)).toBe(true);
});

it('guard discriminator', async () => {
  @IsGuard({
    discriminatorProperty: 'type',
  })
  class Person {
    @IsString()
    public firstName!: string;

    @IsString()
    public lastName!: string;

    @IsString()
    public type!: string;
  }

  @IsGuard({
    discriminatorValue: 'doctor',
  })
  class Doctor extends Person {
    @IsString()
    public medicalLicenseNumber!: string;
  }

  @IsGuard({
    discriminatorValue: 'patient',
  })
  class Patient extends Person {
    @IsString()
    public patientId!: string;
  }

  expect(analyze.sync({ type: 'unknown' }, Person)).toEqual({
    status: 'rejected',
    reason: expect.objectContaining({
      target: expect.any(Person),
    }),
  });

  expect(analyze.sync({ type: 'doctor' }, Person)).toEqual({
    status: 'rejected',
    reason: expect.objectContaining({
      target: expect.any(Doctor),
    }),
  });

  expect(analyze.sync({ type: 'patient' }, Person)).toEqual({
    status: 'rejected',
    reason: expect.objectContaining({
      target: expect.any(Patient),
    }),
  });
});
