import type { RelationshipRecord } from './types';

export const CSV_HEADERS = [
  'Created at', 'Billing client', 'End client', 'Project / PO reference',
  'Invoice number', 'Service period', 'Source PDF'
];

export function csvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
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
