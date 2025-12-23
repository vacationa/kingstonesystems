/**
 * Cleans a slug by removing .html extension and # hash fragments
 * @param slug - The slug to clean
 * @returns Clean slug without .html or # fragments
 */
export function cleanSlug(slug: string): string {
  if (!slug) return '';
  
  // Remove .html extension if present
  let cleaned = slug.replace(/\.html$/i, '');
  
  // Remove # and everything after it (hash fragments)
  cleaned = cleaned.split('#')[0];
  
  // Remove trailing slashes
  cleaned = cleaned.replace(/\/+$/, '');
  
  return cleaned;
}

/**
 * Normalizes a slug from various sources (file names, URLs, etc.)
 * @param input - The input string to normalize into a slug
 * @returns Clean, normalized slug
 */
export function normalizeSlug(input: string): string {
  if (!input) return '';
  
  // First clean any .html or # fragments
  let slug = cleanSlug(input);
  
  // Remove leading slashes
  slug = slug.replace(/^\/+/, '');
  
  // Remove trailing slashes
  slug = slug.replace(/\/+$/, '');
  
  return slug;
}



