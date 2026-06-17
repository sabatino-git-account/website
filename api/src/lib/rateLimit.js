const buckets = new Map();

function windowMs() {
  return Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
}

function maxRequests() {
  return Number(process.env.RATE_LIMIT_MAX || 5);
}

function maxTrackedIps() {
  return Number(process.env.RATE_LIMIT_MAX_TRACKED || 10000);
}

function stripPort(value) {
  const trimmed = String(value).trim();

  // Bracketed IPv6 with port: [::1]:443 -> ::1
  const bracketed = trimmed.match(/^\[(.+)\]:\d+$/);
  if (bracketed) return bracketed[1];

  // IPv4 with port: 1.2.3.4:443 -> 1.2.3.4 (single colon only, so bare IPv6 is left intact)
  if ((trimmed.match(/:/g) || []).length === 1) {
    return trimmed.split(':')[0];
  }

  return trimmed;
}

/**
 * Returns the trustworthy client IP from an X-Forwarded-For header.
 *
 * Client-supplied XFF entries are PREPENDED; the platform (Azure edge) appends
 * the real observed source last. We therefore use the rightmost entry so a
 * caller cannot spoof their identity by sending a fake leftmost value.
 */
export function parseClientIp(forwardedHeader, fallback = 'unknown') {
  if (forwardedHeader) {
    const parts = String(forwardedHeader)
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    if (parts.length > 0) {
      return stripPort(parts[parts.length - 1]);
    }
  }

  return fallback;
}

export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const fallback = request.headers.get('x-client-ip') || 'unknown';
  return parseClientIp(forwarded, fallback);
}

function enforceCapacity(now) {
  const cap = maxTrackedIps();
  // Leave room for the one entry the caller is about to insert, so the map
  // never exceeds `cap` after this call.
  if (buckets.size < cap) return;

  for (const [key, entry] of buckets) {
    if (now > entry.resetAt) buckets.delete(key);
  }

  // If still at/over capacity (e.g. IP-rotation flood with all-fresh entries),
  // drop oldest entries (insertion order) so memory stays bounded.
  while (buckets.size >= cap) {
    const oldestKey = buckets.keys().next().value;
    if (oldestKey === undefined) break;
    buckets.delete(oldestKey);
  }
}

export function isRateLimited(ip) {
  const now = Date.now();
  enforceCapacity(now);

  const entry = buckets.get(ip);

  if (!entry || now > entry.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + windowMs() });
    return false;
  }

  if (entry.count >= maxRequests()) {
    return true;
  }

  entry.count += 1;
  return false;
}

export function _resetBucketsForTest() {
  buckets.clear();
}

export function _bucketSizeForTest() {
  return buckets.size;
}
