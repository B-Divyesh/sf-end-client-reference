import { importRecords, listRecords, putRecord, removeRecord } from './db';
import { downloadBlob, recordsToCsv, safeFilename } from './export';
import { buildInvoicePackage } from './pdf';
import {
  BUY_URL, LICENSE_PRICE, captureReturnedLicense, initialLicenseState,
  saveLicense, verifyLicense, type LicenseState
} from './license';
import type { PackageDetails, RelationshipRecord } from './types';

const FREE_LIMIT = 3;
const USAGE_KEY = 'pf_generation_count';
const appRoot = document.querySelector<HTMLDivElement>('#app');
if (!appRoot) throw new Error('App root not found.');
const app: HTMLDivElement = appRoot;

const esc = (value: string): string => value.replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
})[character] ?? character);

function shell(content: string): string {
  return `<header class="site-header">
    <a class="brand" href="/">
      <img src="/icons/icon.svg" width="44" height="44" alt="" />
      <span><strong>Performed For</strong><small>Invoice route sheets</small></span>
    </a>
    <nav aria-label="Primary"><a href="/">Workspace</a><a href="/#records">Relationship log</a></nav>
  </header>${content}
  <footer><p>Private by design. No analytics. No cloud document storage.</p><p><a href="/privacy">Privacy</a><a href="/terms">Terms</a> · Illustration generated for this product.</p></footer>
  <div class="toast" id="toast" role="status" aria-live="polite" hidden></div>`;
}

function renderLegal(kind: 'privacy' | 'terms'): void {
  const privacy = `<main id="main" class="legal"><p class="eyebrow">Field notes · effective 28 August 2026</p><h1>Privacy, kept local</h1>
    <p>Performed For is designed so your invoices and relationship details stay on your device.</p>
    <h2>What the app stores</h2><p>Billing clients, end clients, references, optional invoice metadata, source filenames, and dates are stored in your browser’s IndexedDB. Your attached invoice PDF is read in memory to make the download and is not retained. License tokens and a generation count are stored in localStorage.</p>
    <h2>What leaves your device</h2><p>Nothing during ordinary cover generation. When you buy or verify an unlock, your browser connects to the Sociobot billing API and sends the license token for verification. Checkout is hosted by Sociobot/Dodo, the merchant of record. We run no behavioral analytics or advertising trackers.</p>
    <h2>Your controls</h2><p>Use Backup JSON and Export CSV to take your data with you. Delete individual entries in the relationship log. Clearing this site’s browser data removes all locally stored records and the license token from this device.</p>
    <h2>Contact</h2><p>Privacy questions can be sent to <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p></main>`;
  const terms = `<main id="main" class="legal"><p class="eyebrow">Route conditions · effective 28 August 2026</p><h1>Terms of use</h1>
    <p>Performed For creates a companion cover page from details you supply and combines it with an existing PDF. It does not issue invoices, provide accounting or legal advice, or change who owes payment.</p>
    <h2>Your responsibility</h2><p>You must have permission to process the invoice and client details you enter. Review every generated package before sending it. The billing client remains the payer; naming an end client never makes that end client liable.</p>
    <h2>One-time unlock</h2><p>The ${esc(LICENSE_PRICE)} one-time purchase unlocks unlimited package generation and reusable relationship recall for this product. Sociobot/Dodo is the merchant of record. Checkout, receipts, taxes, and refunds are handled there. A refunded or revoked purchase deactivates its license. You can restore an active license on another device.</p>
    <h2>Availability and warranty</h2><p>The software is provided “as is” without warranties. Keep your own copies of invoices, downloads, and data backups. We may update the app for security or compatibility while preserving the core local-first workflow.</p>
    <h2>Contact</h2><p>Questions can be sent to <a href="mailto:support@sociobot.in">support@sociobot.in</a>.</p></main>`;
  app.innerHTML = shell(kind === 'privacy' ? privacy : terms);
}

function toast(message: string, tone: 'normal' | 'error' = 'normal'): void {
  const element = document.querySelector<HTMLDivElement>('#toast');
  if (!element) return;
  element.textContent = message;
  element.dataset.tone = tone;
  element.hidden = false;
  window.setTimeout(() => { element.hidden = true; }, 5_000);
}

function recordRows(records: RelationshipRecord[]): string {
  if (!records.length) return `<div class="empty-state"><span aria-hidden="true">◎</span><h3>No routes logged yet</h3><p>Your first generated package will add its relationship here. Only metadata is saved—never the invoice PDF.</p></div>`;
  return `<div class="table-scroll" tabindex="0" aria-label="Scrollable relationship records"><table>
    <thead><tr><th>Date</th><th>Billing client</th><th>Performed for</th><th>Reference</th><th><span class="sr-only">Actions</span></th></tr></thead>
    <tbody>${records.map((record) => `<tr>
      <td><time datetime="${record.createdAt}">${new Date(record.createdAt).toLocaleDateString()}</time></td>
      <td>${esc(record.billingClient)}</td><td>${esc(record.endClient)}</td><td>${esc(record.reference)}</td>
      <td><button class="text-button delete-record" data-id="${esc(record.id)}" data-name="${esc(record.reference)}">Delete <span class="sr-only">${esc(record.reference)}</span></button></td>
    </tr>`).join('')}</tbody></table></div>`;
}

function updateLicenseUi(state: LicenseState): void {
  const badge = document.querySelector('#license-badge');
  const notice = document.querySelector('#license-notice');
  const generate = document.querySelector<HTMLButtonElement>('#generate');
  if (badge) badge.textContent = state.unlocked ? 'Trail pass active · unlimited' : state.checking ? 'Checking trail pass…' : `${Math.max(0, FREE_LIMIT - Number(localStorage.getItem(USAGE_KEY) || 0))} free packages left`;
  if (notice) notice.textContent = state.notice;
  if (generate) generate.dataset.unlocked = String(state.unlocked);
  document.body.dataset.unlocked = String(state.unlocked);
}

async function renderWorkspace(): Promise<void> {
  captureReturnedLicense();
  let records: RelationshipRecord[] = [];
  let storageError = '';
  try { records = await listRecords(); }
  catch { storageError = 'Local storage is unavailable. You can still generate a package, but the relationship log will not be saved.'; }
  const initialLicense = initialLicenseState();
  const suggestions = initialLicense.unlocked ? [...new Set(records.map((record) => record.billingClient))] : [];
  const endSuggestions = initialLicense.unlocked ? [...new Set(records.map((record) => record.endClient))] : [];

  app.innerHTML = shell(`<main id="main">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy"><p class="eyebrow">Payer → beneficiary → engagement</p><h1 id="hero-title">Make the end client unmistakable.</h1>
        <p class="lede">Add a precise relationship cover to any invoice PDF—without moving client details into another cloud.</p>
        <ul class="trust-list"><li>Runs on your device</li><li>Keeps the original invoice intact</li><li>Works offline after first visit</li></ul>
      </div>
      <picture><source media="(max-width: 700px)" srcset="/art/topography-768.webp"><img src="/art/topography-1200.webp" srcset="/art/topography-768.webp 768w, /art/topography-1200.webp 1200w" sizes="(max-width: 700px) 100vw, 44vw" width="1200" height="800" alt="Layered paper topography showing one coral route between two separate mapped areas" fetchpriority="high" decoding="async"></picture>
    </section>

    <section class="workspace" aria-labelledby="workspace-title">
      <div class="section-heading"><div><p class="eyebrow">Route desk</p><h2 id="workspace-title">Prepare a package</h2></div><span class="status-chip" id="license-badge"></span></div>
      <ol class="route-steps" aria-label="Package steps"><li><span>1</span>Invoice PDF</li><li><span>2</span>Relationship</li><li><span>3</span>Download</li></ol>
      ${storageError ? `<p class="notice error" role="alert">${storageError}</p>` : ''}
      <p class="notice offline-notice" id="offline-notice" hidden><strong>Offline.</strong> The workspace and your records still work; license checks will resume when connected.</p>
      <form id="package-form" novalidate>
        <fieldset><legend><span>01</span> Source invoice</legend>
          <label class="file-drop" for="invoice-file"><strong>Choose the existing invoice PDF</strong><span id="file-help">PDF only · up to 25 MB · read locally, never retained</span><input id="invoice-file" name="invoice" type="file" accept="application/pdf,.pdf" aria-describedby="file-help file-error" required><span class="file-name" id="file-name">No file selected</span></label>
          <p class="field-error" id="file-error" aria-live="polite"></p>
        </fieldset>
        <fieldset><legend><span>02</span> Relationship</legend>
          <div class="field-grid">
            <label>Billing client <small>The company responsible for payment</small><input name="billingClient" autocomplete="organization" list="billing-clients" maxlength="180" required></label>
            <label>Services performed for <small>The ultimate customer; not the payer</small><input name="endClient" autocomplete="off" list="end-clients" maxlength="180" required></label>
            <label class="full">Project / PO reference <small>Preserved exactly as entered</small><input name="reference" autocomplete="off" maxlength="220" required></label>
            <label>Invoice number <small>Optional</small><input name="invoiceNumber" autocomplete="off" maxlength="100"></label>
            <label>Service period <small>Optional, in your preferred format</small><input name="servicePeriod" autocomplete="off" maxlength="100"></label>
          </div>
          <datalist id="billing-clients">${suggestions.map((value) => `<option value="${esc(value)}"></option>`).join('')}</datalist>
          <datalist id="end-clients">${endSuggestions.map((value) => `<option value="${esc(value)}"></option>`).join('')}</datalist>
          <p class="field-error" id="form-error" role="alert" aria-live="assertive"></p>
        </fieldset>
        <div class="package-action"><div><strong>Your output</strong><p>One cover page followed by every page of the original invoice.</p></div><button class="primary" id="generate" type="submit">Generate package</button></div>
      </form>
    </section>

    <section class="license-panel" aria-labelledby="license-title"><div><p class="eyebrow">One-time trail pass</p><h2 id="license-title">Keep every route open.</h2><p>Three packages are free. Pay ${esc(LICENSE_PRICE)} once for unlimited packages and relationship recall on this device—or restore your license anywhere.</p><p class="license-notice" id="license-notice" aria-live="polite"></p></div>
      <div class="license-actions"><a class="primary link-button" href="${BUY_URL}">Buy the one-time unlock</a><details><summary>Have a license?</summary><form id="restore-form"><label for="license-token">Paste license token</label><div class="inline-field"><input id="license-token" autocomplete="off" required><button type="submit">Verify license</button></div></form></details></div>
    </section>

    <section class="records" id="records" aria-labelledby="records-title"><div class="section-heading"><div><p class="eyebrow">Local field book</p><h2 id="records-title">Relationship log</h2></div><div class="record-actions"><button id="export-csv" type="button">Export CSV</button><button id="backup-json" type="button">Backup JSON</button><label class="button-label" for="import-json">Import JSON</label><input id="import-json" class="sr-only" type="file" accept="application/json,.json"></div></div><div id="record-list">${recordRows(records)}</div></section>
  </main>`);

  let selectedFile: File | null = null;
  let licenseState = initialLicense;
  updateLicenseUi(licenseState);
  const updateSuggestions = (): void => {
    if (!licenseState.unlocked) return;
    const billingList = document.querySelector('#billing-clients');
    const endList = document.querySelector('#end-clients');
    if (billingList) billingList.innerHTML = [...new Set(records.map((record) => record.billingClient))].map((value) => `<option value="${esc(value)}"></option>`).join('');
    if (endList) endList.innerHTML = [...new Set(records.map((record) => record.endClient))].map((value) => `<option value="${esc(value)}"></option>`).join('');
  };
  verifyLicense().then((state) => { licenseState = state; updateLicenseUi(state); updateSuggestions(); });

  const offlineNotice = document.querySelector<HTMLElement>('#offline-notice');
  const updateConnection = () => { if (offlineNotice) offlineNotice.hidden = navigator.onLine; };
  updateConnection();
  addEventListener('online', updateConnection); addEventListener('offline', updateConnection);

  const fileInput = document.querySelector<HTMLInputElement>('#invoice-file');
  fileInput?.addEventListener('change', () => {
    selectedFile = fileInput.files?.[0] ?? null;
    const name = document.querySelector('#file-name');
    const error = document.querySelector('#file-error');
    if (name) name.textContent = selectedFile ? selectedFile.name : 'No file selected';
    if (error) error.textContent = '';
  });

  const form = document.querySelector<HTMLFormElement>('#package-form');
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formError = document.querySelector('#form-error');
    const fileError = document.querySelector('#file-error');
    if (formError) formError.textContent = '';
    if (fileError) fileError.textContent = '';
    if (!form.reportValidity()) return;
    if (!selectedFile) { if (fileError) fileError.textContent = 'Choose the invoice PDF to continue.'; fileInput?.focus(); return; }
    if (selectedFile.size > 25 * 1024 * 1024) { if (fileError) fileError.textContent = 'This PDF is over 25 MB. Choose a smaller copy.'; return; }
    const signature = new TextDecoder().decode(await selectedFile.slice(0, 5).arrayBuffer());
    if (signature !== '%PDF-') { if (fileError) fileError.textContent = 'This does not appear to be a PDF. Choose the original invoice PDF.'; return; }
    const used = Number(localStorage.getItem(USAGE_KEY) || 0);
    if (!licenseState.unlocked && used >= FREE_LIMIT) { if (formError) formError.textContent = `You’ve used the ${FREE_LIMIT} free packages. Restore or buy the one-time unlock to keep generating.`; document.querySelector('#license-title')?.scrollIntoView({ behavior: 'smooth' }); return; }

    const button = document.querySelector<HTMLButtonElement>('#generate');
    if (button) { button.disabled = true; button.textContent = 'Drawing cover…'; }
    const values = new FormData(form);
    const details: PackageDetails = {
      billingClient: String(values.get('billingClient') ?? ''), endClient: String(values.get('endClient') ?? ''),
      reference: String(values.get('reference') ?? ''), invoiceNumber: String(values.get('invoiceNumber') ?? ''),
      servicePeriod: String(values.get('servicePeriod') ?? ''), sourceFileName: selectedFile.name,
    };
    try {
      const bytes = await buildInvoicePackage(await selectedFile.arrayBuffer(), details);
      const invoiceLabel = details.invoiceNumber || details.reference;
      downloadBlob(new Blob([bytes as BlobPart], { type: 'application/pdf' }), `${safeFilename(invoiceLabel)}-performed-for.pdf`);
      const record: RelationshipRecord = { ...details, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
      try { await putRecord(record); records = await listRecords(); refreshRecords(records); }
      catch { toast('Package downloaded, but its relationship could not be added to local storage.', 'error'); }
      if (!licenseState.unlocked) localStorage.setItem(USAGE_KEY, String(used + 1));
      updateLicenseUi(licenseState);
      toast('Package ready. The cover and original invoice were downloaded together.');
    } catch (error) {
      if (formError) formError.textContent = error instanceof Error ? error.message : 'The package could not be generated. Try the original invoice file.';
    } finally { if (button) { button.disabled = false; button.textContent = 'Generate package'; } }
  });

  function refreshRecords(next: RelationshipRecord[]): void {
    const list = document.querySelector('#record-list');
    if (list) list.innerHTML = recordRows(next);
    updateSuggestions();
    bindDelete();
  }
  function bindDelete(): void {
    document.querySelectorAll<HTMLButtonElement>('.delete-record').forEach((button) => button.addEventListener('click', async () => {
      if (!confirm(`Delete the relationship record “${button.dataset.name ?? ''}”? This cannot be undone.`)) return;
      await removeRecord(button.dataset.id ?? ''); records = await listRecords(); refreshRecords(records); toast('Relationship record deleted.');
    }));
  }
  bindDelete();

  document.querySelector('#export-csv')?.addEventListener('click', () => {
    if (!records.length) { toast('There are no relationship records to export.', 'error'); return; }
    downloadBlob(new Blob([recordsToCsv(records)], { type: 'text/csv;charset=utf-8' }), 'performed-for-relationships.csv');
  });
  document.querySelector('#backup-json')?.addEventListener('click', () => {
    downloadBlob(new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), records }, null, 2)], { type: 'application/json' }), 'performed-for-backup.json');
  });
  document.querySelector<HTMLInputElement>('#import-json')?.addEventListener('change', async (event) => {
    const input = event.currentTarget as HTMLInputElement; const file = input.files?.[0]; if (!file) return;
    try {
      const data = JSON.parse(await file.text()) as { records?: RelationshipRecord[] };
      if (!Array.isArray(data.records) || data.records.some((record) => !record.id || !record.billingClient || !record.endClient || !record.reference || !record.createdAt)) throw new Error();
      await importRecords(data.records); records = await listRecords(); refreshRecords(records); toast(`${data.records.length} relationship record${data.records.length === 1 ? '' : 's'} imported.`);
    } catch { toast('That file is not a valid Performed For backup.', 'error'); }
    input.value = '';
  });
  document.querySelector<HTMLFormElement>('#restore-form')?.addEventListener('submit', async (event) => {
    event.preventDefault(); const input = document.querySelector<HTMLInputElement>('#license-token'); if (!input?.value.trim()) return;
    saveLicense(input.value); licenseState = { unlocked: false, checking: true, notice: 'Checking license…' }; updateLicenseUi(licenseState);
    licenseState = await verifyLicense(true); updateLicenseUi(licenseState); updateSuggestions(); if (licenseState.unlocked) toast('Trail pass restored. Unlimited packages are active.');
  });
}

export async function startApp(): Promise<void> {
  if (location.pathname === '/privacy' || location.pathname === '/privacy/') renderLegal('privacy');
  else if (location.pathname === '/terms' || location.pathname === '/terms/') renderLegal('terms');
  else await renderWorkspace();
}
