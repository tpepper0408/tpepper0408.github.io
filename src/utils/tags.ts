export interface TagCount {
  tag: string;
  count: number;
}

export function aggregateTags(
  posts: Array<{ data: { tags?: string[] } }>
): TagCount[] {
  const counts: Record<string, number> = {};
  for (const post of posts) {
    post.data.tags?.forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
  }
  return Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
