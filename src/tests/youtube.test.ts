import { describe, it, expect } from 'vitest';
import {
  isValidVideoId,
  getVideoId,
  resolveVideoId,
  buildEmbedSrc,
} from '../utils/youtube.ts';

describe('isValidVideoId', () => {
  it('accepts a valid 11-character ID', () => {
    expect(isValidVideoId('dQw4w9WgXcQ')).toBe(true);
  });

  it('accepts IDs with underscores and hyphens', () => {
    expect(isValidVideoId('abc_def-ghi')).toBe(true);
  });

  it('rejects IDs that are too short', () => {
    expect(isValidVideoId('short')).toBe(false);
  });

  it('rejects IDs that are too long', () => {
    expect(isValidVideoId('dQw4w9WgXcQextra')).toBe(false);
  });

  it('rejects IDs with invalid characters', () => {
    expect(isValidVideoId('dQw4w9WgX!!')).toBe(false);
  });
});

describe('getVideoId', () => {
  it('extracts ID from a standard watch URL', () => {
    expect(getVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from a youtu.be short URL', () => {
    expect(getVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from an /embed/ path', () => {
    expect(getVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from a /shorts/ path', () => {
    expect(getVideoId('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from a /live/ path', () => {
    expect(getVideoId('https://www.youtube.com/live/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('returns undefined for a non-YouTube URL', () => {
    expect(getVideoId('https://vimeo.com/123456')).toBeUndefined();
  });

  it('returns undefined for a watch URL missing the v param', () => {
    expect(getVideoId('https://www.youtube.com/watch')).toBeUndefined();
  });

  it('returns undefined when called with no argument', () => {
    expect(getVideoId()).toBeUndefined();
  });
});

describe('resolveVideoId', () => {
  it('resolves from a valid URL', () => {
    expect(resolveVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('resolves from a direct valid ID', () => {
    expect(resolveVideoId(undefined, 'dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('prefers the id prop over the url prop', () => {
    expect(resolveVideoId('https://youtu.be/aaaaaaaaaaa', 'dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('throws when id is provided but invalid', () => {
    expect(() => resolveVideoId(undefined, 'bad')).toThrow('valid 11-character');
  });

  it('throws when neither url nor id resolve to a valid ID', () => {
    expect(() => resolveVideoId()).toThrow('requires either');
  });
});

describe('buildEmbedSrc', () => {
  it('builds a nocookie embed URL', () => {
    const src = buildEmbedSrc('dQw4w9WgXcQ');
    expect(src).toContain('youtube-nocookie.com/embed/dQw4w9WgXcQ');
  });

  it('includes rel=0 and modestbranding=1 params', () => {
    const src = buildEmbedSrc('dQw4w9WgXcQ');
    expect(src).toContain('rel=0');
    expect(src).toContain('modestbranding=1');
  });

  it('appends a start param when start > 0', () => {
    const src = buildEmbedSrc('dQw4w9WgXcQ', 30);
    expect(src).toContain('start=30');
  });

  it('floors a float start time', () => {
    const src = buildEmbedSrc('dQw4w9WgXcQ', 30.9);
    expect(src).toContain('start=30');
  });

  it('omits start param when start is 0', () => {
    const src = buildEmbedSrc('dQw4w9WgXcQ', 0);
    expect(src).not.toContain('start=');
  });

  it('omits start param when start is Infinity', () => {
    const src = buildEmbedSrc('dQw4w9WgXcQ', Infinity);
    expect(src).not.toContain('start=');
  });
});
