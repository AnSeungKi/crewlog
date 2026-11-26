/**
 * Static export for GitHub Pages lives under https://anseungki.github.io/crewlog/.
 *
 * Next.js applies the configured `basePath` to its own build output, stylesheets,
 * scripts and <Link> hrefs, but it does NOT rewrite plain string paths that point at
 * files in `public/` (for example `src="/images/seongsu-dusk.jpg"`). Those strings
 * would resolve to https://anseungki.github.io/images/... and 404, so every public
 * asset path is passed through `asset()`.
 *
 * NEXT_PUBLIC_ is inlined at build time, so this works in both server and client
 * components. Locally it is empty and paths stay as they are.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function asset(path: string): string {
  if (!path || !path.startsWith("/")) return path;
  if (BASE_PATH && (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`))) return path;
  return `${BASE_PATH}${path}`;
}

/** Prefixes an in-app route (not a public file) with the base path. */
export function route(path: string): string {
  if (!path) return BASE_PATH || "/";
  return asset(path.startsWith("/") ? path : `/${path}`);
}
