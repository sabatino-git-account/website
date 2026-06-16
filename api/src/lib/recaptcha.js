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

export async function verifyRecaptcha(token, allowedOrigins) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return isRecaptchaOptional();
  }

  if (!token) return false;

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }),
  });

  const result = await response.json();
  if (!result.success) return false;

  const allowedHostnames = getAllowedHostnames(allowedOrigins);
  if (result.hostname && allowedHostnames.length > 0 && !allowedHostnames.includes(result.hostname)) {
    return false;
  }

  if (result.action && result.action !== 'contact_form') {
    return false;
  }

  const minScore = Number(process.env.RECAPTCHA_MIN_SCORE || 0.5);
  if (typeof result.score === 'number') {
    return result.score >= minScore;
  }

  return true;
}
