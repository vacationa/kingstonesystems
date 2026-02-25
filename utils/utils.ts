import { redirect } from "next/navigation";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @param {Record<string, string>} additionalProps - An object of key-value pairs to be converted into query parameters.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
  additionalProps: Record<string, string> = {},
) {
  const additionalQuery = Object.entries(additionalProps)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
  const query = `${type}=${encodeURIComponent(message)}${additionalQuery ? "&" + additionalQuery : ""}`;
  return redirect(`${path}?${query}`);
}

/**
 * Formats a URL for display by truncating it and showing only the essential parts
 * @param url - The full URL to format
 * @param maxLength - Maximum length before truncation (default: 50)
 * @returns Formatted URL string
 */
export function formatUrlForDisplay(url: string, maxLength: number = 50): string {
  if (!url) return "Not set";
  
  try {
    const urlObj = new URL(url);
    
    // Show domain + path for all URLs
    const domain = urlObj.hostname.replace('www.', '');
    const path = urlObj.pathname;
    const fullDisplay = `${domain}${path}`;
    
    return fullDisplay.length > maxLength 
      ? `${fullDisplay.substring(0, maxLength)}...`
      : fullDisplay;
      
  } catch {
    // If URL parsing fails, truncate the original string
    return url.length > maxLength 
      ? `${url.substring(0, maxLength)}...`
      : url;
  }
}
