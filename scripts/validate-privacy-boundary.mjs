import { readFile } from 'node:fs/promises';

const manifestPath = 'privacy/privacy-shield.application-manifest.json';
const privacyPath = 'docs/PRIVACY.md';
const platformPath = 'goreecloud.platform.yaml';

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const privacy = await readFile(privacyPath, 'utf8');
const platform = await readFile(platformPath, 'utf8');

const fail = (message) => { throw new Error(message); };
const expect = (condition, message) => { if (!condition) fail(message); };
const exactKeys = (value, keys, context) => {
  expect(value && typeof value === 'object' && !Array.isArray(value), `${context} must be an object`);
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  expect(JSON.stringify(actual) === JSON.stringify(expected), `${context} keys must remain fail-closed: ${expected.join(', ')}`);
};

exactKeys(manifest, ['manifest_version', 'application_id', 'display_name', 'purposes', 'resources'], 'Privacy Shield application manifest');
expect(manifest.manifest_version === 1, 'Privacy Shield application manifest version must remain 1');
expect(manifest.application_id === 'goreecloud-health', 'Privacy Shield application_id must remain goreecloud-health');
expect(manifest.display_name === 'GoreeCloud Health', 'Privacy Shield display_name must remain GoreeCloud Health');
expect(Array.isArray(manifest.purposes) && manifest.purposes.length === 0, 'Foundation Privacy Shield purposes must remain empty until separately governed');
expect(Array.isArray(manifest.resources) && manifest.resources.length === 0, 'Foundation Privacy Shield resources must remain empty until separately governed');

expect(privacy.includes('https://goreecloud.dev/schemas/privacy-shield/application-manifest/v1'), 'Privacy documentation must identify the adopted Privacy Shield application-manifest contract');
expect(privacy.includes('does **not** authorize real health-data processing'), 'Privacy documentation must preserve the no-processing-authority boundary');
expect(privacy.includes('`purposes` and `resources` are both empty'), 'Privacy documentation must explain the fail-closed manifest state');

expect(platform.includes('privacy_shield:\n    result: applicable-blocked\n    version: null'), 'Platform contract must keep Privacy Shield blocked and unversioned until accepted runtime integration exists');
expect(platform.includes('privacy/privacy-shield.application-manifest.json'), 'Platform contract must reference the source-level Privacy Shield manifest evidence');
expect(platform.includes('Source-level application manifest is fail-closed with no declared purposes or resources'), 'Platform contract must preserve the manifest/runtime acceptance distinction');

console.log('Validated GoreeCloud Health Privacy Shield source boundary: application manifest v1 with zero purposes, zero resources, and no runtime health-data authority.');
