import { describe, it, expect } from 'vitest';
import { calculateReadingTime } from '../utils/readingTime.ts';

describe('calculateReadingTime', () => {
  it('returns 1 for exactly 200 words', () => {
    const body = 'word '.repeat(200).trim();
    expect(calculateReadingTime(body)).toBe(1);
  });

  it('rounds up: 201 words → 2 minutes', () => {
    const body = 'word '.repeat(201).trim();
    expect(calculateReadingTime(body)).toBe(2);
  });

  it('returns at least 1 for an empty string', () => {
    expect(calculateReadingTime('')).toBe(1);
  });

  it('returns at least 1 for whitespace-only input', () => {
    expect(calculateReadingTime('   \n\t  ')).toBe(1);
  });

  it('handles a typical post length (2500 words) → 13 minutes', () => {
    const body = 'word '.repeat(2500).trim();
    expect(calculateReadingTime(body)).toBe(13);
  });
});
