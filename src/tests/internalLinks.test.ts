import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

type LinkRef = {
  target: string;
  line: number;
  context: string;
};

const testFilePath = fileURLToPath(import.meta.url);
const testsDir = path.dirname(testFilePath);
const projectRoot = path.resolve(testsDir, '..', '..');
const blogDir = path.resolve(projectRoot, 'src', 'content', 'blog');
const publicDir = path.resolve(projectRoot, 'public');
const resourcesPagesDir = path.resolve(projectRoot, 'src', 'pages', 'resources');

const markdownLinkPattern = /!??\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
const htmlAttributePattern = /\b(?:href|src)=['"]([^'"]+)['"]/g;

const stripQuotes = (value: string): string =>
  value.trim().replace(/^['"]|['"]$/g, '');

const normalizeRoute = (value: string): string => {
  if (!value) return '/';

  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`;
  if (withLeadingSlash.length > 1 && withLeadingSlash.endsWith('/')) {
    return withLeadingSlash.slice(0, -1);
  }

  return withLeadingSlash;
};

const stripFragmentAndQuery = (value: string): string => {
  const withoutFragment = value.split('#')[0] ?? value;
  return withoutFragment.split('?')[0] ?? withoutFragment;
};

const isExternalLink = (value: string): boolean => {
  if (value.startsWith('//')) return true;
  return /^[a-z][a-z0-9+.-]*:/i.test(value);
};

const getLineAtIndex = (content: string, index: number): number =>
  content.slice(0, index).split('\n').length;

const getLineText = (content: string, line: number): string =>
  content.split('\n')[line - 1]?.trim() ?? '';

const extractTagsFromFrontmatter = (content: string): string[] => {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!frontmatterMatch) return [];

  const tagsMatch = frontmatterMatch[1].match(/(^|\n)tags:\s*\[([^\]]*)\]/);
  if (!tagsMatch?.[2]) return [];

  return tagsMatch[2]
    .split(',')
    .map((tag) => stripQuotes(tag))
    .filter(Boolean);
};

const extractInternalTargets = (content: string): LinkRef[] => {
  const matches: LinkRef[] = [];

  for (const match of content.matchAll(markdownLinkPattern)) {
    const target = match[1];
    const index = match.index ?? 0;
    const line = getLineAtIndex(content, index);

    matches.push({ target, line, context: getLineText(content, line) });
  }

  for (const match of content.matchAll(htmlAttributePattern)) {
    const target = match[1];
    const index = match.index ?? 0;
    const line = getLineAtIndex(content, index);

    matches.push({ target, line, context: getLineText(content, line) });
  }

  return matches;
};

const getBlogFiles = (): string[] =>
  fs
    .readdirSync(blogDir)
    .filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
    .map((name) => path.join(blogDir, name));

const getResourcePageRoutes = (): string[] => {
  if (!fs.existsSync(resourcesPagesDir)) {
    return [];
  }

  return fs
    .readdirSync(resourcesPagesDir)
    .filter((name) => /\.(md|mdx|astro)$/u.test(name))
    .map((name) => name.replace(/\.(md|mdx|astro)$/u, ''))
    .map((slug) => normalizeRoute(`/resources/${slug}`));
};

const slugFromFileName = (filePath: string): string => {
  const base = path.basename(filePath).replace(/\.(md|mdx)$/u, '');
  return base;
};

const buildValidRoutes = (files: string[]): Set<string> => {
  const routes = new Set<string>([
    '/',
    '/about',
    '/posts',
    '/tags',
    '/rss.xml',
  ]);

  for (const resourceRoute of getResourcePageRoutes()) {
    routes.add(resourceRoute);
  }

  const tags = new Set<string>();

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    const slug = slugFromFileName(filePath);
    routes.add(normalizeRoute(`/blog/${slug}`));

    for (const tag of extractTagsFromFrontmatter(content)) {
      tags.add(tag);
    }
  }

  for (const tag of tags) {
    routes.add(normalizeRoute(`/tags/${tag}`));
  }

  return routes;
};

const resolveRelativeRoute = (target: string, sourceRoute: string): string => {
  const resolved = new URL(target, `https://example.test${sourceRoute}`).pathname;
  return normalizeRoute(resolved);
};

describe('blog content internal links', () => {
  it('resolves internal page links and internal file/image paths', () => {
    const blogFiles = getBlogFiles();
    const validRoutes = buildValidRoutes(blogFiles);
    const errors: string[] = [];

    for (const filePath of blogFiles) {
      const content = fs.readFileSync(filePath, 'utf8');
      const sourceFile = path.relative(projectRoot, filePath);
      const sourceSlug = slugFromFileName(filePath);
      const sourceRoute = `/blog/${sourceSlug}/`;

      for (const linkRef of extractInternalTargets(content)) {
        const rawTarget = linkRef.target.trim();
        const target = stripFragmentAndQuery(rawTarget);

        if (!target || target.startsWith('#') || isExternalLink(target)) {
          continue;
        }

        if (target.startsWith('/')) {
          const normalizedTarget = normalizeRoute(target);
          if (validRoutes.has(normalizedTarget)) {
            continue;
          }

          const publicCandidate = path.join(publicDir, target.replace(/^\//, ''));
          if (fs.existsSync(publicCandidate)) {
            continue;
          }

          errors.push(
            `${sourceFile}:${linkRef.line} -> ${rawTarget} (unknown internal absolute target)`
          );
          continue;
        }

        const hasFileExtension = path.extname(target) !== '';

        if (hasFileExtension) {
          const fileCandidate = path.resolve(path.dirname(filePath), target);
          if (fs.existsSync(fileCandidate)) {
            continue;
          }

          errors.push(
            `${sourceFile}:${linkRef.line} -> ${rawTarget} (missing internal file)`
          );
          continue;
        }

        const resolvedRoute = resolveRelativeRoute(target, sourceRoute);

        if (!validRoutes.has(resolvedRoute)) {
          errors.push(
            `${sourceFile}:${linkRef.line} -> ${rawTarget} (resolves to missing route ${resolvedRoute})`
          );
        }
      }
    }

    expect(errors, errors.join('\n')).toEqual([]);
  });
});
