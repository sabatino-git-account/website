import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { verifyRecaptcha, getAllowedHostnames } from '../src/lib/recaptcha.js';

const ORIGINS = ['https://www.sabatino-ins.com', 'https://sabatino-ins.com'];
const realFetch = global.fetch;

function stubVerify(responseBody, capture = {}) {
  global.fetch = async (url, init) => {
    capture.url = url;
    capture.body = init?.body ? init.body.toString() : '';
    return { json: async () => responseBody };
  };
}

afterEach(() => {
  global.fetch = realFetch;
  delete process.env.RECAPTCHA_SECRET_KEY;
  delete process.env.RECAPTCHA_OPTIONAL;
  delete process.env.RECAPTCHA_MIN_SCORE;
});

test('fail-closed when secret missing and not optional (Finding: misconfig hardening)', async () => {
  delete process.env.RECAPTCHA_SECRET_KEY;
  delete process.env.RECAPTCHA_OPTIONAL;
  assert.equal(await verifyRecaptcha('tok', ORIGINS, '1.2.3.4'), false);
});

test('optional bypass only in explicit local-dev mode', async () => {
  process.env.RECAPTCHA_OPTIONAL = 'true';
  assert.equal(await verifyRecaptcha(null, ORIGINS), true);
});

test('rejects missing token when secret set', async () => {
  process.env.RECAPTCHA_SECRET_KEY = 'secret';
  assert.equal(await verifyRecaptcha('', ORIGINS, '1.2.3.4'), false);
});

test('rejects off-site hostname (replay from localhost)', async () => {
  process.env.RECAPTCHA_SECRET_KEY = 'secret';
  stubVerify({ success: true, score: 0.9, action: 'contact_form', hostname: 'localhost' });
  assert.equal(await verifyRecaptcha('tok', ORIGINS, '1.2.3.4'), false);
});

test('rejects action mismatch for v3 token', async () => {
  process.env.RECAPTCHA_SECRET_KEY = 'secret';
  stubVerify({ success: true, score: 0.9, action: 'signup', hostname: 'www.sabatino-ins.com' });
  assert.equal(await verifyRecaptcha('tok', ORIGINS, '1.2.3.4'), false);
});

test('rejects low score', async () => {
  process.env.RECAPTCHA_SECRET_KEY = 'secret';
  stubVerify({ success: true, score: 0.1, action: 'contact_form', hostname: 'www.sabatino-ins.com' });
  assert.equal(await verifyRecaptcha('tok', ORIGINS, '1.2.3.4'), false);
});

test('accepts valid v3 token and forwards remoteip to Google', async () => {
  process.env.RECAPTCHA_SECRET_KEY = 'secret';
  const capture = {};
  stubVerify({ success: true, score: 0.9, action: 'contact_form', hostname: 'www.sabatino-ins.com' }, capture);

  assert.equal(await verifyRecaptcha('tok', ORIGINS, '203.0.113.7'), true);
  assert.match(capture.body, /remoteip=203.0.113.7/);
});

test('does not send remoteip when client IP unknown', async () => {
  process.env.RECAPTCHA_SECRET_KEY = 'secret';
  const capture = {};
  stubVerify({ success: true, score: 0.9, action: 'contact_form', hostname: 'www.sabatino-ins.com' }, capture);

  assert.equal(await verifyRecaptcha('tok', ORIGINS, 'unknown'), true);
  assert.ok(!capture.body.includes('remoteip'));
});

test('getAllowedHostnames extracts hostnames and drops invalid entries', () => {
  assert.deepEqual(getAllowedHostnames(ORIGINS), ['www.sabatino-ins.com', 'sabatino-ins.com']);
  assert.deepEqual(getAllowedHostnames(['not a url']), []);
});
