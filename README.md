**Project Overview**
- Stack: Vite + React
- Entry: `index.html`, `src/main.jsx`, `src/App.jsx`
- Styling: `src/index.css` with a black–gold theme using CSS variables

**Local Development**
- Install deps: `npm ci`
- Run dev: `npm run dev`
- Build: `npm run build` (outputs to `dist`)
- Preview build: `npm run preview`

**GitHub Pages Deploy**
- Workflow: `.github/workflows/deploy.yml` builds on push to `main`/`master` and deploys `dist` to Pages.
- One‑time repo setup:
  - Settings → Pages → Source: “GitHub Actions”.
  - Make sure default branch is `main` or `master`.
- Vite config uses `base: './'` in `vite.config.js:1` so assets load correctly under the Pages subpath.

**Customize**
- Content/logic: edit `src/App.jsx:1`.
- Theme/colors: tweak CSS variables in `src/index.css:1` (`--bg`, `--gold`, etc.).
- SEO: update `index.html:1` title, description, and add social meta if needed.

**Housekeeping**
- The old subfolder app `unity-portfolio/` has been removed. The root now contains the single deployable app.
