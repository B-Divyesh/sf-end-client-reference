import type { RelationshipRecord } from './types';

export const CSV_HEADERS = [
  'Created at', 'Billing client', 'End client', 'Project / PO reference',
  'Invoice number', 'Service period', 'Source PDF'
];

function hasSpreadsheetFormulaPrefix(value: string): boolean {
  for (const character of value) {
    const codePoint = character.codePointAt(0) ?? 0;
    if (codePoint <= 0x20 || codePoint === 0xfeff) continue;
    return '=+-@'.includes(character);
  }
  return false;
}

export function csvCell(value: string): string {
  // Quoting protects CSV boundaries, but spreadsheet apps can still execute a
  // leading formula. An apostrophe makes the cell literal without changing the
  // saved relationship or the text drawn on the PDF cover.
  const literalValue = hasSpreadsheetFormulaPrefix(value) ? `'${value}` : value;
  return `"${literalValue.replaceAll('"', '""')}"`;
}

export function recordsToCsv(records: RelationshipRecord[]): string {
  const rows = records.map((record) => [
    record.createdAt, record.billingClient, record.endClient, record.reference,
    record.invoiceNumber, record.servicePeriod, record.sourceFileName
  ].map(csvCell).join(','));
  return `\uFEFF${CSV_HEADERS.map(csvCell).join(',')}\r\n${rows.join('\r\n')}`;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export function safeFilename(value: string): string {
  const safe = value.normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
  return safe.slice(0, 72) || 'invoice';
}
