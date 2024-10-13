import { type Constraint } from './Constraint.js';

export class Issue {
  public readonly name = 'Issue';

  constructor(
    public readonly message: string,
    public readonly constraint?: Constraint,
  ) {}
}

export interface Issue extends OrnateGuard.Issue {}

declare global {
  namespace OrnateGuard {
    interface Issue {}
  }
}
