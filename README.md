# Placeholder-Image-Generator
This is a simple placeholder image generator and downloader. Just fill the appropriate fields and generate image by clicking "Generate Image" and then download with choosing the image extension.<br>

#### Demo - [Placeholder Image Generator](https://phe0nix.github.io/placeholder-Image-Generator/)

## Updated Features
- Responsive, modern UI with better visual hierarchy and mobile support.
- Improved validation for width and height (whole numbers, 1 to 4000).
- Aspect ratio lock and one-click dimension swap.
- Quick size presets (social and widescreen formats).
- Color controls for background and text.
- Custom label text and configurable output filename.
- Export options for PNG, JPG, and WEBP.
- Adjustable quality slider for JPG/WEBP.
- Data URL copy action for quick sharing in design/dev workflows.
- URL-driven configuration so placeholder settings can be shared and restored from the address bar.

## How To Use
1. Enter width and height in pixels.
2. Optional: choose a preset, keep aspect ratio lock, or swap dimensions.
3. Pick background and text colors.
4. Optional: provide label text and filename.
5. Choose format (PNG/JPG/WEBP) and set quality for JPG/WEBP.
6. Click Generate Image.
7. Download the image, copy the data URL, or copy a share URL with the current config.

## URL Parameters
- `w`, `h`: image width and height in pixels.
- `bg`, `fg`: background and text colors as hex values like `#2f80ed`.
- `label`: custom placeholder text.
- `file`: download filename.
- `format`: `png`, `jpeg`, or `webp`.
- `q`: export quality from `10` to `100`.
- `lock`: `1` or `0` for aspect-ratio lock.

Example:

```text
?w=1200&h=630&bg=%232f80ed&fg=%23ffffff&label=Open%20Graph&file=og-image&format=webp&q=85&lock=1
```

## Git Flow

This repository now follows a lightweight Git Flow model with:
- Long-lived branches: `master`, `develop`
- Supporting branches: `feature/*`, `bugfix/*`, `release/*`, `hotfix/*`, `chore/*`, `docs/*`, `test/*`

See the full workflow in [docs/GIT_FLOW.md](docs/GIT_FLOW.md).
