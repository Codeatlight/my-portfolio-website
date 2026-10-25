/*
 * Each project has a real, shareable URL: /projects/<id>/
 * The build writes a static page for every one (see vite.config.ts), so the
 * link works on any static host, with no rewrite rules needed. In the app the
 * URL drives the case-study modal, and the browser's back button closes it.
 */

export const projectPath = (id: string) => `/projects/${id}/`;

export function projectIdFromPath(path = window.location.pathname): string | null {
  return /^\/projects\/([^/]+)\/?$/.exec(path)?.[1] ?? null;
}

/** Open a project's case study and put its URL in the address bar. */
export function navigateToProject(id: string) {
  window.history.pushState({ project: id }, '', projectPath(id));
  window.dispatchEvent(new PopStateEvent('popstate', { state: { project: id } }));
}
