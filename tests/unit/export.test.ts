import { describe, expect, it } from 'vitest';
import { csvCell, recordsToCsv, safeFilename } from '../../src/export';

describe('relationship exports', () => {
  it('quotes fields without altering client text', () => {
    expect(csvCell('Acme, "North"')).toBe('"Acme, ""North"""');
    const csv = recordsToCsv([{
      id: '1', billingClient: 'Prime & Co', endClient: '客户 Ω', reference: 'PO/42, phase "A"',
      invoiceNumber: 'INV-7', servicePeriod: 'May 2026', sourceFileName: 'invoice.pdf', createdAt: '2026-08-28T00:00:00.000Z'
    }]);
    expect(csv).toContain('"客户 Ω"');
    expect(csv).toContain('"PO/42, phase ""A"""');
    expect(csv.startsWith('\uFEFF')).toBe(true);
  });

  it('neutralizes every spreadsheet formula prefix in exported cells', () => {
    const dangerousValues = [
      '=HYPERLINK("https://example.invalid","open")',
      '+SUM(1,1)',
      '-2+3',
      '@DANGEROUS',
      '\t=HIDDEN',
    ];
    for (const value of dangerousValues) {
      expect(csvCell(value)).toBe(`"'${value.replaceAll('"', '""')}"`);
    }

    const csv = recordsToCsv([{
      id: 'formula-row', createdAt: '=NOW()', billingClient: '+SUM(1,1)', endClient: '-2+3',
      reference: '@DANGEROUS', invoiceNumber: ' =TRIMMED', servicePeriod: '\t+HIDDEN', sourceFileName: '\uFEFF@invoice.pdf'
    }]);
    expect(csv).toContain('"\'=NOW()","\'+SUM(1,1)","\'-2+3","\'@DANGEROUS","\' =TRIMMED","\'\t+HIDDEN","\'\uFEFF@invoice.pdf"');
  });

  it('creates filesystem-safe download names', () => {
    expect(safeFilename('INV 42 / North')).toBe('INV-42-North');
    expect(safeFilename('💼')).toBe('invoice');
  });
});
