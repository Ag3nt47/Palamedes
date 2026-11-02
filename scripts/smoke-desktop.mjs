import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { _electron, expect } from '@playwright/test';

const executablePath = path.resolve(process.argv[2] || process.env.PALAMEDES_DESKTOP_EXECUTABLE || '');
if (!(process.argv[2] || process.env.PALAMEDES_DESKTOP_EXECUTABLE) || !existsSync(executablePath)) throw new Error('Pass the built Palamedes executable path to smoke-desktop.mjs.');
const expectedVersion = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8')).version;
const environment = { ...process.env, PALAMEDES_SMOKE_TEST: '1' };
delete environment.ELECTRON_RUN_AS_NODE;

let application, page, operationTimer;
let failure;
const startedAt = Date.now();
const deadline = new Promise((_, reject) => { operationTimer = setTimeout(() => reject(new Error('Packaged desktop smoke test exceeded its 112-second operation deadline.')), 112000); });

try {
  await Promise.race([deadline, (async () => {
    application = await _electron.launch({
      executablePath,
      // GitHub's Linux test process may not have a usable Chromium user namespace.
      // This flag applies only to this CI child; production BrowserWindow sandboxing is unchanged.
      args: process.platform === 'linux' ? ['--no-sandbox'] : [],
      env: environment,
      timeout: 45000,
    });
    page = await application.firstWindow({ timeout: 45000 });
    page.setDefaultTimeout(15000);
    await page.locator('#expression').waitFor({ state: 'visible', timeout: 30000 });
    await page.locator('#expression').fill('12 * 12');
    await page.locator('.calculator-panel .equals-key').click();
    await expect(page.locator('.calculator-panel .calc-result')).toContainText('144', { timeout: 15000 });
    const bridge = await page.evaluate(() => ({
      version: window.palamedesDesktop?.version,
      updateCheck: typeof window.palamedesDesktop?.checkForUpdates,
    }));
    assert.equal(bridge.version, expectedVersion, 'Packaged preload must expose the actual release version.');
    assert.equal(bridge.updateCheck, 'function', 'The narrow desktop bridge must be available.');
    console.log(`Native ${process.platform} smoke passed: Palamedes ${bridge.version}, 12 × 12 = 144 (${Date.now() - startedAt} ms).`);
  })()]);
} catch (error) {
  failure = error;
  console.error(error.stack || String(error));
  if (page && Date.now() - startedAt < 110000) {
    await mkdir('release', { recursive: true });
    await page.screenshot({ path: `release/desktop-smoke-failure-${process.platform}.png`, timeout: 4000 }).catch(() => {});
  }
} finally {
  clearTimeout(operationTimer);
  if (application) {
    let closeTimer;
    try {
      await Promise.race([
        application.close(),
        new Promise((_, reject) => { closeTimer = setTimeout(() => reject(new Error('Desktop did not close within eight seconds.')), 8000); }),
      ]);
    } catch (error) {
      application.process().kill();
      failure ||= error;
    } finally { clearTimeout(closeTimer); }
  }
}
if (failure) process.exitCode = 1;
