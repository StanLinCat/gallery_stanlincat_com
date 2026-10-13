import type { ImageMetadata } from 'astro';

// Thumbnail size props for <Image>. Remote URLs need both dimensions;
// repo photos only get a width so Astro keeps their aspect ratio
// instead of cropping them square.
export function thumbSize(src: string | ImageMetadata) {
  return typeof src === 'string'
    ? { width: 800, height: 800 }
    : { width: Math.min(src.width, 800) };
}
