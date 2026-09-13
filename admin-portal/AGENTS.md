# Workspace Guidelines

## UI & CSS Changes
- For UI/CSS-related changes (styling, layout, alignments, colors), **do not run browser or headless screenshot tests**.
- Apply the CSS/UI modifications, bump cache busters, sync to `admin-portal/`, rebuild (`node build.mjs && cd admin-portal && node build.mjs`), and report back immediately.
