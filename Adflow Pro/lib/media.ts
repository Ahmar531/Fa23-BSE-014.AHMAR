import { MediaSourceType } from './types';

/**
 * Normalize external media URLs to thumbnails
 */
export function normalizeMediaUrl(url: string): {
  sourceType: MediaSourceType;
  normalizedUrl: string;
  youtubeId?: string;
} {
  // YouTube detection
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  
  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    return {
      sourceType: 'youtube',
      normalizedUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      youtubeId: videoId,
    };
  }

  // GitHub raw detection
  if (url.includes('raw.githubusercontent.com') || url.includes('github.com') && url.includes('/raw/')) {
    return {
      sourceType: 'github_raw',
      normalizedUrl: url,
    };
  }

  // Direct image
  if (/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url)) {
    return {
      sourceType: 'direct_image',
      normalizedUrl: url,
    };
  }

  // Fallback
  return {
    sourceType: 'other',
    normalizedUrl: url,
  };
}

/**
 * Get placeholder image URL
 */
export function getPlaceholderImage(): string {
  return 'https://placehold.co/600x400/e2e8f0/64748b?text=No+Image';
}
