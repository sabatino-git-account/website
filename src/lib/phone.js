/**
 * Formats up to 10 US digits as (xxx) xxx-xxxx while the user types.
 */
export function formatPhoneInput(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 10);

  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function isValidPhoneInput(value) {
  if (!value) return true;
  return value.replace(/\D/g, "").length === 10;
}
