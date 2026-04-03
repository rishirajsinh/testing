/**
 * Avatar & name display utilities.
 * Strips title prefixes (Dr., Mr., Mrs., Ms., Prof.)
 * and generates proper initials.
 */

const TITLE_REGEX = /^(Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.|Smt\.)\s*/i;

/**
 * Get 2-letter initials from a full name.
 * Strips titles like "Dr.", "Prof." etc.
 * "Dr. Anita Sharma"   → "AS"
 * "Aarav Mehta"         → "AM"
 * "Principal Kapoor"    → "PK"
 */
export function getInitials(fullName) {
  if (!fullName) return 'U';

  const cleaned = fullName.replace(TITLE_REGEX, '').trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);

  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0][0].toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Get display name (first name only, no title).
 * "Dr. Anita Sharma" → "Anita"
 * "Aarav Mehta"       → "Aarav"
 */
export function getDisplayName(fullName) {
  if (!fullName) return 'User';

  const cleaned = fullName.replace(TITLE_REGEX, '').trim();
  return cleaned.split(/\s+/)[0] || 'User';
}

/**
 * Get full name without title prefix.
 * "Dr. Anita Sharma" → "Anita Sharma"
 */
export function getCleanName(fullName) {
  if (!fullName) return 'User';
  return fullName.replace(TITLE_REGEX, '').trim() || 'User';
}
