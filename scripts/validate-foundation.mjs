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
  'contracts/activity-active-energy.schema.json',
  'contracts/activity-intensity.schema.json',
  'contracts/exercise-session.schema.json',
  'contracts/sleep-session.schema.json',
  'contracts/heart-rate.schema.json',
  'contracts/body-weight.schema.json',
  'contracts/hydration-water.schema.json',
  'contracts/health-reconciliation-policy.v1.json',
  'contracts/examples/activity-steps.synthetic.json',
  'contracts/examples/activity-distance.synthetic.json',
  'contracts/examples/activity-active-energy.synthetic.json',
  'contracts/examples/activity-intensity.synthetic.json',
  'contracts/examples/exercise-session.synthetic.json',
  'contracts/examples/sleep-session.synthetic.json',
  'contracts/examples/heart-rate.synthetic.json',
  'contracts/examples/body-weight.synthetic.json',
  'contracts/examples/hydration-water.synthetic.json',
  'privacy/privacy-shield.application-manifest.json',
  'docs/HEALTH-RECORD-CONTRACT.md',
  'docs/PRIVACY.md',
  'scripts/validate-health-record-contract.mjs',
  'scripts/validate-privacy-boundary.mjs'
];

for (const path of required) await access(path);

const readme = await readFile('README.md', 'utf8');
const features = await readFile('FEATURES.md', 'utf8');
const web = await readFile('apps/web/index.html', 'utf8');
const platform = await readFile('goreecloud.platform.yaml', 'utf8');
const recordContract = await readFile('docs/HEALTH-RECORD-CONTRACT.md', 'utf8');
const privacy = await readFile('docs/PRIVACY.md', 'utf8');
const reconciliation = await readFile('contracts/health-reconciliation-policy.v1.json', 'utf8');

const checks = [
  [readme.includes('does **not** currently collect real health data'), 'README must preserve the no-real-health-data boundary'],
  [readme.includes('empty `purposes` and `resources`'), 'README must describe the fail-closed Privacy Shield source manifest'],
  [readme.includes('health-reconciliation-policy.v1'), 'README must record the machine-readable reconciliation policy'],
  [readme.includes('activity.active-energy'), 'README must record the active-energy source contract'],
  [readme.includes('activity.intensity'), 'README must record the activity-intensity source contract'],
  [features.includes('Not implemented yet'), 'FEATURES must distinguish current and planned functionality'],
  [features.includes('Synthetic-only fixtures for all nine currently supported source-contract types'), 'FEATURES must identify all current fixtures as synthetic-only'],
  [features.includes('do **not** authorize or implement real health-data ingestion'), 'FEATURES must preserve the source-contract/runtime boundary'],
  [features.includes('Privacy Shield Application Privacy Manifest v1'), 'FEATURES must record the current Privacy Shield source declaration'],
  [features.includes('health-reconciliation-policy.v1'), 'FEATURES must record the reconciliation policy'],
  [features.includes('activity.active-energy'), 'FEATURES must record the active-energy source contract'],
  [features.includes('activity.intensity'), 'FEATURES must record the activity-intensity source contract'],
  [web.includes('Data sources: not connected'), 'Web shell must expose truthful connection state'],
  [web.includes('<dialog'), 'Web shell must include connection-state dialog'],
  [platform.includes("schema_version: '0.2'"), 'Platform Contract schema must be declared'],
  [platform.includes('version: 1.3.0'), 'Current Stable GLAZE UI target must be recorded'],
  [platform.includes('status: nonconformant'), 'Foundation must not claim platform conformance'],
  [platform.includes('privacy_shield:\n    result: applicable-blocked\n    version: null'), 'Privacy Shield must remain blocked until runtime acceptance exists'],
  [recordContract.includes('does not enable Health Connect'), 'Record contract must preserve the no-runtime-ingestion boundary'],
  [recordContract.includes('not data-processing authorization'), 'Record contract must not manufacture privacy authorization'],
  [recordContract.includes('health-reconciliation-policy.v1.json'), 'Record contract must document the machine-readable reconciliation policy'],
  [recordContract.includes('Cross-source aggregation remains explicitly unauthorized'), 'Record contract must preserve fail-closed cross-source aggregation'],
  [recordContract.includes('activity.active-energy'), 'Record contract must document the active-energy boundary'],
  [recordContract.includes('activity.intensity'), 'Record contract must document the activity-intensity boundary'],
  [recordContract.includes('exercise.session'), 'Record contract must document the exercise-session boundary'],
  [recordContract.includes('sleep.session'), 'Record contract must document the sleep-session boundary'],
  [recordContract.includes('heart.rate'), 'Record contract must document the heart-rate boundary'],
  [recordContract.includes('body.weight'), 'Record contract must document the body-weight boundary'],
  [recordContract.includes('hydration.water'), 'Record contract must document the hydration boundary'],
  [privacy.includes('does **not** authorize real health-data processing'), 'Privacy documentation must preserve the no-processing-authority boundary'],
  [privacy.includes('No Privacy Shield runtime acceptance or health-data processing authority is claimed'), 'Privacy documentation must not overstate acceptance'],
  [reconciliation.includes('"activity.active-energy"'), 'Reconciliation policy must bind the active-energy type'],
  [reconciliation.includes('"activity.intensity"'), 'Reconciliation policy must bind the activity-intensity type'],
  [reconciliation.includes('"aggregation": "not-authorized"'), 'Reconciliation policy must keep cross-source aggregation unauthorized'],
  [reconciliation.includes('"conflict_resolution": "not-authorized"'), 'Reconciliation policy must keep cross-source conflict resolution unauthorized']
];

for (const [ok, message] of checks) {
  if (!ok) throw new Error(message);
}

console.log(`Validated GoreeCloud Health foundation: ${required.length} required files and ${checks.length} truth-boundary checks.`);
