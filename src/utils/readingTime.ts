export function calculateReadingTime(body: string): number {
  const wordCount = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}
