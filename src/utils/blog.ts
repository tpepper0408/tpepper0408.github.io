export interface BlogEntryLike {
  id: string;
  data: {
    title: string;
    description: string;
    pubDate: Date;
  };
}

export interface FeedItem {
  title: string;
  description: string;
  pubDate: Date;
  link: string;
}

/**
 * Astro's content layer exposes entry ids (e.g. `my-post` or `my-post.md`
 * depending on the loader), not the pre-5.x `slug` property. Normalise to the
 * route segment used by `/blog/[slug]`.
 */
export function toBlogSlug(id: string): string {
  return id.replace(/\.(md|mdx)$/u, '');
}

/** Posts ordered newest first, without mutating the input. */
export function sortPostsByDate<T extends BlogEntryLike>(posts: T[]): T[] {
  return [...posts].sort(
    (a, b) =>
      new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf()
  );
}

/** Build RSS items for every post, newest first. */
export function buildFeedItems(posts: BlogEntryLike[]): FeedItem[] {
  return sortPostsByDate(posts).map((post) => ({
    title: post.data.title,
    description: post.data.description,
    pubDate: post.data.pubDate,
    link: `/blog/${toBlogSlug(post.id)}/`,
  }));
}
