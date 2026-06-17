import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseClientIp,
  isRateLimited,
  _resetBucketsForTest,
  _bucketSizeForTest,
} from '../src/lib/rateLimit.js';

test('parseClientIp ignores spoofed leftmost XFF entry (Finding 1)', () => {
  // Attacker prepends a fake IP; platform appends the real one last.
  const header = '1.1.1.1, 2.2.2.2, 203.0.113.7';
  assert.equal(parseClientIp(header), '203.0.113.7');
});

test('parseClientIp strips IPv4 port (Finding 1)', () => {
  assert.equal(parseClientIp('203.0.113.7:54321'), '203.0.113.7');
});

test('parseClientIp strips bracketed IPv6 port and preserves bare IPv6 (Finding 1)', () => {
  assert.equal(parseClientIp('[2001:db8::1]:443'), '2001:db8::1');
  assert.equal(parseClientIp('2001:db8::1'), '2001:db8::1');
});

test('parseClientIp falls back when header absent', () => {
  assert.equal(parseClientIp(undefined, 'unknown'), 'unknown');
  assert.equal(parseClientIp('', '10.0.0.9'), '10.0.0.9');
});

test('spoofing the leftmost IP cannot bypass the limit (Finding 1)', () => {
  _resetBucketsForTest();
  process.env.RATE_LIMIT_MAX = '3';

  const realIp = '198.51.100.5';
  let blocked = false;
  for (let i = 0; i < 5; i++) {
    // Different spoofed leftmost each time, same real (rightmost) IP.
    const ip = parseClientIp(`9.9.9.${i}, ${realIp}`);
    blocked = isRateLimited(ip);
  }

  assert.equal(blocked, true, 'rotating the spoofable leftmost IP must not bypass the limit');
  delete process.env.RATE_LIMIT_MAX;
});

test('rate-limit map stays bounded under unique-IP flood (Finding 2 — memory exhaustion)', () => {
  _resetBucketsForTest();
  process.env.RATE_LIMIT_MAX_TRACKED = '50';

  for (let i = 0; i < 5000; i++) {
    isRateLimited(`10.${(i >> 8) & 255}.${i & 255}.1`);
  }

  const size = _bucketSizeForTest();
  assert.ok(size <= 50, `expected bounded map (<=50), got ${size}`);
  delete process.env.RATE_LIMIT_MAX_TRACKED;
});

test('expired buckets reset so legitimate users are not permanently blocked', () => {
  _resetBucketsForTest();
  process.env.RATE_LIMIT_MAX = '2';
  process.env.RATE_LIMIT_WINDOW_MS = '0'; // window already elapsed on next call

  const ip = '198.51.100.42';
  assert.equal(isRateLimited(ip), false);
  // With a 0ms window, the prior bucket is treated as expired and reset each call.
  assert.equal(isRateLimited(ip), false);

  delete process.env.RATE_LIMIT_MAX;
  delete process.env.RATE_LIMIT_WINDOW_MS;
});
