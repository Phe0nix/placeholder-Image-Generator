# Placeholder Image Generator

A fast, browser-based tool to generate custom placeholder images, preview them instantly, and export in multiple formats.

#### Demo - [Placeholder Image Generator](https://phe0nix.github.io/placeholder-Image-Generator/)

## Features

- Responsive UI that works across desktop and mobile.
- Instant canvas preview with generated file metadata (size, format, approximate KB).
- Strong width/height validation:
	- whole numbers only
	- allowed range: `1` to `4000`
- Built-in image presets for common use cases.
- Collapsible preset gallery (view more/view fewer).
- Quick size chips for common dimensions.
- Aspect ratio lock for proportional resizing.
- One-click dimension swap.
- Background and text color controls.
- Random palette generator.
- Custom label text (falls back to `WIDTH x HEIGHT` when empty).
- Custom output filename with safe download sanitization.
- Export formats: `PNG`, `JPG`, `WEBP`.
- Quality slider for lossy formats (`JPG`/`WEBP`).
- Download generated image directly.
- Copy generated image as Data URL.
- Copy shareable URL with full current configuration.
- URL-driven state restore on page load.
- Keyboard shortcut behavior: pressing `Enter` in key inputs triggers generation.

## Built-In Image Presets

- `og-image`: `1200 x 630`, optimized for Open Graph sharing.
- `avatar-128`: `128 x 128`, profile/avatar placeholder.
- `card-thumb`: `800 x 450`, card/content thumbnails.
- `hero-banner`: `1440 x 720`, landing page hero blocks.
- `mobile-screen`: `390 x 844`, mobile UI mock dimensions.
- `video-thumb`: `1280 x 720`, video/media thumbnail format.

## How To Use

1. Set width and height, or choose an image preset/quick size.
2. (Optional) Keep aspect ratio lock enabled, or swap dimensions.
3. Pick background and text colors, or use Random Palette.
4. (Optional) Add label text and output filename.
5. Choose export format and quality (for JPG/WEBP).
6. Click Generate Image.
7. Download, copy Data URL, or copy a shareable URL.

## URL Parameters

Use query parameters to preload and share exact configurations.

- `w`, `h`: width and height in pixels.
- `preset`: preset key (for example `og-image`, `avatar-128`).
- `bg`, `fg`: background/text hex colors (for example `#2f80ed`).
- `label`: custom placeholder text.
- `file`: download filename.
- `format`: `png`, `jpeg`, or `webp`.
- `q`: output quality from `10` to `100`.
- `lock`: aspect ratio lock (`1` or `0`).

Example:

```text
?preset=og-image&w=1200&h=630&bg=%230f172a&fg=%23f8fafc&label=Open%20Graph&file=og-image&format=webp&q=90&lock=1
```
