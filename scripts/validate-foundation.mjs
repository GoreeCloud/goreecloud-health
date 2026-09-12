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
  'contracts/activity-active-time.schema.json',
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
  'contracts/examples/activity-active-time.synthetic.json',
  'contracts/examples/activity-intensity.synthetic.json',
  'contracts/examples/exercise-session.synthetic.json',
  'contracts/examples/exercise-session-classified.synthetic.json',
  'contracts/examples/sleep-session.synthetic.json',
  'contracts/examples/sleep-session-staged.synthetic.json',
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
  [readme.includes('source classification'), 'README must record the exercise source-classification boundary'],
  [readme.includes('source-supported stage intervals'), 'README must record the optional sleep-stage boundary'],
  [features.includes('Not implemented yet'), 'FEATURES must distinguish current and planned functionality'],
  [features.includes('Synthetic-only fixtures for all ten currently supported source-contract types'), 'FEATURES must identify all current fixtures as synthetic-only'],
  [features.includes('unclassified and source-classified exercise examples'), 'FEATURES must record both exercise fixture paths'],
  [features.includes('stage-less and staged sleep examples'), 'FEATURES must record both sleep fixture paths'],
  [features.includes('do **not** authorize or implement real health-data ingestion'), 'FEATURES must preserve the source-contract/runtime boundary'],
  [features.includes('Privacy Shield Application Privacy Manifest v1'), 'FEATURES must record the current Privacy Shield source declaration'],
  [features.includes('health-reconciliation-policy.v1'), 'FEATURES must record the reconciliation policy'],
  [web.includes('Data sources: not connected'), 'Web shell must expose truthful connection state'],
  [web.includes('<dialog'), 'Web shell must include connection-state dialog'],
  [platform.includes("schema_version: '0.2'"), 'Platform Contract schema must be declared'],
  [platform.includes('version: 1.3.0'), 'Current Stable GLAZE UI target must be recorded'],
  [platform.includes('status: nonconformant'), 'Foundation must not claim platform conformance'],
  [platform.includes('privacy_shield:\n    result: applicable-blocked\n    version: null'), 'Privacy Shield must remain blocked until runtime acceptance exists'],
  [recordContract.includes('does not enable Health Connect'), 'Record contract must preserve the no-runtime-ingestion boundary'],
  [recordContract.includes('not data-processing authorization'), 'Record contract must not manufacture privacy authorization'],
  [recordContract.includes('namespaced source classification'), 'Record contract must document exercise source-classification semantics'],
  [recordContract.includes('does not define a GoreeCloud cross-provider exercise taxonomy'), 'Record contract must keep canonical exercise equivalence unclaimed'],
  [recordContract.includes('stage-less sessions remain valid'), 'Record contract must preserve missing sleep-stage data'],
  [recordContract.includes('Cross-source aggregation remains explicitly unauthorized'), 'Record contract must preserve fail-closed cross-source aggregation'],
  [privacy.includes('does **not** authorize real health-data processing'), 'Privacy documentation must preserve the no-processing-authority boundary'],
  [privacy.includes('No Privacy Shield runtime acceptance or health-data processing authority is claimed'), 'Privacy documentation must not overstate acceptance'],
  [reconciliation.includes('"exercise.session"'), 'Reconciliation policy must bind exercise sessions'],
  [reconciliation.includes('"sleep.session"'), 'Reconciliation policy must bind sleep sessions'],
  [!reconciliation.includes('"exercise.type"'), 'Exercise classification must remain nested source detail rather than a separately governed record type'],
  [!reconciliation.includes('"sleep.stage"'), 'Sleep stages must remain nested session data rather than a separately governed record type'],
  [reconciliation.includes('"aggregation": "not-authorized"'), 'Reconciliation policy must keep cross-source aggregation unauthorized'],
  [reconciliation.includes('"conflict_resolution": "not-authorized"'), 'Reconciliation policy must keep cross-source conflict resolution unauthorized']
];

for (const [ok, message] of checks) {
  if (!ok) throw new Error(message);
}

console.log(`Validated GoreeCloud Health foundation: ${required.length} required files and ${checks.length} truth-boundary checks.`);
