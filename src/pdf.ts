import type { PackageDetails } from './types';
import type { PDFDocument as PDFDocumentType } from 'pdf-lib';

const PAGE_W = 1240;
const PAGE_H = 1754;
const PDF_READ_ERROR = 'That file could not be read as a PDF. Choose the original invoice PDF and try again.';
const PDF_PASSWORD_ERROR = 'Password-protected PDFs are not supported. Save an unlocked copy and try again.';

function readablePdfError(error: unknown): Error {
  if (error instanceof Error && error.message.toLowerCase().includes('encrypt')) {
    return new Error(PDF_PASSWORD_ERROR, { cause: error });
  }
  return new Error(PDF_READ_ERROR, { cause: error });
}

export function wrapText(context: CanvasRenderingContext2D, text: string, width: number): string[] {
  const segments = Array.from(text);
  const lines: string[] = [];
  let line = '';
  for (const char of segments) {
    const next = line + char;
    if (context.measureText(next).width > width && line) {
      lines.push(line);
      line = char;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function drawWrapped(context: CanvasRenderingContext2D, value: string, x: number, y: number, width: number, lineHeight: number): number {
  const lines = wrapText(context, value, width);
  // Relationship values are contractual identifiers. Never cut them off: the
  // caller selects a fitting type size before drawing, and every line is drawn.
  lines.forEach((line, index) => context.fillText(line, x, y + index * lineHeight));
  return y + lines.length * lineHeight;
}

function relationshipLayout(context: CanvasRenderingContext2D, values: string[]): { fontSize: number; lineHeight: number; lines: string[][] } {
  // Keep the complete three required values above the fixed payment notice.
  // Even the UI maximums (180/180/220) fit at the smallest selected size.
  for (let fontSize = 48; fontSize >= 20; fontSize -= 2) {
    context.font = `700 ${fontSize}px Arial, sans-serif`;
    const lines = values.map((value) => wrapText(context, value, 1040));
    const lineHeight = Math.ceil(fontSize * 1.2);
    const requiredHeight = lines.reduce((total, entry) => total + 66 + entry.length * lineHeight + 70, 0);
    if (requiredHeight <= 860) return { fontSize, lineHeight, lines };
  }
  // This fallback is defensive: it still draws all text rather than silently
  // omitting an identifier if a browser reports unusual glyph widths.
  context.font = '700 18px Arial, sans-serif';
  return { fontSize: 18, lineHeight: 22, lines: values.map((value) => wrapText(context, value, 1040)) };
}

async function coverPng(details: PackageDetails): Promise<Uint8Array> {
  const canvas = document.createElement('canvas');
  canvas.width = PAGE_W;
  canvas.height = PAGE_H;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Your browser could not prepare the cover page.');

  context.fillStyle = '#FFFCF4';
  context.fillRect(0, 0, PAGE_W, PAGE_H);
  context.strokeStyle = '#A6B89B';
  context.lineWidth = 3;
  for (let i = 0; i < 5; i += 1) {
    context.beginPath();
    context.ellipse(1010, 160, 100 + i * 38, 55 + i * 27, -0.22, 0, Math.PI * 2);
    context.stroke();
  }
  context.fillStyle = '#18332F';
  context.font = '700 34px Arial, sans-serif';
  context.fillText('PERFORMED FOR', 100, 116);
  context.fillStyle = '#52645F';
  context.font = '24px Arial, sans-serif';
  context.fillText('END-CLIENT COVER', 100, 158);
  context.strokeStyle = '#18332F';
  context.lineWidth = 4;
  context.beginPath(); context.moveTo(100, 214); context.lineTo(1140, 214); context.stroke();

  const rows: Array<[string, string]> = [
    ['BILLING CLIENT · PAYER', details.billingClient],
    ['SERVICES PERFORMED FOR · END CLIENT', details.endClient],
    ['PROJECT / PO REFERENCE', details.reference],
  ];
  const layout = relationshipLayout(context, rows.map(([, value]) => value));
  let y = 320;
  rows.forEach(([label], index) => {
    const valueLines = layout.lines[index] ?? [];
    context.fillStyle = index === 1 ? '#B5412F' : '#52645F';
    context.font = '700 22px Arial, sans-serif';
    context.fillText(label, 100, y);
    context.fillStyle = '#18332F';
    context.font = `700 ${layout.fontSize}px Arial, sans-serif`;
    valueLines.forEach((line, lineIndex) => context.fillText(line, 100, y + 66 + lineIndex * layout.lineHeight));
    y += 66 + valueLines.length * layout.lineHeight + 70;
    context.strokeStyle = '#A6B89B';
    context.lineWidth = 2;
    context.beginPath(); context.moveTo(100, y - 24); context.lineTo(1140, y - 24); context.stroke();
  });

  // The three required relationship values above are deliberately allocated
  // first. Optional invoice metadata remains useful context but never crowds
  // out a billing client, end client, or PO/reference.
  context.fillStyle = '#52645F';
  context.font = '700 20px Arial, sans-serif';
  context.fillText('INVOICE NUMBER', 100, y + 18);
  context.fillText('SERVICE PERIOD', 650, y + 18);
  context.fillStyle = '#18332F';
  // Small, fixed metadata type guarantees that the two optional 100-character
  // fields remain above the payment note even when required values use their
  // full allowed length.
  context.font = '16px Arial, sans-serif';
  drawWrapped(context, details.invoiceNumber || 'Not provided', 100, y + 58, 470, 20);
  drawWrapped(context, details.servicePeriod || 'Not provided', 650, y + 58, 470, 20);

  context.fillStyle = '#F4F0E6';
  context.fillRect(100, 1390, 1040, 190);
  context.fillStyle = '#18332F';
  context.font = '700 22px Arial, sans-serif';
  context.fillText('PAYMENT RESPONSIBILITY', 140, 1440);
  context.font = '25px Arial, sans-serif';
  const note = 'This cover identifies the end client only. The billing client remains responsible for payment. This document does not make the end client liable for payment.';
  drawWrapped(context, note, 140, 1490, 950, 36);
  context.fillStyle = '#52645F';
  context.font = '20px Arial, sans-serif';
  context.fillText(`Source: ${details.sourceFileName}`, 100, 1660);
  context.fillText('Prepared locally with Performed For', 100, 1698);

  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((result) => result ? resolve(result) : reject(new Error('Cover rendering failed.')), 'image/png'));
  return new Uint8Array(await blob.arrayBuffer());
}

export async function buildInvoicePackage(source: ArrayBuffer, details: PackageDetails): Promise<Uint8Array> {
  const { PDFDocument } = await import('pdf-lib');
  let sourceDocument: PDFDocumentType;
  try { sourceDocument = await PDFDocument.load(source); }
  catch (error) { throw readablePdfError(error); }
  if (sourceDocument.isEncrypted) throw new Error(PDF_PASSWORD_ERROR);

  let pageIndices: number[];
  try {
    pageIndices = sourceDocument.getPageIndices();
    if (pageIndices.length === 0) throw new Error('PDF has no pages.');
  } catch (error) { throw readablePdfError(error); }

  const cover = await coverPng(details);
  try {
    const output = await PDFDocument.create();
    output.setTitle(`Invoice relationship — ${details.reference}`);
    output.setSubject(`End client ${details.endClient}; billed to ${details.billingClient}`);
    output.setProducer('Performed For — local-first PWA');
    const page = output.addPage([595.28, 841.89]);
    const image = await output.embedPng(cover);
    page.drawImage(image, { x: 0, y: 0, width: 595.28, height: 841.89 });
    const pages = await output.copyPages(sourceDocument, pageIndices);
    pages.forEach((invoicePage) => output.addPage(invoicePage));
    return await output.save();
  } catch (error) { throw readablePdfError(error); }
}
