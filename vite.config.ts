import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Two builds from one codebase:
// - default: a static site in docs/ (served by GitHub Pages) that installs as a PWA
// - artifact: one self-contained HTML file for a claude.ai artifact (no PWA files, no service worker)
const stripPwa = (): Plugin => ({
  name: 'strip-pwa',
  transformIndexHtml: (html) => html.replace(/<!--pwa-->[\s\S]*?<!--\/pwa-->/g, ''),
});

export default defineConfig(({ mode }) => {
  const artifact = mode === 'artifact';
  return {
    base: './',
    publicDir: artifact ? false : 'public',
    plugins: artifact ? [react(), viteSingleFile(), stripPwa()] : [react()],
    build: { outDir: artifact ? 'dist-artifact' : 'docs', emptyOutDir: true },
    define: { __ARTIFACT__: JSON.stringify(artifact) },
  };
});
