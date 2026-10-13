const test = require('node:test');
const assert = require('node:assert/strict');
const { configFromEnv } = require('../src/config');
test('uses default port', () => assert.equal(configFromEnv({}).port, 3000));
test('supports custom port', () => assert.equal(configFromEnv({ PORT: '8080' }).port, 8080));
test('rejects invalid port', () => assert.throws(() => configFromEnv({ PORT: '99999' })));
