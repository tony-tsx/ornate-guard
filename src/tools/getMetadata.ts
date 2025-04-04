import { Metadata } from '../models/Metadata.js';
import { type Constructable } from '../types.js';

const ORNATE_GUARD_METADATA = Symbol.for('ornate-guard:metadata');

export function getMetadata<T extends object>(
  schema: Constructable<T>,
): Metadata {
  if (ORNATE_GUARD_METADATA in schema) {
    const metadata = schema[ORNATE_GUARD_METADATA] as Metadata;

    if (metadata.target === schema) return metadata;
  }

  Object.defineProperty(schema, ORNATE_GUARD_METADATA, {
    value: new Metadata(schema),
    enumerable: false,
    configurable: false,
    writable: false,
  });

  // @ts-expect-error: TODO
  return schema[ORNATE_GUARD_METADATA];
}
