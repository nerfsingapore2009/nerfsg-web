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
  build: {
    rollupOptions: {
      output: {
        /* Vendor code splits away from app code so the two cache separately.
           Firebase is by far the largest dependency here and it changes on its
           own release cadence, not ours — without this split, every copy edit
           we ship re-downloads the whole SDK for every returning visitor.
           React is separated for the same reason. */
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          /* Analytics is deliberately NOT folded into the firebase chunk.
             firebase/config.js imports it dynamically so that visitors who
             decline (or ignore) the cookie banner never download it — naming a
             chunk here would pull it back into the eager bundle and undo that,
             leaving the code shipped to everyone and only its execution gated. */
          if (id.includes('/@firebase/analytics') || id.includes('/firebase/analytics')) return

          if (id.includes('/firebase/') || id.includes('/@firebase/')) return 'firebase'
          if (id.includes('/react-router')) return 'router'
          if (id.includes('/react-dom/') || id.includes('/react/')) return 'react'
        },
      },
    },
  },
})
