```markdown
# International Emergency Guide — Deployment (Vercel / GitHub Pages)

This document replaces the previous `replit.md` and contains updated deployment guidance for Vercel and GitHub Pages.

## Recommended Hosts

- Vercel — great for serverless functions, automatic builds, environment variables, and preview deployments.
- GitHub Pages — suitable for static site hosting (use repository pages / project pages).

## Vite & Base Path

- When deploying to GitHub Pages under a repository path (e.g. `https://<user>.github.io/<repo>/`) ensure the Vite `base` is set to the repository path. The project already supports `VITE_BASE_PATH` and a production fallback. Example:

  - Build with an explicit base path:

    ```bash
    VITE_BASE_PATH=/international-emergency-guide/ npm run build
    ```

  - Or set `VITE_BASE_PATH` in your Vercel environment variables.

## Environment Variables

- For Google Maps or other secrets used in client-side code, prefix names with `VITE_` so Vite exposes them to the client (for example `VITE_GOOGLE_MAPS_API_KEY`).
- On Vercel: Project → Settings → Environment Variables → add `VITE_GOOGLE_MAPS_API_KEY` (and any other `VITE_` vars) for Production.

## Service Worker & Asset Paths

- Use relative paths in `client/index.html` (the codebase uses `./` where possible). This ensures scripts and assets load correctly whether hosted at root or a subpath.

## Quick Vercel Notes

- Default build command: `npm run build` (the repository contains a `vercel-build` script if needed).
- Add any server secrets (OpenAI, Google API keys) to Vercel environment variables.

## Quick GitHub Pages Notes

- Build locally and push the `dist` or `gh-pages` branch depending on your workflow.
- Ensure the `base` in Vite matches the repo subpath (case-sensitive). If your repository name uses different casing, match that casing exactly in the `VITE_BASE_PATH`.

## Summary

This file consolidates deployment guidance for Vercel and GitHub Pages and replaces the previous `replit.md` documentation.

``` 
