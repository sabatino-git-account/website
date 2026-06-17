const EXPECTED_ACTION = 'contact_form';

function isRecaptchaOptional() {
  return process.env.RECAPTCHA_OPTIONAL === 'true';
}

export function getAllowedHostnames(allowedOrigins) {
  return allowedOrigins
    .map((origin) => {
      try {
        return new URL(origin).hostname;
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

export async function verifyRecaptcha(token, allowedOrigins, clientIp) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return isRecaptchaOptional();
  }

  if (!token) return false;

  const params = new URLSearchParams({ secret, response: token });
  if (clientIp && clientIp !== 'unknown') {
    params.set('remoteip', clientIp);
  }

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  const result = await response.json();
  if (!result.success) return false;

  const allowedHostnames = getAllowedHostnames(allowedOrigins);
  if (result.hostname && allowedHostnames.length > 0 && !allowedHostnames.includes(result.hostname)) {
    return false;
  }

  // reCAPTCHA v3 always returns an action; reject mismatches and missing actions.
  // (v2 responses have no score; only enforce action when a score is present.)
  if (typeof result.score === 'number') {
    if (result.action !== EXPECTED_ACTION) {
      return false;
    }
    const minScore = Number(process.env.RECAPTCHA_MIN_SCORE || 0.5);
    return result.score >= minScore;
  }

  // v2 fallback: action check only when provided.
  if (result.action && result.action !== EXPECTED_ACTION) {
    return false;
  }

  return true;
}
