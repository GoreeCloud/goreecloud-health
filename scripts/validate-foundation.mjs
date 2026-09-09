import { readFile, access } from 'node:fs/promises';

const required = [
  'README.md', 'SPECIFICATIONS.md', 'FEATURES.md', 'FEATURE-ROADMAP.md',
  'BENEFITS.md', 'COMPETITIVE-OBJECTIVES.md', 'BRANDING.md', 'USER-MANUAL.md',
  'SECURITY.md', '.gitignore', '.editorconfig', 'goreecloud.platform.yaml',
  'apps/web/index.html', 'apps/web/app.css', 'apps/web/app.js',
  'apps/android/app/src/main/AndroidManifest.xml',
  'apps/android/app/src/main/java/com/goreecloud/health/MainActivity.kt',
  'contracts/health-source.schema.json',
  'contracts/health-record-envelope.schema.json',
  'contracts/activity-steps.schema.json',
  'contracts/activity-distance.schema.json',
  'contracts/sleep-session.schema.json',
  'contracts/heart-rate.schema.json',
  'contracts/body-weight.schema.json',
  'contracts/hydration-water.schema.json',
  'contracts/examples/activity-steps.synthetic.json',
  'contracts/examples/activity-distance.synthetic.json',
  'contracts/examples/sleep-session.synthetic.json',
  'contracts/examples/heart-rate.synthetic.json',
  'contracts/examples/body-weight.synthetic.json',
  'contracts/examples/hydration-water.synthetic.json',
  'docs/HEALTH-RECORD-CONTRACT.md',
  'scripts/validate-health-record-contract.mjs'
];

for (const path of required) await access(path);

const readme = await readFile('README.md', 'utf8');
const features = await readFile('FEATURES.md', 'utf8');
const web = await readFile('apps/web/index.html', 'utf8');
const platform = await readFile('goreecloud.platform.yaml', 'utf8');
const recordContract = await readFile('docs/HEALTH-RECORD-CONTRACT.md', 'utf8');

const checks = [
  [readme.includes('does **not** currently collect real health data'), 'README must preserve the no-real-health-data boundary'],
  [features.includes('Not implemented yet'), 'FEATURES must distinguish current and planned functionality'],
  [features.includes('Synthetic-only fixtures for all six currently supported source-contract types'), 'FEATURES must identify all current fixtures as synthetic-only'],
  [features.includes('They do **not** authorize or implement real health-data ingestion'), 'FEATURES must preserve the source-contract/runtime boundary'],
  [web.includes('Data sources: not connected'), 'Web shell must expose truthful connection state'],
  [web.includes('<dialog'), 'Web shell must include connection-state dialog'],
  [platform.includes("schema_version: '0.2'"), 'Platform Contract schema must be declared'],
  [platform.includes('version: 1.3.0'), 'Current Stable GLAZE UI target must be recorded'],
  [platform.includes('status: nonconformant'), 'Foundation must not claim platform conformance'],
  [recordContract.includes('does not enable Health Connect'), 'Record contract must preserve the no-runtime-ingestion boundary'],
  [recordContract.includes('not data-processing authorization'), 'Record contract must not manufacture privacy authorization'],
  [recordContract.includes('sleep.session'), 'Record contract must document the sleep-session boundary'],
  [recordContract.includes('heart.rate'), 'Record contract must document the heart-rate boundary'],
  [recordContract.includes('body.weight'), 'Record contract must document the body-weight boundary'],
  [recordContract.includes('hydration.water'), 'Record contract must document the hydration boundary']
];

for (const [ok, message] of checks) {
  if (!ok) throw new Error(message);
}

console.log(`Validated GoreeCloud Health foundation: ${required.length} required files and ${checks.length} truth-boundary checks.`);
