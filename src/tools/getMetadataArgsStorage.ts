import { MetadataArgsStorage } from '../models/MetadataArgsStorage.js';

const metadataArgsStorage = new MetadataArgsStorage();

export function getMetadataArgsStorage() {
  return metadataArgsStorage;
}
