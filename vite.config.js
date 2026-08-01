import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { realpathSync } from 'node:fs'

/* This repo is commonly opened through a junction
   (C:\Users\simji\nerfsg-web-link -> D:\nerfsg-web). Left alone, Vite's root is
   the junction path while Node resolves asset files to their real location on
   D:, so every asset URL is emitted as an /@fs/D:/... path that falls outside
   the dev server's allow-list. Vite then answers those requests with the SPA
   index.html fallback, so gallery photos arrive as text/html and render broken.
   Pinning root to the resolved real path keeps both halves in agreement — and
   is a no-op when the project is opened via its real path. */
const root = realpathSync(import.meta.dirname)

// https://vite.dev/config/
export default defineConfig({
  root,
  plugins: [react()],
})
