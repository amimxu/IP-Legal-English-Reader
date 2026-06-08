# IP Legal English Reader

A Vite/React legal English study reader built around Phillips v. AWH.

## Run Locally

**Prerequisites:** Node.js 22

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Deploy to Cloudflare Pages

Connect this repository in Cloudflare Pages and use these build settings:

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: `22`

The `public/_redirects` file is included so direct visits to app routes can fall back to `index.html`.
