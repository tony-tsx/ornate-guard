/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import type Benchmark from 'benchmark';
import fs from 'fs/promises';
import path from 'path';

const filter = process.argv[2];

void (async () => {
  const files = await fs.readdir(path.resolve('benchmarks'));

  const suites = await Promise.all(
    files.map(async file => {
      const { default: _default, ...module } = await import(
        path.resolve(`benchmarks`, file)
      );

      if (_default)
        return Object.values(module).concat(_default) as Benchmark.Suite[];

      return Object.values(module) as Benchmark.Suite[];
    }),
  );

  for (const benchmark of suites.flat(1)) {
    if (filter && benchmark.name && !benchmark.name.includes(filter)) {
      console.log(`[${benchmark.name}]: skipping`);
      continue;
    }

    await Promise.all([
      new Promise<void>(resolve => {
        process.nextTick(() => {
          benchmark.run();
          resolve();
        });
      }),
      new Promise<void>(resolve => {
        benchmark.on(
          'cycle',
          function (this: Benchmark.Suite, event: Benchmark.Event) {
            console.log(`[${this.name}]: ${event.target.toString()}`);
          },
        );
        benchmark.on('complete', function (this: Benchmark.Suite) {
          console.log(
            `[${this.name}]: fastest is ${this.filter('fastest')
              .map('name')
              .join(',')}`,
          );
          resolve();
        });
      }),
    ]);
  }
})();
