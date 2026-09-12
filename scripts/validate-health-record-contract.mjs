import { readFile } from 'node:fs/promises';

const paths = {
  source: 'contracts/health-source.schema.json',
  envelope: 'contracts/health-record-envelope.schema.json',
  steps: 'contracts/activity-steps.schema.json',
  distance: 'contracts/activity-distance.schema.json',
  activeEnergy: 'contracts/activity-active-energy.schema.json',
  activityIntensity: 'contracts/activity-intensity.schema.json',
  exercise: 'contracts/exercise-session.schema.json',
  sleep: 'contracts/sleep-session.schema.json',
  heartRate: 'contracts/heart-rate.schema.json',
  bodyWeight: 'contracts/body-weight.schema.json',
  water: 'contracts/hydration-water.schema.json',
  reconciliationPolicy: 'contracts/health-reconciliation-policy.v1.json',
  fixtures: {
    steps: 'contracts/examples/activity-steps.synthetic.json',
    distance: 'contracts/examples/activity-distance.synthetic.json',
    activeEnergy: 'contracts/examples/activity-active-energy.synthetic.json',
    activityIntensity: 'contracts/examples/activity-intensity.synthetic.json',
    exercise: 'contracts/examples/exercise-session.synthetic.json',
    sleep: 'contracts/examples/sleep-session.synthetic.json',
    heartRate: 'contracts/examples/heart-rate.synthetic.json',
    bodyWeight: 'contracts/examples/body-weight.synthetic.json',
    water: 'contracts/examples/hydration-water.synthetic.json'
  }
};

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));
const [sourceSchema, envelopeSchema, stepsSchema, distanceSchema, activeEnergySchema, activityIntensitySchema, exerciseSchema, sleepSchema, heartRateSchema, bodyWeightSchema, waterSchema, reconciliationPolicy] = await Promise.all([
  readJson(paths.source), readJson(paths.envelope), readJson(paths.steps), readJson(paths.distance), readJson(paths.activeEnergy), readJson(paths.activityIntensity), readJson(paths.exercise), readJson(paths.sleep), readJson(paths.heartRate), readJson(paths.bodyWeight), readJson(paths.water), readJson(paths.reconciliationPolicy)
]);
const fixtures = Object.fromEntries(await Promise.all(Object.entries(paths.fixtures).map(async ([name, path]) => [name, await readJson(path)])));

const fail = (message) => { throw new Error(message); };
const expect = (condition, message) => { if (!condition) fail(message); };
const hasOnly = (value, allowed, context) => {
  expect(value && typeof value === 'object' && !Array.isArray(value), `${context} must be an object`);
  for (const key of Object.keys(value)) expect(allowed.includes(key), `${context} contains unknown field: ${key}`);
};
const hasExactKeys = (value, expected, context) => {
  hasOnly(value, expected, context);
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  expect(JSON.stringify(actual) === JSON.stringify(wanted), `${context} must contain exactly: ${wanted.join(', ')}`);
};
const idPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const recordTypePattern = /^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)+$/;
const timeZonePattern = /^[A-Za-z0-9._+-]+(?:\/[A-Za-z0-9._+-]+)+$/;
const offsetAwareDateTimePattern = /(?:Z|[+-]\d{2}:\d{2})$/;
const validOffsetAwareDateTime = (value) => typeof value === 'string' && offsetAwareDateTimePattern.test(value) && Number.isFinite(Date.parse(value));

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
  expect(validOffsetAwareDateTime(record.interval.start_time), 'start_time must be an offset-aware date-time');
  if ('end_time' in record.interval) {
    expect(validOffsetAwareDateTime(record.interval.end_time), 'end_time must be an offset-aware date-time');
    expect(Date.parse(record.interval.end_time) >= Date.parse(record.interval.start_time), 'end_time must not precede start_time');
  }
  expect(typeof record.interval.time_zone === 'string' && timeZonePattern.test(record.interval.time_zone), 'time_zone must be an IANA-style zone identifier');
  expect(Number.isInteger(record.interval.utc_offset_minutes) && record.interval.utc_offset_minutes >= -840 && record.interval.utc_offset_minutes <= 840, 'utc_offset_minutes must be bounded');
  validateSource(record.source);
  hasOnly(record.provenance, ['ingest_method', 'observed_at', 'imported_at', 'transformed', 'transformation_notes'], 'provenance');
  expect(['synthetic-fixture', 'health-connect', 'manual-entry', 'import'].includes(record.provenance.ingest_method), 'ingest_method is unsupported');
  expect(validOffsetAwareDateTime(record.provenance.observed_at), 'observed_at must be an offset-aware date-time');
  if ('imported_at' in record.provenance) expect(validOffsetAwareDateTime(record.provenance.imported_at), 'imported_at must be an offset-aware date-time');
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
function validateActiveEnergy(record) { exactPayload(record, 'activity.active-energy', ['value', 'unit']); expect('end_time' in record.interval, 'active energy requires end_time'); expect(Date.parse(record.interval.end_time) > Date.parse(record.interval.start_time), 'active energy interval duration must be positive'); expect(typeof record.payload.value === 'number' && Number.isFinite(record.payload.value) && record.payload.value >= 0 && record.payload.value <= 1000000, 'active energy must be 0..1000000 kcal'); expect(record.payload.unit === 'kcal', 'active energy unit must be kcal'); }
function validateActivityIntensity(record) { exactPayload(record, 'activity.intensity', ['level']); expect('end_time' in record.interval, 'activity intensity requires end_time'); expect(Date.parse(record.interval.end_time) > Date.parse(record.interval.start_time), 'activity intensity interval duration must be positive'); expect(['moderate', 'vigorous'].includes(record.payload.level), 'activity intensity level must be moderate or vigorous'); }
function validateExercise(record) { exactPayload(record, 'exercise.session', []); expect('end_time' in record.interval, 'exercise session requires end_time'); expect(Date.parse(record.interval.end_time) > Date.parse(record.interval.start_time), 'exercise session duration must be positive'); }
function validateSleep(record) { exactPayload(record, 'sleep.session', []); expect('end_time' in record.interval, 'sleep session requires end_time'); expect(Date.parse(record.interval.end_time) > Date.parse(record.interval.start_time), 'sleep session duration must be positive'); }
function validateHeartRate(record) { exactPayload(record, 'heart.rate', ['value', 'unit']); expect(Number.isInteger(record.payload.value) && record.payload.value >= 1 && record.payload.value <= 300, 'heart rate must be 1..300 bpm'); expect(record.payload.unit === 'bpm', 'heart rate unit must be bpm'); }
function validateBodyWeight(record) { exactPayload(record, 'body.weight', ['value', 'unit']); expect(typeof record.payload.value === 'number' && Number.isFinite(record.payload.value) && record.payload.value > 0 && record.payload.value <= 1000, 'body weight must be bounded'); expect(record.payload.unit === 'kg', 'body weight unit must be kg'); }
function validateWater(record) { exactPayload(record, 'hydration.water', ['value', 'unit']); expect(typeof record.payload.value === 'number' && Number.isFinite(record.payload.value) && record.payload.value > 0 && record.payload.value <= 100000, 'water value must be bounded'); expect(record.payload.unit === 'mL', 'water unit must be mL'); }

const currentRecordTypes = [
  'activity.steps',
  'activity.distance',
  'activity.active-energy',
  'activity.intensity',
  'exercise.session',
  'sleep.session',
  'heart.rate',
  'body.weight',
  'hydration.water'
];

function validateReconciliationPolicy(policy) {
  hasExactKeys(policy, ['schema_version', 'status', 'applies_to_record_types', 'exact_source_identity', 'missing_source_record_id', 'cross_source', 'lifecycle_replacement'], 'reconciliation policy');
  expect(policy.schema_version === 'goreecloud.health.reconciliation-policy.v1', 'reconciliation policy schema_version mismatch');
  expect(policy.status === 'development-source-policy', 'reconciliation policy must remain Development source policy');
  expect(Array.isArray(policy.applies_to_record_types), 'reconciliation policy record types must be an array');
  expect(JSON.stringify(policy.applies_to_record_types) === JSON.stringify(currentRecordTypes), 'reconciliation policy must cover exactly the nine current record types');

  hasExactKeys(policy.exact_source_identity, ['key', 'requires_source_record_id', 'result'], 'exact_source_identity');
  expect(JSON.stringify(policy.exact_source_identity.key) === JSON.stringify(['source.source_id', 'source.source_record_id']), 'exact source identity key must remain source_id + source_record_id');
  expect(policy.exact_source_identity.requires_source_record_id === true, 'exact source identity must require source_record_id');
  expect(policy.exact_source_identity.result === 'same-source-reobservation', 'exact source identity result mismatch');

  hasExactKeys(policy.missing_source_record_id, ['heuristic_deduplication'], 'missing_source_record_id');
  expect(policy.missing_source_record_id.heuristic_deduplication === 'not-authorized', 'records without source_record_id must not be heuristically deduplicated');

  hasExactKeys(policy.cross_source, ['value_time_deduplication', 'aggregation', 'conflict_resolution'], 'cross_source');
  expect(policy.cross_source.value_time_deduplication === 'not-authorized', 'cross-source value/time deduplication must remain unauthorized');
  expect(policy.cross_source.aggregation === 'not-authorized', 'cross-source aggregation must remain unauthorized');
  expect(policy.cross_source.conflict_resolution === 'not-authorized', 'cross-source conflict resolution must remain unauthorized');

  hasExactKeys(policy.lifecycle_replacement, ['mode'], 'lifecycle_replacement');
  expect(policy.lifecycle_replacement.mode === 'explicit-supersession-only', 'replacement must remain explicit supersession only');
}

const schemaChecks = [
  [sourceSchema, 'https://goreecloud.com/schemas/health/health-source.v1.json', null],
  [envelopeSchema, 'https://goreecloud.com/schemas/health/health-record-envelope.v1.json', null],
  [stepsSchema, 'https://goreecloud.com/schemas/health/activity-steps.v1.json', 'activity.steps'],
  [distanceSchema, 'https://goreecloud.com/schemas/health/activity-distance.v1.json', 'activity.distance'],
  [activeEnergySchema, 'https://goreecloud.com/schemas/health/activity-active-energy.v1.json', 'activity.active-energy'],
  [activityIntensitySchema, 'https://goreecloud.com/schemas/health/activity-intensity.v1.json', 'activity.intensity'],
  [exerciseSchema, 'https://goreecloud.com/schemas/health/exercise-session.v1.json', 'exercise.session'],
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
validateActiveEnergy(fixtures.activeEnergy);
validateActivityIntensity(fixtures.activityIntensity);
validateExercise(fixtures.exercise);
validateSleep(fixtures.sleep);
validateHeartRate(fixtures.heartRate);
validateBodyWeight(fixtures.bodyWeight);
validateWater(fixtures.water);
validateReconciliationPolicy(reconciliationPolicy);

const negatives = [
  ['unknown record field', validateSteps, { ...structuredClone(fixtures.steps), unexpected: true }],
  ['negative steps', validateSteps, (() => { const x = structuredClone(fixtures.steps); x.payload.count = -1; return x; })()],
  ['wrong distance unit', validateDistance, (() => { const x = structuredClone(fixtures.distance); x.payload.unit = 'km'; return x; })()],
  ['wrong active-energy unit', validateActiveEnergy, (() => { const x = structuredClone(fixtures.activeEnergy); x.payload.unit = 'kJ'; return x; })()],
  ['zero active-energy duration', validateActiveEnergy, (() => { const x = structuredClone(fixtures.activeEnergy); x.interval.end_time = x.interval.start_time; return x; })()],
  ['active energy too high', validateActiveEnergy, (() => { const x = structuredClone(fixtures.activeEnergy); x.payload.value = 1000001; return x; })()],
  ['unsupported activity-intensity level', validateActivityIntensity, (() => { const x = structuredClone(fixtures.activityIntensity); x.payload.level = 'light'; return x; })()],
  ['zero activity-intensity duration', validateActivityIntensity, (() => { const x = structuredClone(fixtures.activityIntensity); x.interval.end_time = x.interval.start_time; return x; })()],
  ['zero exercise duration', validateExercise, (() => { const x = structuredClone(fixtures.exercise); x.interval.end_time = x.interval.start_time; return x; })()],
  ['ungoverned exercise payload', validateExercise, (() => { const x = structuredClone(fixtures.exercise); x.payload.activity_type = 'running'; return x; })()],
  ['zero sleep duration', validateSleep, (() => { const x = structuredClone(fixtures.sleep); x.interval.end_time = x.interval.start_time; return x; })()],
  ['heart rate too high', validateHeartRate, (() => { const x = structuredClone(fixtures.heartRate); x.payload.value = 301; return x; })()],
  ['zero body weight', validateBodyWeight, (() => { const x = structuredClone(fixtures.bodyWeight); x.payload.value = 0; return x; })()],
  ['wrong hydration unit', validateWater, (() => { const x = structuredClone(fixtures.water); x.payload.unit = 'L'; return x; })()],
  ['noncanonical id', validateSteps, (() => { const x = structuredClone(fixtures.steps); x.record_id = ' synthetic.steps.001 '; return x; })()],
  ['start_time without UTC offset', validateSteps, (() => { const x = structuredClone(fixtures.steps); x.interval.start_time = '2026-09-11T18:00:00'; return x; })()],
  ['observed_at without UTC offset', validateSteps, (() => { const x = structuredClone(fixtures.steps); x.provenance.observed_at = '2026-09-11T23:35:00'; return x; })()],
  ['invalid imported_at', validateSteps, (() => { const x = structuredClone(fixtures.steps); x.provenance.imported_at = 'not-a-date'; return x; })()]
];
for (const [name, validator, candidate] of negatives) {
  let rejected = false;
  try { validator(candidate); } catch { rejected = true; }
  expect(rejected, `negative case must fail closed: ${name}`);
}

const reconciliationNegatives = [
  ['cross-source aggregation enabled', (() => { const x = structuredClone(reconciliationPolicy); x.cross_source.aggregation = 'allowed'; return x; })()],
  ['ungoverned record type added', (() => { const x = structuredClone(reconciliationPolicy); x.applies_to_record_types.push('activity.active-time'); return x; })()]
];
for (const [name, candidate] of reconciliationNegatives) {
  let rejected = false;
  try { validateReconciliationPolicy(candidate); } catch { rejected = true; }
  expect(rejected, `reconciliation policy negative case must fail closed: ${name}`);
}

console.log('Validated GoreeCloud Health record contracts: 11 schemas/contracts, 1 reconciliation policy, 9 synthetic fixtures, 18 record negative cases, and 2 reconciliation-policy negative cases.');