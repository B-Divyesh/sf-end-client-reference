import type { RelationshipRecord } from './types';

export const BACKUP_VERSION = 1;

export interface RelationshipBackup {
  version: typeof BACKUP_VERSION;
  exportedAt: string;
  records: RelationshipRecord[];
}

const MAX_LENGTHS = {
  id: 200,
  billingClient: 180,
  endClient: 180,
  reference: 220,
  invoiceNumber: 100,
  servicePeriod: 100,
  sourceFileName: 512,
  createdAt: 40,
} as const;
const UTC_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringWithin(value: unknown, maximum: number, required = false): value is string {
  return typeof value === 'string' && value.length <= maximum && (!required || value.trim().length > 0);
}

function isUtcTimestamp(value: unknown): value is string {
  return isStringWithin(value, MAX_LENGTHS.createdAt, true)
    && UTC_TIMESTAMP.test(value)
    && Number.isFinite(Date.parse(value));
}

/** Validate every persisted field before it reaches rendering or IndexedDB. */
export function isRelationshipRecord(value: unknown): value is RelationshipRecord {
  if (!isObject(value)) return false;
  return isStringWithin(value.id, MAX_LENGTHS.id, true)
    && isStringWithin(value.billingClient, MAX_LENGTHS.billingClient, true)
    && isStringWithin(value.endClient, MAX_LENGTHS.endClient, true)
    && isStringWithin(value.reference, MAX_LENGTHS.reference, true)
    && isStringWithin(value.invoiceNumber, MAX_LENGTHS.invoiceNumber)
    && isStringWithin(value.servicePeriod, MAX_LENGTHS.servicePeriod)
    && isStringWithin(value.sourceFileName, MAX_LENGTHS.sourceFileName, true)
    && isUtcTimestamp(value.createdAt);
}

function copyRecord(record: RelationshipRecord): RelationshipRecord {
  return {
    id: record.id,
    billingClient: record.billingClient,
    endClient: record.endClient,
    reference: record.reference,
    invoiceNumber: record.invoiceNumber,
    servicePeriod: record.servicePeriod,
    sourceFileName: record.sourceFileName,
    createdAt: record.createdAt,
  };
}

/** Parse a complete, supported backup without returning any partially valid data. */
export function parseRelationshipBackup(value: unknown): RelationshipBackup {
  if (!isObject(value)
    || value.version !== BACKUP_VERSION
    || !isUtcTimestamp(value.exportedAt)
    || !Array.isArray(value.records)
    || !value.records.every(isRelationshipRecord)) {
    throw new Error('Invalid Performed For backup.');
  }
  return {
    version: BACKUP_VERSION,
    exportedAt: value.exportedAt,
    records: value.records.map(copyRecord),
  };
}

export function createRelationshipBackup(records: RelationshipRecord[], exportedAt = new Date().toISOString()): RelationshipBackup {
  if (!records.every(isRelationshipRecord) || !isUtcTimestamp(exportedAt)) {
    throw new Error('Relationship records could not be backed up.');
  }
  return { version: BACKUP_VERSION, exportedAt, records: records.map(copyRecord) };
}
