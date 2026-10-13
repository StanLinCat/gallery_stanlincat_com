# Stan Gallery

My personal photo gallery: everyday moments, food, sunsets and trips.

**Live site:** https://gallery.stanlincat.com

Built with [Astro](https://astro.build) on the
[Astro Frame Shift](https://github.com/EmaSuriano/astro-frame-shift) theme by
Ema Suriano, and hosted on GitHub Pages.

## Adding photos

1. Put new photos in `photos-inbox/`
2. Double-click `photos-for-site.bat`: photos are rotated, resized to max
   2400px and stripped of GPS/EXIF data, then saved to `src/assets/photos/`
3. Add an entry for each photo to `src/data/gallery.json`:

   ```json
   {
     "src": "../assets/photos/20240926_105548.jpg",
     "alt": "What is in the photo, for screen readers and search engines",
     "title": "Island Beach",
     "description": "A sentence or two shown on the photo page.",
     "categories": ["Travel", "Beach"],
     "date": "2024-09-26",
     "photographer": "StanLinCat"
   }
   ```

   `src` can also be a full image URL (Flickr, Unsplash, ...). Use
   `photos-for-upload.bat` to prepare photos for uploading elsewhere.
   See `photos-README.txt` for step-by-step instructions.

## Site settings

Site name, home heading, description, blog link, share image and analytics
token live in `src/site.ts`. The About and Copyright pages are
`src/pages/about.astro` and `src/pages/copyright.astro`.

## Commands

| Command                      | Action                                     |
| :--------------------------- | :----------------------------------------- |
| `npx yarn@1 install`         | Install dependencies                       |
| `npm run dev`                | Start the local dev server at `localhost:4321` |
| `npx yarn@1 build`           | Check photos and build the site to `dist/` |
| `npx yarn@1 photos`          | Same as `photos-for-site.bat`              |

Pushing to `main` deploys the site automatically
(`.github/workflows/deploy.yml`).

## Syncing theme updates

This repo is a fork of `EmaSuriano/astro-frame-shift`:

```bash
git fetch upstream
git merge upstream/main
```

## License

- **Photos:** © StanLinCat. All rights reserved. Not covered by the MIT
  License. See [LICENSE.md](LICENSE.md) and
  https://gallery.stanlincat.com/copyright/.
- **Code:** MIT License, based on Astro Frame Shift by Ema Suriano.
