import { describe, expect, it } from 'vitest';
import { createRelationshipBackup, isRelationshipRecord, parseRelationshipBackup } from '../../src/records';

const record = {
  id: 'route-1',
  billingClient: 'Prime Client',
  endClient: 'End Client',
  reference: 'PO-42',
  invoiceNumber: '',
  servicePeriod: '',
  sourceFileName: 'invoice.pdf',
  createdAt: '2026-08-29T00:00:00.000Z',
};

describe('relationship record validation', () => {
  it('accepts the complete stored shape and rejects every wrong-typed field', () => {
    expect(isRelationshipRecord(record)).toBe(true);
    for (const field of Object.keys(record)) {
      expect(isRelationshipRecord({ ...record, [field]: 7 }), field).toBe(false);
    }
    expect(isRelationshipRecord({ ...record, billingClient: ' '.repeat(4) })).toBe(false);
    expect(isRelationshipRecord({ ...record, billingClient: 'x'.repeat(181) })).toBe(false);
    expect(isRelationshipRecord({ ...record, createdAt: 'not-a-date' })).toBe(false);
  });

  it('rejects an unsupported or partially invalid backup before returning records', () => {
    const backup = createRelationshipBackup([record], '2026-08-29T10:00:00.000Z');
    expect(parseRelationshipBackup(backup)).toEqual(backup);
    expect(() => parseRelationshipBackup({ ...backup, version: 2 })).toThrow('Invalid Performed For backup.');
    expect(() => parseRelationshipBackup({ ...backup, records: [record, { ...record, billingClient: 7 }] }))
      .toThrow('Invalid Performed For backup.');
    expect(() => parseRelationshipBackup({ version: 1, records: [record] })).toThrow('Invalid Performed For backup.');
  });

  it('copies only the supported record fields into a parsed backup', () => {
    const parsed = parseRelationshipBackup({
      version: 1,
      exportedAt: '2026-08-29T10:00:00.000Z',
      records: [{ ...record, unexpected: '<script>not persisted</script>' }],
    });
    expect(parsed.records[0]).toEqual(record);
    expect(parsed.records[0]).not.toHaveProperty('unexpected');
  });
});
