export const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export function isValidVideoId(value: string): boolean {
  return VIDEO_ID_PATTERN.test(value);
}

export function getVideoId(inputUrl?: string): string | undefined {
  if (!inputUrl) return undefined;

  try {
    const parsed = new URL(inputUrl);
    const hostname = parsed.hostname.toLowerCase();
    const shortHosts = new Set(['youtu.be', 'www.youtu.be']);
    const youtubeHosts = new Set([
      'youtube.com',
      'www.youtube.com',
      'm.youtube.com',
      'youtube-nocookie.com',
      'www.youtube-nocookie.com',
    ]);

    if (shortHosts.has(hostname)) {
      const firstSegment = parsed.pathname.split('/').filter(Boolean)[0];
      return firstSegment && isValidVideoId(firstSegment)
        ? firstSegment
        : undefined;
    }

    if (youtubeHosts.has(hostname)) {
      const fromQuery = parsed.searchParams.get('v');
      if (fromQuery && isValidVideoId(fromQuery)) return fromQuery;

      const pathMatch = parsed.pathname.match(
        /\/(?:embed|shorts|live)\/([^/?#]+)/
      );
      if (pathMatch?.[1] && isValidVideoId(pathMatch[1])) return pathMatch[1];
    }
  } catch {
    return undefined;
  }

  return undefined;
}

export function resolveVideoId(url?: string, id?: string): string {
  const trimmedId = typeof id === 'string' ? id.trim() : undefined;

  if (trimmedId && !isValidVideoId(trimmedId)) {
    throw new Error(
      'YouTubeEmbed `id` must be a valid 11-character YouTube video ID.'
    );
  }

  const videoId = trimmedId ?? getVideoId(url);

  if (!videoId) {
    throw new Error(
      'YouTubeEmbed requires either a valid `id` or a valid YouTube `url` prop.'
    );
  }

  return videoId;
}

export function buildEmbedSrc(videoId: string, start?: number): string {
  const params = new URLSearchParams({ rel: '0', modestbranding: '1' });

  if (typeof start === 'number' && Number.isFinite(start)) {
    const safeStart = Math.min(Math.floor(start), 2147483647);
    if (safeStart > 0) params.set('start', String(safeStart));
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}
