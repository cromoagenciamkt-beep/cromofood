# Project Guide

## Architecture

This is a dependency-free static landing page designed for direct Netlify deployment.

- `index.html`: semantic page structure, content, SEO metadata, and modal markup.
- `style.css`: complete visual system, responsive layouts, motion, and accessibility preferences.
- `script.js`: progressive interactions using browser-native APIs.
- `assets/`: local photography and video assets.
- `netlify.toml`: static publish target plus security and caching headers.

## Conventions

- Keep HTML, CSS, and JavaScript separated.
- Use existing CSS custom properties for colors, typography, spacing, and easing.
- Favor semantic HTML and preserve all ARIA labels when editing interactions.
- Animate only `transform`, `opacity`, and `filter` to avoid layout shifts.
- Maintain graceful behavior when JavaScript is unavailable and honor `prefers-reduced-motion`.
- Do not add frontend frameworks or runtime dependencies unless the project scope changes substantially.

## Content Notes

- The founder portrait is a replaceable editorial placeholder, not Enzo Gomes's official image.
- Contact URLs and case metrics are placeholders that require verified client data before launch.
- The local hero video is intentionally lightweight; preserve a poster image for reliable loading and mobile fallback.
