import { readFile } from 'node:fs/promises';

const paths = {
  source: 'contracts/health-source.schema.json',
  envelope: 'contracts/health-record-envelope.schema.json',
  steps: 'contracts/activity-steps.schema.json',
  distance: 'contracts/activity-distance.schema.json',
  sleep: 'contracts/sleep-session.schema.json',
  heartRate: 'contracts/heart-rate.schema.json',
  bodyWeight: 'contracts/body-weight.schema.json',
  water: 'contracts/hydration-water.schema.json',
  fixtures: {
    steps: 'contracts/examples/activity-steps.synthetic.json',
    distance: 'contracts/examples/activity-distance.synthetic.json',
    sleep: 'contracts/examples/sleep-session.synthetic.json',
    heartRate: 'contracts/examples/heart-rate.synthetic.json',
    bodyWeight: 'contracts/examples/body-weight.synthetic.json',
    water: 'contracts/examples/hydration-water.synthetic.json'
  }
};

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));
const [sourceSchema, envelopeSchema, stepsSchema, distanceSchema, sleepSchema, heartRateSchema, bodyWeightSchema, waterSchema] = await Promise.all([
  readJson(paths.source), readJson(paths.envelope), readJson(paths.steps), readJson(paths.distance), readJson(paths.sleep), readJson(paths.heartRate), readJson(paths.bodyWeight), readJson(paths.water)
]);
const fixtures = Object.fromEntries(await Promise.all(Object.entries(paths.fixtures).map(async ([name, path]) => [name, await readJson(path)])));

const fail = (message) => { throw new Error(message); };
const expect = (condition, message) => { if (!condition) fail(message); };
const hasOnly = (value, allowed, context) => {
  expect(value && typeof value === 'object' && !Array.isArray(value), `${context} must be an object`);
  for (const key of Object.keys(value)) expect(allowed.includes(key), `${context} contains unknown field: ${key}`);
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
  if (record.provenance.transformed) expect(typeof record.provenance.transformation_notes === 'string' && record.provenance.transformation_notes.length >= 1, 'transformed records require transformation_notes');
  hasOnly(record.lifecycle, ['status', 'supersedes_record_id'], 'lifecycle');
  expect(['active', 'superseded', 'deleted'].includes(record.lifecycle.status), 'lifecycle status is unsupported');
  if ('supersedes_record_id' in record.lifecycle) expect(typeof record.lifecycle.supersedes_record_id === 'string' && idPattern.test(record.lifecycle.supersedes_record_id), 'supersedes_record_id must be canonical');
  expect(record.payload && typeof record.payload === 'object' && !Array.isArray(record.payload), 'payload must be an object');
  expect(record.source.source_kind === 'synthetic' && record.provenance.ingest_method === 'synthetic-fixture', 'repository fixtures must remain synthetic-only');
}

function exactPayload(record, type, keys) {
  validateRecord(record);
  expect(record.record_type === type, `fixture must bind to ${type}`);
  hasOnly(record.payload, keys, `${type} payload`);
}
function validateSteps(record) { exactPayload(record, 'activity.steps', ['count']); expect(Number.isInteger(record.payload.count) && record.payload.count >= 0 && record.payload.count <= 2147483647, 'step count must be bounded'); }
function validateDistance(record) { exactPayload(record, 'activity.distance', ['value', 'unit']); expect(typeof record.payload.value === 'number' && Number.isFinite(record.payload.value) && record.payload.value >= 0 && record.payload.value <= 1000000000, 'distance value must be bounded'); expect(record.payload.unit === 'm', 'distance unit must be m'); }
function validateSleep(record) { exactPayload(record, 'sleep.session', []); expect('end_time' in record.interval, 'sleep session requires end_time'); expect(Date.parse(record.interval.end_time) > Date.parse(record.interval.start_time), 'sleep session duration must be positive'); }
function validateHeartRate(record) { exactPayload(record, 'heart.rate', ['value', 'unit']); expect(Number.isInteger(record.payload.value) && record.payload.value >= 1 && record.payload.value <= 300, 'heart rate must be 1..300 bpm'); expect(record.payload.unit === 'bpm', 'heart rate unit must be bpm'); }
function validateBodyWeight(record) { exactPayload(record, 'body.weight', ['value', 'unit']); expect(typeof record.payload.value === 'number' && Number.isFinite(record.payload.value) && record.payload.value > 0 && record.payload.value <= 1000, 'body weight must be bounded'); expect(record.payload.unit === 'kg', 'body weight unit must be kg'); }
function validateWater(record) { exactPayload(record, 'hydration.water', ['value', 'unit']); expect(typeof record.payload.value === 'number' && Number.isFinite(record.payload.value) && record.payload.value > 0 && record.payload.value <= 100000, 'water value must be bounded'); expect(record.payload.unit === 'mL', 'water unit must be mL'); }

const schemaChecks = [
  [sourceSchema, 'https://goreecloud.com/schemas/health/health-source.v1.json', null],
  [envelopeSchema, 'https://goreecloud.com/schemas/health/health-record-envelope.v1.json', null],
  [stepsSchema, 'https://goreecloud.com/schemas/health/activity-steps.v1.json', 'activity.steps'],
  [distanceSchema, 'https://goreecloud.com/schemas/health/activity-distance.v1.json', 'activity.distance'],
  [sleepSchema, 'https://goreecloud.com/schemas/health/sleep-session.v1.json', 'sleep.session'],
  [heartRateSchema, 'https://goreecloud.com/schemas/health/heart-rate.v1.json', 'heart.rate'],
  [bodyWeightSchema, 'https://goreecloud.com/schemas/health/body-weight.v1.json', 'body.weight'],
  [waterSchema, 'https://goreecloud.com/schemas/health/hydration-water.v1.json', 'hydration.water']
];
for (const [schema, id, type] of schemaChecks) {
  expect(schema.$id === id, `schema id mismatch: ${id}`);
  if (type) expect(JSON.stringify(schema).includes(type), `schema must bind ${type}`);
}
expect(sourceSchema.additionalProperties === false, 'source schema must fail closed');
expect(envelopeSchema.additionalProperties === false, 'envelope schema must fail closed');
expect(envelopeSchema.properties?.source?.$ref === './health-source.schema.json', 'envelope must bind source schema');

validateSteps(fixtures.steps);
validateDistance(fixtures.distance);
validateSleep(fixtures.sleep);
validateHeartRate(fixtures.heartRate);
validateBodyWeight(fixtures.bodyWeight);
validateWater(fixtures.water);

const negatives = [
  ['unknown record field', validateSteps, { ...structuredClone(fixtures.steps), unexpected: true }],
  ['negative steps', validateSteps, (() => { const x = structuredClone(fixtures.steps); x.payload.count = -1; return x; })()],
  ['wrong distance unit', validateDistance, (() => { const x = structuredClone(fixtures.distance); x.payload.unit = 'km'; return x; })()],
  ['zero sleep duration', validateSleep, (() => { const x = structuredClone(fixtures.sleep); x.interval.end_time = x.interval.start_time; return x; })()],
  ['heart rate too high', validateHeartRate, (() => { const x = structuredClone(fixtures.heartRate); x.payload.value = 301; return x; })()],
  ['zero body weight', validateBodyWeight, (() => { const x = structuredClone(fixtures.bodyWeight); x.payload.value = 0; return x; })()],
  ['wrong hydration unit', validateWater, (() => { const x = structuredClone(fixtures.water); x.payload.unit = 'L'; return x; })()],
  ['noncanonical id', validateSteps, (() => { const x = structuredClone(fixtures.steps); x.record_id = ' synthetic.steps.001 '; return x; })()]
];
for (const [name, validator, candidate] of negatives) {
  let rejected = false;
  try { validator(candidate); } catch { rejected = true; }
  expect(rejected, `negative case must fail closed: ${name}`);
}

console.log('Validated GoreeCloud Health record contracts: 8 schemas/contracts, 6 synthetic fixtures, and 8 fail-closed negative cases.');
