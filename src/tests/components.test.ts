import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import YouTubeEmbed from '../components/YouTubeEmbed.astro';

describe('YouTubeEmbed component', () => {
  it('renders an iframe with the correct nocookie src', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(YouTubeEmbed, {
      props: { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    });
    expect(html).toContain('youtube-nocookie.com/embed/dQw4w9WgXcQ');
    expect(html).toContain('<iframe');
  });

  it('includes start param in src when start prop is provided', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(YouTubeEmbed, {
      props: { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', start: 42 },
    });
    expect(html).toContain('start=42');
  });

  it('uses the provided title on the iframe', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(YouTubeEmbed, {
      props: { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'My video' },
    });
    expect(html).toContain('title="My video"');
  });

  it('throws when given an invalid id prop', async () => {
    const container = await AstroContainer.create();
    await expect(
      container.renderToString(YouTubeEmbed, { props: { id: 'bad-id' } })
    ).rejects.toThrow('valid 11-character');
  });
});
