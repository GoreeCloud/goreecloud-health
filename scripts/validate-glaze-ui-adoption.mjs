import { readFile } from 'node:fs/promises';

const expectedVersion = '1.3.0';
const expectedRevision = '8354308445da9ac35ced2b37a7f503a08a0aaf72';
const stableEntry = '../../vendor/glaze-ui/css/glaze-v1.3.0.css';

const [gitmodules, html, css, appJs, adoption, glazeVersion, glazeEntry] = await Promise.all([
  readFile('.gitmodules', 'utf8'),
  readFile('apps/web/index.html', 'utf8'),
  readFile('apps/web/app.css', 'utf8'),
  readFile('apps/web/app.js', 'utf8'),
  readFile('docs/GLAZE-UI-ADOPTION.md', 'utf8'),
  readFile('vendor/glaze-ui/VERSION', 'utf8'),
  readFile('vendor/glaze-ui/css/glaze-v1.3.0.css', 'utf8')
]);

const checks = [];
const expect = (condition, message) => {
  checks.push(message);
  if (!condition) throw new Error(message);
};

expect(gitmodules.includes('path = vendor/glaze-ui'), 'Glaze UI must remain a repository-pinned submodule');
expect(gitmodules.includes('https://github.com/GoreeCloud/goreecloud-glaze-ui.git'), 'Glaze submodule must point to the canonical GoreeCloud repository');
expect(glazeVersion.trim() === expectedVersion, `Pinned Glaze VERSION must be ${expectedVersion}`);
expect(glazeEntry.includes('official Stable web entrypoint'), 'Pinned Glaze stylesheet must be the official Stable entrypoint');

const stableLink = `href="${stableEntry}"`;
const stableIndex = html.indexOf(stableLink);
const appCssIndex = html.indexOf('href="app.css"');
expect(stableIndex >= 0, 'Health web shell must load the pinned Glaze V1.3 Stable stylesheet');
expect(appCssIndex > stableIndex, 'Health-specific composition CSS must load after the canonical Glaze stylesheet');
expect(!/https?:\/\/(?:raw\.githubusercontent\.com|cdn\.jsdelivr\.net|unpkg\.com)/i.test(html), 'Web shell must not replace the pinned first-party Glaze source with an external CDN stylesheet');
expect(/class="[^"]*\bglz1-workspace\b/.test(html), 'Health web shell must use the Glaze workspace foundation');
expect(/class="[^"]*\bglz1-button\b/.test(html), 'Health web controls must consume Glaze button components');
expect(/class="[^"]*\bglz1-capsule\b/.test(html), 'Health web navigation/status surfaces must consume Glaze capsule components');
expect(/class="[^"]*\bglz1-raised\b/.test(html), 'Health cards must consume Glaze raised surfaces');
expect(html.includes('tabindex="-1"'), 'Main Health panel target must remain programmatically focusable');
expect(html.includes('V1.3.0 source pinned · acceptance pending'), 'UI must expose the truthful pending Glaze acceptance state');

expect(css.includes('var(--glz1-canvas)'), 'Health composition must consume Glaze canvas token');
expect(css.includes('var(--glz1-text-primary)'), 'Health composition must consume Glaze primary text token');
expect(css.includes('var(--glz1-radius-soft)'), 'Health composition must consume Glaze radius tokens');
expect(css.includes('var(--glz1-focus)'), 'Health composition must consume Glaze focus token');
expect(!/^\s*--glz1-[A-Za-z0-9-]+\s*:/m.test(css), 'Health composition must not redefine canonical Glaze tokens');

expect(appJs.includes('panelFromLocation'), 'Web navigation must preserve URL-addressable panel state');
expect(appJs.includes('main.focus'), 'Web navigation must restore main-content focus after a view change');
expect(adoption.includes('adoption required / unaccepted'), 'Adoption documentation must remain fail-closed');
expect(adoption.includes(expectedRevision), 'Adoption documentation must identify the exact pinned Glaze source revision');
expect(adoption.includes('does **not** establish GLAZE UI V1.3 consumer acceptance'), 'Source integration must not be documented as consumer acceptance');

console.log(`Validated GoreeCloud Health Glaze UI migration source: ${checks.length} fail-closed checks against ${expectedVersion} / ${expectedRevision}.`);
