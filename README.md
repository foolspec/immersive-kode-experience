# ORANGE SIGNAL / Immersive Prototype

An experimental React + Three.js web experience inspired by immersive digital art direction.

## Concept

This project prioritizes emotional visual storytelling over conventional UX:

- Fashion editorial tone mixed with tech-lab aesthetics
- Non-linear narrative sections and fragmented typography
- Hybrid horizontal + vertical scrolling choreography
- Cursor-reactive lighting and subtle distortion overlays
- Lazy-loaded Three.js hero sculpture with custom shader material

## Stack

- React + Vite
- Three.js + React Three Fiber
- Custom hooks for reveal, scroll progress, cursor field, and ambient audio

## Structure

- `src/components` reusable visual and layout modules
- `src/hooks` reusable interaction/animation hooks
- `src/data/storyData.js` narrative and menu content model

## Run

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Deploy

This is a standard Vite app and can be deployed to Vercel, Netlify, Cloudflare Pages, or any static host.
