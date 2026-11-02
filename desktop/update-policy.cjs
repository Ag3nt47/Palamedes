const path = require('node:path');
const DAY_MS = 24 * 60 * 60 * 1000;

function shouldCheck(lastAttemptAt, now = Date.now(), manual = false) {
  if (!Number.isFinite(now) || now < 0) return false;
  if (manual) return true;
  if (lastAttemptAt === null || lastAttemptAt === undefined) return true;
  if (!Number.isFinite(lastAttemptAt) || lastAttemptAt < 0) return true;
  return now - lastAttemptAt >= DAY_MS;
}

function initialState() { return { status: 'idle', approved: false, downloaded: false }; }

function updateCapability({ platform, appImagePath, signedMacUpdates = false }) {
  if (platform === 'win32') return { automatic: true };
  if (platform === 'linux' && appImagePath) return { automatic: true };
  if (platform === 'darwin' && signedMacUpdates) return { automatic: true };
  if (platform === 'darwin') return { automatic: false, message: 'This macOS release is unsigned, so in-app installation is disabled. Download the newest DMG or ZIP from GitHub Releases. Automatic macOS updates require a code-signed release.' };
  if (platform === 'linux') return { automatic: false, message: 'Update this Linux package through your package manager or install a newer DEB from GitHub Releases. In-app updates are supported when running the AppImage edition.' };
  return { automatic: false, message: 'Download a supported desktop package from GitHub Releases or use the browser app.' };
}

/** There is deliberately no transition from available/downloaded straight to
 * installation without the approval recorded in this process/session. */
function transition(current, event) {
  const state = { ...current };
  if (event === 'check') return { status: 'checking', approved: false, downloaded: false };
  if (event === 'cancel' || event === 'error' || event === 'reject') return { status: event === 'error' ? 'error' : 'cancelled', approved: false, downloaded: false };
  if (event === 'not-available' && state.status === 'checking') return { status: 'up-to-date', approved: false, downloaded: false };
  if (event === 'available' && state.status === 'checking') return { status: 'available', approved: false, downloaded: false };
  if (event === 'approve' && state.status === 'available') return { status: 'downloading', approved: true, downloaded: false };
  if (event === 'downloaded' && state.status === 'downloading' && state.approved) return { status: 'downloaded', approved: true, downloaded: true };
  if (event === 'install' && state.status === 'downloaded' && state.approved && state.downloaded) return { status: 'installing', approved: true, downloaded: true };
  throw new Error(`Update action ${event} is not allowed while ${state.status}.`);
}

const EXTERNAL_DOMAINS = ['github.com', 'github.io', 'mathjs.org', 'nerdamer.com', 'katex.org', 'projectnaptha.com', 'hpcalcs.com', 'ti.com', 'casio.com', 'casio-intl.com', 'electronjs.org', 'electron.build', 'nodejs.org', 'openai.com', 'wikipedia.org', 'openstax.org', 'khanacademy.org', 'mit.edu'];
function isTrustedExternalUrl(raw) {
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' && !url.username && !url.password && (!url.port || url.port === '443') && EXTERNAL_DOMAINS.some(domain => url.hostname === domain || url.hostname.endsWith(`.${domain}`));
  } catch { return false; }
}

function resolveAssetPath(root, requestPath) {
  let decoded;
  try { decoded = decodeURIComponent(requestPath.split('?')[0]); } catch { return null; }
  if (!decoded.startsWith('/') || decoded.includes('\0')) return null;
  const target = path.resolve(root, `.${decoded === '/' ? '/index.html' : decoded}`);
  const relative = path.relative(root, target);
  return relative.startsWith('..') || path.isAbsolute(relative) ? null : target;
}

module.exports = { DAY_MS, shouldCheck, initialState, transition, updateCapability, isTrustedExternalUrl, resolveAssetPath };
