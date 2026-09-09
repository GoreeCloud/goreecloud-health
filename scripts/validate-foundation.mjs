import { readFile, access } from 'node:fs/promises';

const required = [
  'README.md', 'SPECIFICATIONS.md', 'FEATURES.md', 'FEATURE-ROADMAP.md',
  'BENEFITS.md', 'COMPETITIVE-OBJECTIVES.md', 'BRANDING.md', 'USER-MANUAL.md',
  'SECURITY.md', '.gitignore', '.editorconfig', 'goreecloud.platform.yaml',
  'apps/web/index.html', 'apps/web/app.css', 'apps/web/app.js',
  'apps/android/app/src/main/AndroidManifest.xml',
  'apps/android/app/src/main/java/com/goreecloud/health/MainActivity.kt'
];

for (const path of required) await access(path);

const readme = await readFile('README.md', 'utf8');
const features = await readFile('FEATURES.md', 'utf8');
const web = await readFile('apps/web/index.html', 'utf8');
const platform = await readFile('goreecloud.platform.yaml', 'utf8');

const checks = [
  [readme.includes('does **not** currently collect real health data'), 'README must preserve the no-real-health-data boundary'],
  [features.includes('Not implemented yet'), 'FEATURES must distinguish current and planned functionality'],
  [web.includes('Data sources: not connected'), 'Web shell must expose truthful connection state'],
  [web.includes('<dialog'), 'Web shell must include connection-state dialog'],
  [platform.includes("schema_version: '0.2'"), 'Platform Contract schema must be declared'],
  [platform.includes('version: 1.3.0'), 'Current Stable GLAZE UI target must be recorded'],
  [platform.includes('status: nonconformant'), 'Foundation must not claim platform conformance']
];

for (const [ok, message] of checks) {
  if (!ok) throw new Error(message);
}

console.log(`Validated GoreeCloud Health foundation: ${required.length} required files and ${checks.length} truth-boundary checks.`);
