export interface LicenseState {
  unlocked: boolean;
  checking: boolean;
  notice: string;
}

interface CachedVerdict {
  valid: boolean;
  checkedAt: number;
}

const SLUG = 'end-client-reference';
const LICENSE_KEY = `sb_license:${SLUG}`;
const VERDICT_KEY = `${LICENSE_KEY}:verdict`;
const DAY = 86_400_000;
// Public builds must always use the production merchant endpoint. Staging can
// still override this explicitly during a pre-release deployment.
export const BILLING_BASE = import.meta.env.VITE_BILLING_BASE || 'https://api.sociobot.in/api/v1';
export const LICENSE_PRICE = import.meta.env.VITE_LICENSE_PRICE || '$19';
export const BUY_URL = `${BILLING_BASE}/products/${SLUG}/checkout`;

function readCache(): CachedVerdict | null {
  try { return JSON.parse(localStorage.getItem(VERDICT_KEY) ?? 'null') as CachedVerdict | null; }
  catch { return null; }
}

export function captureReturnedLicense(): void {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return;
  localStorage.setItem(LICENSE_KEY, token);
  localStorage.removeItem(VERDICT_KEY);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function saveLicense(token: string): void {
  localStorage.setItem(LICENSE_KEY, token.trim());
  localStorage.removeItem(VERDICT_KEY);
}

export function initialLicenseState(): LicenseState {
  const token = localStorage.getItem(LICENSE_KEY);
  const cache = readCache();
  return {
    unlocked: Boolean(token && cache?.valid),
    checking: Boolean(token),
    notice: '',
  };
}

export async function verifyLicense(force = false): Promise<LicenseState> {
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) return { unlocked: false, checking: false, notice: '' };
  const cached = readCache();
  if (!force && cached && Date.now() - cached.checkedAt < DAY) {
    return { unlocked: cached.valid, checking: false, notice: cached.valid ? '' : 'License no longer active.' };
  }
  try {
    const response = await fetch(`${BILLING_BASE}/products/${SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('Verification unavailable');
    const verdict = await response.json() as { valid: boolean };
    localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: verdict.valid, checkedAt: Date.now() }));
    return { unlocked: verdict.valid, checking: false, notice: verdict.valid ? '' : 'License no longer active.' };
  } catch {
    return {
      unlocked: Boolean(cached?.valid), checking: false,
      notice: cached?.valid ? 'Offline — using the last verified license.' : 'Could not verify this license. Check your connection and try again.'
    };
  }
}
