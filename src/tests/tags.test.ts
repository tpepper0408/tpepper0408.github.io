import { describe, it, expect } from 'vitest';
import { aggregateTags } from '../utils/tags.ts';

const makePosts = (tagSets: (string[] | undefined)[]) =>
  tagSets.map((tags) => ({ data: { tags } }));

describe('aggregateTags', () => {
  it('counts tags across multiple posts', () => {
    const posts = makePosts([['a', 'b'], ['a']]);
    const result = aggregateTags(posts);
    expect(result.find((t) => t.tag === 'a')?.count).toBe(2);
    expect(result.find((t) => t.tag === 'b')?.count).toBe(1);
  });

  it('sorts by count descending', () => {
    const posts = makePosts([['common'], ['common', 'rare'], ['common']]);
    const result = aggregateTags(posts);
    expect(result[0].tag).toBe('common');
    expect(result[1].tag).toBe('rare');
  });

  it('handles posts with no tags gracefully', () => {
    const posts = makePosts([undefined, ['a']]);
    const result = aggregateTags(posts);
    expect(result).toHaveLength(1);
    expect(result[0].tag).toBe('a');
  });

  it('returns an empty array when all posts have no tags', () => {
    const posts = makePosts([undefined, undefined]);
    expect(aggregateTags(posts)).toEqual([]);
  });

  it('returns an empty array for an empty posts list', () => {
    expect(aggregateTags([])).toEqual([]);
  });
});
