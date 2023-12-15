import { Issue } from '../models/Issue.js';

export function isIssue(value: unknown): value is Issue {
  return typeof value === 'object' && value instanceof Issue;
}
