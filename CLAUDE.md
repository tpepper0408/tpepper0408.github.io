# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server at localhost:4321
npm run build        # Type-check (astro check) then build to dist/
npm run preview      # Preview the built site
npm run test         # Run tests once with vitest
npm run test:watch   # Run tests in watch mode
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier (write)
npm run format:check # Prettier (check only)
npm run ci           # lint + format:check + test + build (what CI runs)
```

Run a single test file: `npx vitest run src/tests/readingTime.test.ts`

## Development workflow

After every change, run `npm run lint` and `npm run test` and fix any failures before considering the work done. For a full pre-push check, run `npm run ci`.

Any feature change or new utility must include tests in `src/tests/` with sufficient coverage of the happy path, edge cases, and error conditions. Follow the existing pattern: one `*.test.ts` file per utility/component, co-located under `src/tests/`.

## Architecture

Personal blog for Tim Pepper (tpepper.dev), built with Astro 5 + Tailwind CSS. Deployed to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`. PRs run `npm run ci` via `.github/workflows/pr-checks.yml`.

**Content** lives in `src/content/blog/` as `.md` or `.mdx` files. The collection schema (`src/content/config.ts`) requires `title`, `description`, `pubDate`; optional `tags` (string array) and `draft` (boolean, defaults false). Blog posts are served at `/blog/[slug]`.

**Routing:**
- `/` — homepage with 3 latest posts
- `/posts/[...page]` — paginated post list
- `/blog/[slug]` — individual post (uses `getStaticPaths` + `getCollection`)
- `/tags/` and `/tags/[tag]` — tag browsing
- `/about` — about page
- `/rss.xml` — RSS feed

**Layouts:** `BaseLayout.astro` wraps all pages (nav, footer, dark/light theme toggle). `BlogPost.astro` extends it with terminal-style header showing date, reading time, and tags. `ResourcePage.astro` is for static resource pages under `src/pages/resources/`.

**Reading time** is calculated in `src/utils/readingTime.ts` (200 wpm, min 1 minute) and passed as a prop from `src/pages/blog/[slug].astro` into `BlogPost.astro`.

**Components:** `YouTubeEmbed.astro` accepts either a `url` (full YouTube URL) or `id` prop, plus optional `title` and `start` (seconds). Uses `src/utils/youtube.ts` for URL parsing.

**Utilities** (`src/utils/`): `readingTime.ts`, `tags.ts` (aggregates tag counts from posts), `youtube.ts` (resolves video IDs and builds embed URLs). All utilities have corresponding tests in `src/tests/`.

**Styling:** Tailwind with custom CSS variables in `src/styles/global.css`. Uses CSS variables like `--border`, `--text-secondary`, `--accent-cyan` for theming. Dark mode is default, toggled via `localStorage` with the `dark` class on `<html>`.

**Images:** Processed by Astro's `<Image>` component when imported from `src/assets/images/`. Static files go in `public/`.

**MDX posts** can import and use `YouTubeEmbed` directly as a component.
