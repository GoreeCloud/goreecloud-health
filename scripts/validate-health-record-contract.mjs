import { readFile } from 'node:fs/promises';

const paths = {
  source: 'contracts/health-source.schema.json',
  envelope: 'contracts/health-record-envelope.schema.json',
  steps: 'contracts/activity-steps.schema.json',
  fixture: 'contracts/examples/activity-steps.synthetic.json'
};

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));
const [sourceSchema, envelopeSchema, stepsSchema, fixture] = await Promise.all([
  readJson(paths.source), readJson(paths.envelope), readJson(paths.steps), readJson(paths.fixture)
]);

const fail = (message) => { throw new Error(message); };
const expect = (condition, message) => { if (!condition) fail(message); };
const hasOnly = (value, allowed, context) => {
  expect(value && typeof value === 'object' && !Array.isArray(value), `${context} must be an object`);
  for (const key of Object.keys(value)) {
    expect(allowed.includes(key), `${context} contains unknown field: ${key}`);
  }
};
const idPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const recordTypePattern = /^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)+$/;
const timeZonePattern = /^[A-Za-z0-9._+-]+(?:\/[A-Za-z0-9._+-]+)+$/;
const validDateTime = (value) => typeof value === 'string' && Number.isFinite(Date.parse(value));

function validateSource(source) {
  hasOnly(source, ['source_id', 'source_kind', 'source_record_id', 'source_display_name'], 'source');
  expect(typeof source.source_id === 'string' && idPattern.test(source.source_id), 'source_id must be canonical and bounded');
  expect(['device', 'application', 'manual', 'import', 'synthetic'].includes(source.source_kind), 'source_kind is unsupported');
  if ('source_record_id' in source) {
    expect(typeof source.source_record_id === 'string' && source.source_record_id.length >= 1 && source.source_record_id.length <= 256, 'source_record_id must be bounded');
    expect(!/[\u0000-\u001F\u007F]/.test(source.source_record_id), 'source_record_id must not contain control characters');
  }
}

function validateRecord(record) {
  hasOnly(record, ['schema_version', 'record_id', 'record_type', 'interval', 'source', 'provenance', 'lifecycle', 'payload'], 'record');
  expect(record.schema_version === 'goreecloud.health.record.v1', 'schema_version mismatch');
  expect(typeof record.record_id === 'string' && idPattern.test(record.record_id), 'record_id must be canonical and bounded');
  expect(typeof record.record_type === 'string' && recordTypePattern.test(record.record_type), 'record_type must be namespaced');

  hasOnly(record.interval, ['start_time', 'end_time', 'time_zone', 'utc_offset_minutes'], 'interval');
  expect(validDateTime(record.interval.start_time), 'start_time must be an offset-aware date-time');
  if ('end_time' in record.interval) {
    expect(validDateTime(record.interval.end_time), 'end_time must be an offset-aware date-time');
    expect(Date.parse(record.interval.end_time) >= Date.parse(record.interval.start_time), 'end_time must not precede start_time');
  }
  expect(typeof record.interval.time_zone === 'string' && timeZonePattern.test(record.interval.time_zone), 'time_zone must be an IANA-style zone identifier');
  expect(Number.isInteger(record.interval.utc_offset_minutes) && record.interval.utc_offset_minutes >= -840 && record.interval.utc_offset_minutes <= 840, 'utc_offset_minutes must be bounded');

  validateSource(record.source);

  hasOnly(record.provenance, ['ingest_method', 'observed_at', 'imported_at', 'transformed', 'transformation_notes'], 'provenance');
  expect(['synthetic-fixture', 'health-connect', 'manual-entry', 'import'].includes(record.provenance.ingest_method), 'ingest_method is unsupported');
  expect(validDateTime(record.provenance.observed_at), 'observed_at must be a date-time');
  expect(typeof record.provenance.transformed === 'boolean', 'transformed must be boolean');
  if (record.provenance.transformed) {
    expect(typeof record.provenance.transformation_notes === 'string' && record.provenance.transformation_notes.length >= 1, 'transformed records require transformation_notes');
  }

  hasOnly(record.lifecycle, ['status', 'supersedes_record_id'], 'lifecycle');
  expect(['active', 'superseded', 'deleted'].includes(record.lifecycle.status), 'lifecycle status is unsupported');
  if ('supersedes_record_id' in record.lifecycle) {
    expect(typeof record.lifecycle.supersedes_record_id === 'string' && idPattern.test(record.lifecycle.supersedes_record_id), 'supersedes_record_id must be canonical');
  }

  expect(record.payload && typeof record.payload === 'object' && !Array.isArray(record.payload), 'payload must be an object');
}

function validateSteps(record) {
  validateRecord(record);
  expect(record.record_type === 'activity.steps', 'steps fixture must bind to activity.steps');
  hasOnly(record.payload, ['count'], 'activity.steps payload');
  expect(Number.isInteger(record.payload.count) && record.payload.count >= 0 && record.payload.count <= 2147483647, 'step count must be a non-negative bounded integer');
}

expect(sourceSchema.$schema === 'https://json-schema.org/draft/2020-12/schema', 'source schema draft must be 2020-12');
expect(sourceSchema.$id === 'https://goreecloud.com/schemas/health/health-source.v1.json', 'source schema id mismatch');
expect(sourceSchema.additionalProperties === false, 'source schema must fail closed on unknown fields');
expect(envelopeSchema.$id === 'https://goreecloud.com/schemas/health/health-record-envelope.v1.json', 'envelope schema id mismatch');
expect(envelopeSchema.additionalProperties === false, 'envelope schema must fail closed on unknown fields');
expect(envelopeSchema.properties?.source?.$ref === './health-source.schema.json', 'envelope must bind the source schema');
expect(stepsSchema.$id === 'https://goreecloud.com/schemas/health/activity-steps.v1.json', 'steps schema id mismatch');
expect(JSON.stringify(stepsSchema).includes('activity.steps'), 'steps schema must bind activity.steps');

validateSteps(fixture);
expect(fixture.source.source_kind === 'synthetic', 'validation fixture must remain synthetic');
expect(fixture.provenance.ingest_method === 'synthetic-fixture', 'validation fixture must not imply a real ingestion path');

const negativeCases = [
  ['unknown top-level field', { ...structuredClone(fixture), unexpected: true }],
  ['missing provenance', (() => { const value = structuredClone(fixture); delete value.provenance; return value; })()],
  ['negative steps', (() => { const value = structuredClone(fixture); value.payload.count = -1; return value; })()],
  ['reversed interval', (() => { const value = structuredClone(fixture); value.interval.end_time = '2026-09-09T07:00:00-05:00'; return value; })()],
  ['whitespace record id', (() => { const value = structuredClone(fixture); value.record_id = ' synthetic.steps.001 '; return value; })()]
];

for (const [name, candidate] of negativeCases) {
  let rejected = false;
  try {
    validateSteps(candidate);
  } catch {
    rejected = true;
  }
  expect(rejected, `negative case must fail closed: ${name}`);
}

console.log('Validated GoreeCloud Health record contract v1: 3 schemas/contracts, 1 synthetic fixture, and 5 fail-closed negative cases.');
