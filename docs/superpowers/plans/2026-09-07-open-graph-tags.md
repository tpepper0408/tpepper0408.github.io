# Open Graph Tags Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every page on tpepper.dev correct Open Graph and Twitter Card metadata, so a shared link renders a title, description, and image instead of plain text.

**Architecture:** All tag-building logic lives in one pure, unit-tested utility (`src/utils/openGraph.ts`) that takes plain values and returns a list of `{property|name, content}` objects. `BaseLayout.astro` — the single `<head>` every page routes through — does the one Astro-specific step the utility cannot (resolving an `ImageMetadata` into a real 1200×630 JPEG via `getImage`), then renders whatever the utility hands back. Blog posts pass a per-post image through the collection schema; every other page inherits a site-wide default card with no changes to those page files.

**Tech Stack:** Astro 7.0.3 (content layer + `glob()` loader), `astro:assets` (`getImage`, sharp service), `astro/zod`, Vitest 4, Tailwind 3.

---

## Global Constraints

- Astro version is **7.0.3**. Entries from `getCollection` expose `id`, **not** `slug`. There is no `slug` property on a content entry — use `toBlogSlug(entry.id)` from `src/utils/blog.ts`.
- `z` is imported from `'astro/zod'`, **never** from `'astro:content'` (that re-export is deprecated and is what produced 8 `astro check` hints before it was fixed).
- `astro check` must finish with **0 errors, 0 warnings, 0 hints**. Do not introduce a deprecated API.
- Site origin is `https://tpepper.dev`, set as `site` in `astro.config.mjs`. All `og:*` and `twitter:*` URLs must be **absolute** — scrapers reject root-relative paths.
- OG card dimensions are exactly **1200×630**, format **jpeg**. Do not ship webp: support is uneven across scrapers (notably LinkedIn) and a card that fails to render is the bug being fixed.
- Site name string is exactly `Pepper Headspace`.
- After every change run `npm run lint` and `npm run test`. Before pushing run `npm run ci` (lint + format:check + test + build). A pre-commit hook runs lint + format:check + test, so a commit fails if any of those fail.
- Run `npm run format` before committing; `format:check` is part of CI and will reject unformatted files.
- Every new utility needs tests in `src/tests/`, one `*.test.ts` per utility, covering happy path, edge cases, and error conditions.
- Do not add a runtime dependency. `sharp` is already present transitively via Astro and is used only in a one-off local script in Task 1, never imported by site code.

---

## Context: why this work exists

Reported issue: _"The site has no Open Graph tags at all — shared links get plain text, no image."_

**Confirmed.** `src/layouts/BaseLayout.astro` is the only `<head>` on the site and emits just: `charset`, `viewport`, favicon, `generator`, `description`, RSS `alternate`, `title`. A grep of `src/` and `public/` for `og:` / `twitter:` / `property=` returns zero hits, confirmed in built HTML under `dist/`.

**Root cause:** the layout's `Props` interface accepts only `title` and `description`. There is no channel for a per-page image and no page attempts to pass one.

**Two related bugs found while confirming**, both in `src/layouts/BlogPost.astro`, both the same leftover-`slug` family as the RSS `/blog/undefined/` bug fixed in PR #11. Task 4 fixes them because it is already editing that file:

1. Line 21 renders `{frontmatter.slug}.md`, but `frontmatter` is `entry.data`, which has no `slug`. Every post's terminal header currently renders `cat .md` instead of `cat when-code-plays-itself.md`. Live on all 8 posts.
2. Line 32 renders `<time datetime={frontmatter.pubDate}>`, which stringifies a JS `Date` to `"Mon Mar 23 2026 00:00:00 GMT+0000 (Greenwich Mean Time)"` — not a valid HTML datetime value, so it is meaningless to machines.

**Decisions already taken** (do not relitigate):

- Per-post `image` field in the collection schema, with a site-wide default fallback. Rejected: one static image for everything (all shares look identical); auto-generated cards via satori/astro-og-canvas (new dependency and template work, revisit later).
- Images live in `src/assets/images/` and are referenced with Astro's `image()` schema helper, then resized at build time by `getImage`. Rejected: plain string paths into `public/og/` (duplicates files, hand-cropping, and a typo silently ships a broken card); passing Astro's default webp output straight through (webp OG support is the problem being fixed). The decisive advantage of `image()` is that **a bad path fails the build.**

**Explicitly out of scope**, easy to add later on top of this: auto-generated per-post cards, `og:locale`, `twitter:site` (needs the account handle), JSON-LD structured data.

**Verified against installed `node_modules` before writing this plan:**

- `getImage` is exported from `astro:assets` (`node_modules/astro/dist/assets/index.d.ts:1`).
- `schema` accepts `S | ((context: SchemaContext) => S)` where `SchemaContext = { image: ImageFunction }` (`node_modules/astro/dist/content/config.d.ts:43-57`), and this works with the `glob()` loader.
- `sharp` 0.34.5 is present for the one-off image script.
- `ImageMetadata` is a global type — no import needed for it.

**Unverified assumption, check it first in Task 3:** that the sharp image service accepts `fit: 'cover'` alongside `width`/`height`/`format` in `getImage`. If it does not, drop `fit` and pre-crop the default card to 1200×630 (source images are 1536×1024, a 3:2 ratio that loses a little top and bottom at 1.91:1). This is the single riskiest line in the plan — prove it with a build before writing the rest of Task 3.

---

## File Structure

**Create:**

- `src/utils/openGraph.ts` — pure tag construction. Owns URL absolutisation, every default and fallback, and the exact tag set and order. No Astro imports, so it is testable in plain Vitest.
- `src/tests/openGraph.test.ts` — unit tests for the above.
- `src/assets/images/og-default.png` — 1200×630 branded fallback card, generated once in Task 1.

**Modify:**

- `src/content.config.ts` — schema becomes a function taking `{ image }`; adds `image` and `imageAlt` optional fields.
- `src/layouts/BaseLayout.astro:1-30` — widen `Props`, resolve the card with `getImage`, emit canonical + all meta tags.
- `src/layouts/BlogPost.astro:1-32` — accept and forward article metadata; fix the `slug` and `datetime` bugs.
- `src/pages/blog/[slug].astro:19-21` — pass `slug` into `BlogPost`.
- 7 files in `src/content/blog/` — add an `image:` frontmatter line.

**Not modified, by design:** `index.astro`, `about.astro`, `posts/[...page].astro`, `tags/index.astro`, `tags/[tag].astro`, `ResourcePage.astro`. All already route through `BaseLayout`, so the defaults added in Task 3 give them correct `og:type=website` tags with the default card for free.

---

### Task 1: Default OG card asset

Generates the fallback image every non-post page and the one image-less post rely on. Done first because Task 3 imports it and cannot build without it.

**Files:**

- Create: `src/assets/images/og-default.png`

**Interfaces:**

- Consumes: nothing.
- Produces: `src/assets/images/og-default.png`, exactly 1200×630, imported by `BaseLayout.astro` in Task 3.

- [ ] **Step 1: Write the generator script to the scratchpad**

This is a one-off local script. Do **not** commit it — only its PNG output is committed. Colours are the site's dark theme from `src/styles/global.css`: background `#0a0a0a`, accent cyan `#00ffff`, primary text `#ffffff`, secondary text `#a0a0a0`, border `#2a2a2a`.

```bash
mkdir -p /tmp/og-gen && cat > /tmp/og-gen/make-og.mjs <<'SCRIPT'
import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <g stroke="#ffffff" stroke-opacity="0.05" stroke-width="1">
    ${Array.from({ length: 60 }, (_, i) => `<line x1="${i * 20}" y1="0" x2="${i * 20}" y2="630"/>`).join('')}
    ${Array.from({ length: 32 }, (_, i) => `<line x1="0" y1="${i * 20}" x2="1200" y2="${i * 20}"/>`).join('')}
  </g>
  <rect x="0" y="0" width="1200" height="6" fill="#00ffff"/>
  <text x="90" y="250" font-family="JetBrains Mono, DejaVu Sans Mono, Courier New, monospace" font-size="42" fill="#00ffff">~/pepper-headspace $</text>
  <text x="90" y="360" font-family="JetBrains Mono, DejaVu Sans Mono, Courier New, monospace" font-size="76" font-weight="bold" fill="#ffffff">Pepper Headspace</text>
  <text x="90" y="440" font-family="IBM Plex Sans, DejaVu Sans, sans-serif" font-size="34" fill="#a0a0a0">Thoughts on leadership, tech, and everything in between</text>
  <rect x="90" y="500" width="240" height="2" fill="#2a2a2a"/>
  <text x="90" y="556" font-family="JetBrains Mono, DejaVu Sans Mono, Courier New, monospace" font-size="30" fill="#a0a0a0">tpepper.dev</text>
</svg>`;

await sharp(Buffer.from(svg))
  .png()
  .toFile('src/assets/images/og-default.png');
console.log('wrote src/assets/images/og-default.png');
SCRIPT
```

- [ ] **Step 2: Generate the image**

Run from the repo root: `node /tmp/og-gen/make-og.mjs`
Expected: `wrote src/assets/images/og-default.png`

- [ ] **Step 3: Verify the dimensions are exactly 1200x630**

Run: `node -e "require('sharp')('src/assets/images/og-default.png').metadata().then(m=>console.log(m.width,m.height,m.format))"`
Expected: `1200 630 png`

If the numbers differ, the SVG was altered — fix the `width`/`height` attributes rather than post-resizing.

- [ ] **Step 4: Look at it**

Open `src/assets/images/og-default.png` and check the text actually rendered. Fonts are resolved from the system, so if JetBrains Mono and IBM Plex Sans are absent the fallbacks in each `font-family` list apply — that is fine and still legible. **Empty or invisible text is not fine.** If text is missing entirely, librsvg found no usable font: replace both `font-family` values with the bare word `monospace` and regenerate.

This is the one step in the plan needing human judgement. The card is the site's public face on every share, so if it looks cheap, say so and swap in a hand-designed 1200×630 PNG at the same path instead. Nothing later in the plan depends on how the image looks, only on its path and dimensions.

- [ ] **Step 5: Commit**

```bash
git add src/assets/images/og-default.png
git commit -m "Add default Open Graph card image"
```

---

### Task 2: Open Graph tag utility

The whole of the tag logic, TDD'd in isolation. No Astro involvement, so it can be built and proven before touching a layout.

**Files:**

- Create: `src/utils/openGraph.ts`
- Test: `src/tests/openGraph.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces:
  - `SITE_NAME: string` (`'Pepper Headspace'`), `OG_IMAGE_WIDTH: number` (1200), `OG_IMAGE_HEIGHT: number` (630)
  - `interface MetaTag { property?: string; name?: string; content: string }`
  - `interface OpenGraphInput { title: string; description: string; pathname: string; site: URL; imageUrl: string; imageAlt?: string; imageWidth?: number; imageHeight?: number; type?: 'website' | 'article'; publishedTime?: Date; tags?: string[] }`
  - `absoluteUrl(pathOrUrl: string, site: URL): string`
  - `buildOpenGraphTags(input: OpenGraphInput): MetaTag[]`

Task 3 calls `absoluteUrl` and `buildOpenGraphTags` and reads the two dimension constants. Exact names matter.

- [ ] **Step 1: Write the failing tests**

Create `src/tests/openGraph.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  absoluteUrl,
  buildOpenGraphTags,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_NAME,
  type OpenGraphInput,
} from '../utils/openGraph.ts';

const site = new URL('https://tpepper.dev');

const baseInput: OpenGraphInput = {
  title: 'When Code Plays Itself',
  description: 'AI has not simplified software development.',
  pathname: '/blog/when-code-plays-itself/',
  site,
  imageUrl: '/_astro/PlayerPianoCode.abc123.jpg',
};

const contentFor = (tags: ReturnType<typeof buildOpenGraphTags>, key: string) =>
  tags
    .filter((tag) => tag.property === key || tag.name === key)
    .map((tag) => tag.content);

describe('absoluteUrl', () => {
  it('resolves a root-relative path against the site origin', () => {
    expect(absoluteUrl('/blog/a-post/', site)).toBe(
      'https://tpepper.dev/blog/a-post/'
    );
  });

  it('resolves a hashed asset path against the site origin', () => {
    expect(absoluteUrl('/_astro/card.abc123.jpg', site)).toBe(
      'https://tpepper.dev/_astro/card.abc123.jpg'
    );
  });

  it('leaves an already-absolute URL unchanged', () => {
    expect(absoluteUrl('https://cdn.example.com/card.jpg', site)).toBe(
      'https://cdn.example.com/card.jpg'
    );
  });

  it('preserves a trailing slash', () => {
    expect(absoluteUrl('/about/', site)).toBe('https://tpepper.dev/about/');
  });

  it('resolves the site root', () => {
    expect(absoluteUrl('/', site)).toBe('https://tpepper.dev/');
  });
});

describe('buildOpenGraphTags', () => {
  it('emits absolute og:url and og:image', () => {
    const tags = buildOpenGraphTags(baseInput);

    expect(contentFor(tags, 'og:url')).toEqual([
      'https://tpepper.dev/blog/when-code-plays-itself/',
    ]);
    expect(contentFor(tags, 'og:image')).toEqual([
      'https://tpepper.dev/_astro/PlayerPianoCode.abc123.jpg',
    ]);
  });

  it('never emits a root-relative URL', () => {
    const tags = buildOpenGraphTags(baseInput);
    const urlish = tags.filter((tag) => tag.content.includes('/'));

    for (const tag of urlish) {
      if (tag.content.startsWith('/')) {
        throw new Error(
          `relative URL in ${tag.property ?? tag.name}: ${tag.content}`
        );
      }
    }
    expect(urlish.length).toBeGreaterThan(0);
  });

  it('carries the title, description and site name', () => {
    const tags = buildOpenGraphTags(baseInput);

    expect(contentFor(tags, 'og:title')).toEqual(['When Code Plays Itself']);
    expect(contentFor(tags, 'og:description')).toEqual([
      'AI has not simplified software development.',
    ]);
    expect(contentFor(tags, 'og:site_name')).toEqual([SITE_NAME]);
  });

  it('defaults og:type to website', () => {
    expect(contentFor(buildOpenGraphTags(baseInput), 'og:type')).toEqual([
      'website',
    ]);
  });

  it('defaults the image dimensions to the OG card size', () => {
    const tags = buildOpenGraphTags(baseInput);

    expect(contentFor(tags, 'og:image:width')).toEqual([
      String(OG_IMAGE_WIDTH),
    ]);
    expect(contentFor(tags, 'og:image:height')).toEqual([
      String(OG_IMAGE_HEIGHT),
    ]);
  });

  it('honours explicit image dimensions', () => {
    const tags = buildOpenGraphTags({
      ...baseInput,
      imageWidth: 800,
      imageHeight: 418,
    });

    expect(contentFor(tags, 'og:image:width')).toEqual(['800']);
    expect(contentFor(tags, 'og:image:height')).toEqual(['418']);
  });

  it('falls back to the title for image alt text', () => {
    expect(contentFor(buildOpenGraphTags(baseInput), 'og:image:alt')).toEqual([
      'When Code Plays Itself',
    ]);
  });

  it('uses supplied alt text when present', () => {
    const tags = buildOpenGraphTags({
      ...baseInput,
      imageAlt: 'A player piano.',
    });

    expect(contentFor(tags, 'og:image:alt')).toEqual(['A player piano.']);
    expect(contentFor(tags, 'twitter:image:alt')).toEqual(['A player piano.']);
  });

  it('emits a large summary Twitter card mirroring the OG values', () => {
    const tags = buildOpenGraphTags(baseInput);

    expect(contentFor(tags, 'twitter:card')).toEqual(['summary_large_image']);
    expect(contentFor(tags, 'twitter:title')).toEqual([
      'When Code Plays Itself',
    ]);
    expect(contentFor(tags, 'twitter:image')).toEqual([
      'https://tpepper.dev/_astro/PlayerPianoCode.abc123.jpg',
    ]);
  });

  it('uses name= for twitter tags and property= for og tags', () => {
    const tags = buildOpenGraphTags(baseInput);

    for (const tag of tags) {
      const key = tag.property ?? tag.name ?? '';
      if (key.startsWith('twitter:')) {
        expect(tag.name, key).toBe(key);
        expect(tag.property, key).toBeUndefined();
      } else {
        expect(tag.property, key).toBe(key);
        expect(tag.name, key).toBeUndefined();
      }
    }
  });

  it('adds article metadata for posts', () => {
    const tags = buildOpenGraphTags({
      ...baseInput,
      type: 'article',
      publishedTime: new Date('2026-03-23T00:00:00.000Z'),
      tags: ['ai', 'team-building'],
    });

    expect(contentFor(tags, 'og:type')).toEqual(['article']);
    expect(contentFor(tags, 'article:published_time')).toEqual([
      '2026-03-23T00:00:00.000Z',
    ]);
    expect(contentFor(tags, 'article:tag')).toEqual(['ai', 'team-building']);
  });

  it('omits article metadata on website pages even when it is supplied', () => {
    const tags = buildOpenGraphTags({
      ...baseInput,
      publishedTime: new Date('2026-03-23T00:00:00.000Z'),
      tags: ['ai'],
    });

    expect(contentFor(tags, 'article:published_time')).toEqual([]);
    expect(contentFor(tags, 'article:tag')).toEqual([]);
  });

  it('omits article:published_time when a post has no date', () => {
    const tags = buildOpenGraphTags({
      ...baseInput,
      type: 'article',
      tags: ['ai'],
    });

    expect(contentFor(tags, 'article:published_time')).toEqual([]);
    expect(contentFor(tags, 'article:tag')).toEqual(['ai']);
  });

  it('emits no article:tag for an empty or absent tag list', () => {
    expect(
      contentFor(
        buildOpenGraphTags({ ...baseInput, type: 'article', tags: [] }),
        'article:tag'
      )
    ).toEqual([]);
    expect(
      contentFor(
        buildOpenGraphTags({ ...baseInput, type: 'article' }),
        'article:tag'
      )
    ).toEqual([]);
  });

  it('never emits an empty content value', () => {
    const tags = buildOpenGraphTags(baseInput);

    for (const tag of tags) {
      expect(tag.content, tag.property ?? tag.name).not.toBe('');
    }
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/tests/openGraph.test.ts`
Expected: FAIL — `Failed to resolve import "../utils/openGraph.ts"`.

- [ ] **Step 3: Write the implementation**

Create `src/utils/openGraph.ts`:

```ts
export const SITE_NAME = 'Pepper Headspace';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export interface MetaTag {
  property?: string;
  name?: string;
  content: string;
}

export interface OpenGraphInput {
  title: string;
  description: string;
  /** `Astro.url.pathname` for the page being rendered. */
  pathname: string;
  /** `Astro.site`, used to absolutise every URL. Scrapers reject relative ones. */
  site: URL;
  /** `src` of the already-resolved card image, usually a hashed `/_astro/…` path. */
  imageUrl: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  type?: 'website' | 'article';
  publishedTime?: Date;
  tags?: string[];
}

/** Resolve a path against the site origin, leaving absolute URLs untouched. */
export function absoluteUrl(pathOrUrl: string, site: URL): string {
  return new URL(pathOrUrl, site).href;
}

/** Build the full Open Graph and Twitter Card tag set for one page. */
export function buildOpenGraphTags(input: OpenGraphInput): MetaTag[] {
  const {
    title,
    description,
    pathname,
    site,
    imageUrl,
    imageAlt = title,
    imageWidth = OG_IMAGE_WIDTH,
    imageHeight = OG_IMAGE_HEIGHT,
    type = 'website',
    publishedTime,
    tags = [],
  } = input;

  const pageUrl = absoluteUrl(pathname, site);
  const cardUrl = absoluteUrl(imageUrl, site);

  const metaTags: MetaTag[] = [
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: pageUrl },
    { property: 'og:image', content: cardUrl },
    { property: 'og:image:alt', content: imageAlt },
    { property: 'og:image:width', content: String(imageWidth) },
    { property: 'og:image:height', content: String(imageHeight) },
  ];

  if (type === 'article') {
    if (publishedTime) {
      metaTags.push({
        property: 'article:published_time',
        content: publishedTime.toISOString(),
      });
    }
    for (const tag of tags) {
      metaTags.push({ property: 'article:tag', content: tag });
    }
  }

  metaTags.push(
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: cardUrl },
    { name: 'twitter:image:alt', content: imageAlt }
  );

  return metaTags;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/tests/openGraph.test.ts`
Expected: PASS, 19 tests.

- [ ] **Step 5: Lint and format**

Run: `npm run format && npm run lint`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/utils/openGraph.ts src/tests/openGraph.test.ts
git commit -m "Add Open Graph tag builder utility"
```

---

### Task 3: Emit the tags from BaseLayout

Wires the utility into the single `<head>`. On completion every page on the site has OG tags with the default card — the reported issue is fixed at this point, before any per-post work.

**Files:**

- Modify: `src/content.config.ts`
- Modify: `src/layouts/BaseLayout.astro:1-30`

**Interfaces:**

- Consumes: `absoluteUrl`, `buildOpenGraphTags`, `OG_IMAGE_WIDTH`, `OG_IMAGE_HEIGHT` from Task 2; `src/assets/images/og-default.png` from Task 1.
- Produces: `BaseLayout` `Props` gains `image?: ImageMetadata`, `imageAlt?: string`, `type?: 'website' | 'article'`, `publishedTime?: Date`, `tags?: string[]` — all optional. Blog frontmatter gains optional `image` (an `ImageMetadata` once loaded) and `imageAlt` (string). Task 4 passes all five props.

- [ ] **Step 1: Prove the `getImage` call works before building on it**

This is the plan's one unverified assumption — that the sharp service accepts `fit` alongside `width`/`height`/`format`. Test it in isolation first. Temporarily add to the frontmatter of `src/pages/index.astro`:

```ts
import { getImage } from 'astro:assets';
import ogProbe from '../assets/images/og-default.png';
const probe = await getImage({
  src: ogProbe,
  width: 1200,
  height: 630,
  fit: 'cover',
  format: 'jpeg',
});
console.log(
  'OG PROBE',
  probe.src,
  probe.attributes.width,
  probe.attributes.height
);
```

Run: `npm run build 2>&1 | grep "OG PROBE"`
Expected: a line like `OG PROBE /_astro/og-default.<hash>.jpg 1200 630`.

If the build errors on `fit`, remove that one property and re-run. If it then passes, drop `fit` from every `getImage` call in this task and note it here. Everything else in the task is unchanged either way.

Now **revert the probe** — `git checkout src/pages/index.astro` — before continuing.

- [ ] **Step 2: Add the image fields to the collection schema**

Replace the whole of `src/content.config.ts`. Note `schema` becomes a **function** taking `{ image }`; `z` still comes from `astro/zod`.

```ts
import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/blog',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      tags: z.array(z.string()).optional(),
      /** Social card image, resolved relative to the post file. A bad path fails the build. */
      image: image().optional(),
      imageAlt: z.string().optional(),
    }),
});

export const collections = { blog };
```

- [ ] **Step 3: Confirm the schema change builds with no post using the new fields**

Run: `npm run build`
Expected: `[build] Complete!`, 31 pages, no errors. The fields are optional, so nothing breaks yet.

- [ ] **Step 4: Rewrite the BaseLayout frontmatter**

Replace lines 1-13 of `src/layouts/BaseLayout.astro` (everything between and including the opening and closing `---`) with:

```astro
---
import '../styles/global.css';
import { getImage } from 'astro:assets';
import ogDefault from '../assets/images/og-default.png';
import {
  absoluteUrl,
  buildOpenGraphTags,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
} from '../utils/openGraph.ts';

interface Props {
  title: string;
  description?: string;
  image?: ImageMetadata;
  imageAlt?: string;
  type?: 'website' | 'article';
  publishedTime?: Date;
  tags?: string[];
}

const {
  title,
  description = 'Thoughts on leadership, tech, and everything in between',
  image,
  imageAlt,
  type = 'website',
  publishedTime,
  tags,
} = Astro.props;
const currentPath = Astro.url.pathname;

const site = Astro.site;
if (!site) {
  throw new Error(
    '`site` must be set in astro.config.mjs to build page metadata.'
  );
}

// Scrapers want a predictable 1200x630 jpeg, not Astro's default webp.
const card = await getImage({
  src: image ?? ogDefault,
  width: OG_IMAGE_WIDTH,
  height: OG_IMAGE_HEIGHT,
  fit: 'cover',
  format: 'jpeg',
});

const canonical = absoluteUrl(currentPath, site);
const metaTags = buildOpenGraphTags({
  title,
  description,
  pathname: currentPath,
  site,
  imageUrl: card.src,
  imageAlt,
  type,
  publishedTime,
  tags,
});
---
```

`currentPath` is used further down the file by the nav's active-link logic — keep it.

- [ ] **Step 5: Render the tags in the head**

In `src/layouts/BaseLayout.astro`, replace this line:

```astro
<meta name="description" content={description} />
```

with:

```astro
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
{
  metaTags.map((tag) =>
    tag.property ? (
      <meta property={tag.property} content={tag.content} />
    ) : (
      <meta name={tag.name} content={tag.content} />
    )
  )
}
```

Leave the existing RSS `alternate` link and `<title>` untouched.

- [ ] **Step 6: Verify the tags reach the built HTML**

```bash
npm run build >/dev/null 2>&1
grep -o '<meta property="og:[^>]*>' dist/index.html
grep -o '<link rel="canonical"[^>]*>' dist/about/index.html
```

Expected: nine `og:*` tags on the homepage, `og:type` of `website`, `og:image` an absolute `https://tpepper.dev/_astro/og-default.<hash>.jpg`, and a canonical of `https://tpepper.dev/about/`.

- [ ] **Step 7: Confirm no relative URLs escaped into the output**

```bash
grep -ho 'content="/[^"]*"' dist/**/index.html dist/index.html | sort -u
```

Expected: no output. Any hit is a URL that was not absolutised — scrapers will reject it.

- [ ] **Step 8: Run the full check**

Run: `npm run ci`
Expected: lint clean, format clean, all tests pass, `astro check` **0 errors 0 warnings 0 hints**, build completes.

- [ ] **Step 9: Commit**

```bash
git add src/content.config.ts src/layouts/BaseLayout.astro
git commit -m "Emit Open Graph and Twitter Card tags from BaseLayout"
```

---

### Task 4: Article metadata and the two BlogPost bugs

Upgrades posts from `website` to `article` cards, and fixes the two live rendering bugs in the file being edited anyway.

**Files:**

- Modify: `src/layouts/BlogPost.astro:1-32`
- Modify: `src/pages/blog/[slug].astro:19-21`

**Interfaces:**

- Consumes: the `BaseLayout` `Props` from Task 3; `toBlogSlug` from `src/utils/blog.ts`.
- Produces: `BlogPost` `Props` becomes `{ frontmatter: { title, description, pubDate, tags?, image?, imageAlt? }, readingTime: number, slug: string }`. The new required `slug` prop is supplied by `blog/[slug].astro`.

- [ ] **Step 1: Replace the BlogPost frontmatter**

Replace lines 1-12 of `src/layouts/BlogPost.astro` (the whole leading `---` block) with:

```astro
---
import BaseLayout from './BaseLayout.astro';

interface Props {
  frontmatter: {
    title: string;
    description: string;
    pubDate: Date;
    tags?: string[];
    image?: ImageMetadata;
    imageAlt?: string;
  };
  readingTime: number;
  slug: string;
}

const { frontmatter, readingTime, slug } = Astro.props;
const pubDate = new Date(frontmatter.pubDate);
const formattedDate = pubDate.toLocaleDateString('en-GB', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---
```

- [ ] **Step 2: Pass the article metadata to BaseLayout**

Replace this line:

```astro
<BaseLayout title={frontmatter.title} description={frontmatter.description} />
```

with:

```astro
<BaseLayout
  title={frontmatter.title}
  description={frontmatter.description}
  image={frontmatter.image}
  imageAlt={frontmatter.imageAlt}
  type="article"
  publishedTime={pubDate}
  tags={frontmatter.tags}
/>
```

- [ ] **Step 3: Fix the `cat .md` bug**

`frontmatter` is `entry.data`, which has no `slug` — this has been rendering `cat .md` on all 8 posts. Replace:

```astro
{frontmatter.slug}.md
```

with:

```astro
{slug}.md
```

- [ ] **Step 4: Fix the invalid `datetime` attribute**

Replace:

```astro
<time datetime={frontmatter.pubDate}></time>
```

with:

```astro
<time datetime={pubDate.toISOString()}></time>
```

- [ ] **Step 5: Pass `slug` down from the route**

In `src/pages/blog/[slug].astro`, replace:

```astro
<BlogPost frontmatter={entry.data} readingTime={readingTime} />
```

with:

```astro
<BlogPost
  frontmatter={entry.data}
  readingTime={readingTime}
  slug={toBlogSlug(entry.id)}
/>
```

`toBlogSlug` is already imported in that file — confirm with `grep -n toBlogSlug src/pages/blog/\[slug\].astro` and add the import from `'../../utils/blog.ts'` if it is missing.

- [ ] **Step 6: Verify all three fixes in the built output**

```bash
npm run build >/dev/null 2>&1
grep -o 'cat</span>[^<]*' dist/blog/2026-03-23-when-code-plays-itself/index.html
grep -o '<time datetime="[^"]*"' dist/blog/2026-03-23-when-code-plays-itself/index.html
grep -o '<meta property="og:type"[^>]*>' dist/blog/2026-03-23-when-code-plays-itself/index.html
```

Expected, in order:

- `cat</span>2026-03-23-when-code-plays-itself.md` — not the current `cat</span>.md`
- `<time datetime="2026-03-23T00:00:00.000Z"` — an ISO string, not `Mon Mar 23 2026 …`
- `<meta property="og:type" content="article">`

- [ ] **Step 7: Confirm article tags are present**

```bash
grep -o '<meta property="article:[^>]*>' dist/blog/2026-03-23-when-code-plays-itself/index.html
```

Expected: one `article:published_time` of `2026-03-23T00:00:00.000Z` and five `article:tag` entries (`software-engineering`, `return-to-engineering`, `technical-leadership`, `ai`, `team-building`).

- [ ] **Step 8: Run the full check**

Run: `npm run ci`
Expected: all green, `astro check` 0/0/0.

- [ ] **Step 9: Commit**

```bash
git add src/layouts/BlogPost.astro "src/pages/blog/[slug].astro"
git commit -m "Add article Open Graph metadata and fix post slug and datetime rendering"
```

---

### Task 5: Per-post card images

Points each post at the image it already contains, so shares are visually distinct.

**Files:**

- Modify: `src/content/blog/2026-02-21-philosophy-and-software-bad-arguments.md`
- Modify: `src/content/blog/2026-03-13-work-experience-prototyping.md`
- Modify: `src/content/blog/2026-03-15-sharpening-my-tools-returning-to-the-craft.md`
- Modify: `src/content/blog/2026-03-23-when-code-plays-itself.md`
- Modify: `src/content/blog/comedy-and-software-engineering-leadership.mdx`
- Modify: `src/content/blog/used-to-write-code-now-i-read-it.md`
- Modify: `src/content/blog/you-cant-measure-what-you-cant-feel.md`

**Interfaces:**

- Consumes: the `image` and `imageAlt` schema fields from Task 3.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Add an `image` line to each post's frontmatter**

Add these two lines inside the existing `---` frontmatter block of each file, after `description`. Paths are relative to the post file and match the first inline image each post already uses — so the card matches the article's own opening visual. The `imageAlt` values are lifted from each image's existing markdown alt text.

`2026-02-21-philosophy-and-software-bad-arguments.md`:

```yaml
image: '../../assets/images/InvalidArgumentConclusionJump.png'
imageAlt: 'A figure jumping over a chasm with a lightbulb, ignoring the evidence around them.'
```

`2026-03-13-work-experience-prototyping.md`:

```yaml
image: '../../assets/images/work_experience/WorkExperiencePlanning.png'
imageAlt: 'A whiteboard with a diagram of the prototyping process.'
```

`2026-03-15-sharpening-my-tools-returning-to-the-craft.md`:

```yaml
image: '../../assets/images/sharpening_tools/SharpeningCraftRusty.png'
imageAlt: 'An interview where the person writing code looks nervous while being observed.'
```

`2026-03-23-when-code-plays-itself.md`:

```yaml
image: '../../assets/images/code_plays_itself/PlayerPianoCode.png'
imageAlt: 'A player piano producing music and software.'
```

`comedy-and-software-engineering-leadership.mdx`:

```yaml
image: '../../assets/images/comedy/ComedyLongForm.png'
imageAlt: 'A lone figure at the front of a large room, facing rows of seated silhouettes.'
```

`used-to-write-code-now-i-read-it.md`:

```yaml
image: '../../assets/images/reading_writing/RustyEngineeringLeader.png'
imageAlt: 'Someone at a computer looking contemplative about how rusty they have become at coding.'
```

`you-cant-measure-what-you-cant-feel.md`:

```yaml
image: '../../assets/images/devex/DevExPianoPlayer.png'
imageAlt: 'A person playing the piano and feeling the music, hitting a bad note.'
```

Leave `2026-02-07-philosophy-and-software-sound-arguments.md` alone — it contains no images and is the intended test of the default-card fallback.

- [ ] **Step 2: Build and confirm each post has a distinct card**

```bash
npm run build >/dev/null 2>&1
grep -h -o '<meta property="og:image" content="[^"]*"' dist/blog/*/index.html | sort
```

Expected: 8 lines, 8 distinct absolute `https://tpepper.dev/_astro/*.jpg` URLs. Seven derive from the post images; `2026-02-07-philosophy-and-software-sound-arguments` shows the `og-default` hash.

- [ ] **Step 3: Confirm every card is a real 1200x630 jpeg**

```bash
node -e "
const fs=require('fs'),sharp=require('sharp');
const html=fs.readFileSync('dist/blog/2026-03-23-when-code-plays-itself/index.html','utf8');
const m=html.match(/og:image\" content=\"https:\/\/tpepper.dev(\/_astro\/[^\"]+)\"/);
sharp('dist'+m[1]).metadata().then(x=>console.log(m[1],x.width,x.height,x.format));
"
```

Expected: the path, then `1200 630 jpeg`.

- [ ] **Step 4: Confirm the fallback post uses the default card**

```bash
grep -o '<meta property="og:image" content="[^"]*"' dist/blog/2026-02-07-philosophy-and-software-sound-arguments/index.html
```

Expected: an absolute URL containing `og-default`.

- [ ] **Step 5: Prove a bad path fails the build**

This is the safety property that justified choosing `image()` over plain strings — confirm it actually holds.

```bash
sed -i '' "s|image: '../../assets/images/devex/DevExPianoPlayer.png'|image: '../../assets/images/devex/DoesNotExist.png'|" src/content/blog/you-cant-measure-what-you-cant-feel.md
npm run build 2>&1 | tail -5
```

Expected: the build **fails** with an image-not-found error naming the file.

Then restore it:

```bash
sed -i '' "s|image: '../../assets/images/devex/DoesNotExist.png'|image: '../../assets/images/devex/DevExPianoPlayer.png'|" src/content/blog/you-cant-measure-what-you-cant-feel.md
npm run build 2>&1 | tail -2
```

Expected: `[build] Complete!`

- [ ] **Step 6: Run the full check**

Run: `npm run ci`
Expected: all green, `astro check` 0/0/0.

- [ ] **Step 7: Commit**

```bash
git add src/content/blog
git commit -m "Add social card images to blog post frontmatter"
```

---

## Final verification

- [ ] **Step 1: Full clean build**

```bash
rm -rf dist && npm run ci
```

Expected: lint clean, format clean, all tests pass (54 existing + 19 new = 73), `astro check` 0 errors 0 warnings 0 hints, 31 pages built.

- [ ] **Step 2: Every page has a card**

```bash
find dist -name '*.html' | wc -l
grep -l 'property="og:image"' $(find dist -name '*.html') | wc -l
```

Expected: both numbers equal and identical (31). A page without a card is a page whose shares are still broken.

- [ ] **Step 3: No relative URLs anywhere in the metadata**

```bash
grep -rho 'content="/[^"]*"' dist --include='*.html' | sort -u
```

Expected: no output.

- [ ] **Step 4: Update CLAUDE.md**

Add to the **Utilities** paragraph in `CLAUDE.md`, alongside the existing entries: `openGraph.ts` (builds the Open Graph and Twitter Card meta tags; `BaseLayout` resolves the image with `getImage` and passes the `src` in). Note in the **Content** paragraph that the schema now also accepts optional `image` and `imageAlt`, and in the **Layouts** paragraph that `BaseLayout` takes optional `image`, `imageAlt`, `type`, `publishedTime`, and `tags`.

- [ ] **Step 5: Commit and open a PR**

```bash
npm run format && npm run ci
git add CLAUDE.md
git commit -m "Document Open Graph utility and schema fields"
git push -u origin <branch>
gh pr create --base main --title "Add Open Graph and Twitter Card metadata" --body "<summary>"
```

- [ ] **Step 6: Validate a real URL after merge and deploy**

Static analysis cannot prove a scraper is happy. Once deployed, run one post and the homepage through:

- LinkedIn Post Inspector — `https://www.linkedin.com/post-inspector/`
- Facebook Sharing Debugger — `https://developers.facebook.com/tools/debug/`
- X Card Validator, or simply paste the link into a Slack DM to yourself

Expected: a large image card with title and description on each. LinkedIn and Facebook cache aggressively — use each tool's re-scrape button rather than assuming a stale result is a bug.

---

## Self-review

Ran against the design before saving.

**Spec coverage** — every design element maps to a task: schema fields → Task 3 Step 2; `openGraph.ts` util → Task 2; `BaseLayout` widening, `getImage`, canonical → Task 3; `BlogPost` article metadata → Task 4 Steps 1-2; the two `BlogPost` bugs → Task 4 Steps 3-4; 7 posts gaining images → Task 5; tests → Task 2 Step 1; default-image asset → Task 1; error handling (build fails on bad path, throw on missing `site`) → Task 5 Step 5 and Task 3 Step 4. No gaps.

**Placeholder scan** — no TBDs. Every code step carries real code; every verification step carries a runnable command and its expected output. The two judgement calls (does the generated card look good enough; does `fit` work) are explicit steps with stated fallbacks, not deferred decisions.

**Type consistency** — `buildOpenGraphTags`, `absoluteUrl`, `OG_IMAGE_WIDTH`, `OG_IMAGE_HEIGHT`, `SITE_NAME`, `MetaTag`, `OpenGraphInput` are named identically in Task 2's definition, Task 2's tests, and Task 3's usage. `image` / `imageAlt` are the same field names in the schema (Task 3), the `BlogPost` Props (Task 4), and the frontmatter (Task 5). `ImageMetadata` is a global Astro type and correctly not imported anywhere.

**Known ordering constraint:** Tasks 1 → 2 → 3 must run in order, since Task 3 imports from both. Tasks 4 and 5 both depend on Task 3 but are independent of each other.
