import { type Issue } from '../models/Issue.js';
import { type ValidationError } from '../models/ValidationError.js';

function _toMap(validationError: ValidationError) {
  const map: Array<[PropertyKey[], Issue[]]> = [];

  const path = !validationError.path.length
    ? ['$..']
    : ['$', ...validationError.path];

  for (const issue of validationError.issues) {
    const entry = map.find(([entryPath]) => {
      if (entryPath.length !== path.length) return false;

      for (let i = 0; i < path.length; i++)
        if (path[i] !== entryPath[i]) return false;

      return true;
    });

    if (!entry) map.push([path, [issue]]);
    else entry[1].push(issue);
  }

  for (const inner of validationError.inners)
    for (const [innerPath, issues] of _toMap(inner)) {
      const entry = map.find(([entryPath]) => {
        if (entryPath.length !== innerPath.length) return false;

        for (let i = 0; i < innerPath.length; i++)
          if (innerPath[i] !== entryPath[i]) return false;

        return true;
      });

      if (!entry) map.push([innerPath, issues]);
      else entry[1].push(...issues);
    }

  return map;
}

export function toMap(validationError: ValidationError) {
  return _toMap(validationError);
}
