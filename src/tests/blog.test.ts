import { describe, expect, it } from 'vitest';
import {
  buildFeedItems,
  sortPostsByDate,
  toBlogSlug,
  type BlogEntryLike,
} from '../utils/blog.ts';

const makePost = (
  id: string,
  overrides: Partial<BlogEntryLike['data']> = {}
): BlogEntryLike => ({
  id,
  data: {
    title: `Title for ${id}`,
    description: `Description for ${id}`,
    pubDate: new Date('2026-01-01'),
    ...overrides,
  },
});

describe('toBlogSlug', () => {
  it('returns content layer ids unchanged when they have no extension', () => {
    expect(toBlogSlug('2026-03-23-when-code-plays-itself')).toBe(
      '2026-03-23-when-code-plays-itself'
    );
  });

  it('strips a .md extension', () => {
    expect(toBlogSlug('my-post.md')).toBe('my-post');
  });

  it('strips a .mdx extension', () => {
    expect(toBlogSlug('my-post.mdx')).toBe('my-post');
  });

  it('only strips the trailing extension', () => {
    expect(toBlogSlug('notes.md.about.mdx')).toBe('notes.md.about');
  });

  it('leaves other extensions alone', () => {
    expect(toBlogSlug('my-post.markdown')).toBe('my-post.markdown');
  });

  it('handles an empty id', () => {
    expect(toBlogSlug('')).toBe('');
  });
});

describe('sortPostsByDate', () => {
  it('sorts newest first', () => {
    const posts = [
      makePost('old', { pubDate: new Date('2026-01-01') }),
      makePost('newest', { pubDate: new Date('2026-05-01') }),
      makePost('middle', { pubDate: new Date('2026-03-01') }),
    ];

    expect(sortPostsByDate(posts).map((post) => post.id)).toEqual([
      'newest',
      'middle',
      'old',
    ]);
  });

  it('keeps posts that share a pubDate', () => {
    const sameDay = new Date('2026-02-01');
    const posts = [
      makePost('a', { pubDate: sameDay }),
      makePost('b', { pubDate: sameDay }),
    ];

    expect(sortPostsByDate(posts)).toHaveLength(2);
  });

  it('does not mutate the input array', () => {
    const posts = [
      makePost('old', { pubDate: new Date('2026-01-01') }),
      makePost('new', { pubDate: new Date('2026-05-01') }),
    ];

    sortPostsByDate(posts);

    expect(posts.map((post) => post.id)).toEqual(['old', 'new']);
  });

  it('returns an empty array when there are no posts', () => {
    expect(sortPostsByDate([])).toEqual([]);
  });
});

describe('buildFeedItems', () => {
  it('builds absolute-path links that match the /blog/[slug] route', () => {
    const items = buildFeedItems([makePost('when-code-plays-itself')]);

    expect(items[0].link).toBe('/blog/when-code-plays-itself/');
  });

  it('never emits an undefined slug for content layer entries', () => {
    const items = buildFeedItems([makePost('a'), makePost('b.mdx')]);

    for (const item of items) {
      expect(item.link).not.toContain('undefined');
    }
    expect(items.map((item) => item.link)).toEqual(['/blog/a/', '/blog/b/']);
  });

  it('carries through title, description and pubDate', () => {
    const pubDate = new Date('2026-04-04');
    const items = buildFeedItems([
      makePost('post', {
        title: 'A Title',
        description: 'A description',
        pubDate,
      }),
    ]);

    expect(items[0]).toEqual({
      title: 'A Title',
      description: 'A description',
      pubDate,
      link: '/blog/post/',
    });
  });

  it('orders items newest first', () => {
    const items = buildFeedItems([
      makePost('older', { pubDate: new Date('2026-02-01') }),
      makePost('newest', { pubDate: new Date('2026-06-01') }),
      makePost('newer', { pubDate: new Date('2026-04-01') }),
    ]);

    expect(items.map((item) => item.link)).toEqual([
      '/blog/newest/',
      '/blog/newer/',
      '/blog/older/',
    ]);
  });

  it('returns an empty feed when there are no posts', () => {
    expect(buildFeedItems([])).toEqual([]);
  });
});
