import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { file } from "astro/loaders";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Page URL id: English titles become slugs ("Blue Fluid Trails" ->
// blue-fluid-trails). Titles with other characters (e.g. Chinese) would
// slugify to nothing, so those use the image file name instead.
function idFor(item: { title: string; src: string }): string {
  const fromTitle = slugify(item.title);
  if (/^[\x00-\x7F]*$/.test(item.title) && fromTitle) return fromTitle;
  const fileName = item.src.split("?")[0].split("/").pop() ?? "";
  return slugify(fileName.replace(/\.[^.]+$/, ""));
}

const gallery = defineCollection({
  loader: file("src/data/gallery.json", {
    parser: (text) => {
      const data = JSON.parse(text);
      return data.map((item: any) => ({
        ...item,
        id: idFor(item),
      }));
    },
  }),
  // src: a full image URL (Flickr, Unsplash, ...) or a path relative to
  // gallery.json for photos kept in the repo, e.g. "../assets/photos/x.jpg"
  schema: ({ image }) => z.object({
    src: z.union([z.string().url(), image()]),
    alt: z.string(),
    title: z.string(),
    description: z.string(),
    categories: z.array(z.string()).min(1),
    date: z.string(),
    photographer: z.string(),
    photographerLink: z.string().optional(),
  }),
});

export const collections = { gallery };
