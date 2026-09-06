import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { buildFeedItems } from '../utils/blog.ts';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  const site = context.site;

  if (!site) {
    throw new Error(
      '`site` must be set in astro.config.mjs to build the feed.'
    );
  }

  return rss({
    title: 'Pepper Headspace',
    description:
      'Reflections on technical leadership, building inclusive teams, and navigating the world of software consultancy.',
    site,
    items: buildFeedItems(posts),
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: [
      `<language>en-GB</language>`,
      `<atom:link href="${new URL('rss.xml', site).href}" rel="self" type="application/rss+xml"/>`,
    ].join(''),
  });
}
