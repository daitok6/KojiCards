/**
 * Rewrites private Vercel Blob URLs to go through the server-side proxy so
 * the browser can load them. Public URLs and external URLs pass through
 * unchanged.
 */
export function toViewableUrl(url: string): string {
  if (url.includes(".private.blob.vercel-storage.com")) {
    return `/api/blob-proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
}
