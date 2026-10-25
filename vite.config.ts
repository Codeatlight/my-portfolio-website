import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { projects } from './src/data/projects.ts'

/*
 * Public address of the deployed site, e.g. https://parth.onrender.com
 * Social sites need absolute URLs for link-preview images; when this is
 * empty, pages still get their own titles and descriptions, just no image.
 */
const SITE_URL = (process.env.SITE_URL ?? '').replace(/\/$/, '')

const escapeAttr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Replace the content="" of a <meta> tag matched by its name/property attribute. */
function setMeta(html: string, key: string, value: string) {
  const re = new RegExp(`(<meta (?:name|property)="${key}" content=")[^"]*(")`)
  return html.replace(re, (_, open: string, close: string) => open + escapeAttr(value) + close)
}

function absoluteTags(path: string, image?: string) {
  if (!SITE_URL) return ''
  return [
    `<link rel="canonical" href="${SITE_URL}${path}" />`,
    `<meta property="og:url" content="${SITE_URL}${path}" />`,
    image ? `<meta property="og:image" content="${SITE_URL}${image}" />` : '',
    image ? `<meta name="twitter:image" content="${SITE_URL}${image}" />` : '',
  ].join('\n    ')
}

/**
 * Writes dist/projects/<id>/index.html for every project: the same app shell
 * with that project's title and description. Shared links then work on any
 * static host (no rewrite rules) and preview correctly on LinkedIn/WhatsApp.
 */
function projectPages(): Plugin {
  let outDir = ''
  return {
    name: 'project-pages',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    transformIndexHtml(html) {
      return html.replace('</head>', `  ${absoluteTags('/', '/profile.jpg')}\n  </head>`)
    },
    closeBundle() {
      const shell = readFileSync(join(outDir, 'index.html'), 'utf-8')
      const urls = ['/']

      for (const p of projects) {
        const path = `/projects/${p.id}/`
        const title = `${p.title} — ${p.subtitle} | Parth Shandilya`
        let html = shell
          .replace(/<title>[^<]*<\/title>/, () => `<title>${escapeAttr(title)}</title>`)
          .replace(/\s*<link rel="canonical"[^>]*>|\s*<meta (?:property|name)="(?:og:url|og:image|twitter:image)"[^>]*>/g, '')
        for (const key of ['og:title', 'twitter:title']) html = setMeta(html, key, title)
        for (const key of ['description', 'og:description', 'twitter:description']) html = setMeta(html, key, p.description)
        html = html.replace('</head>', `  ${absoluteTags(path, p.image || '/profile.jpg')}\n  </head>`)

        const dir = join(outDir, 'projects', p.id)
        mkdirSync(dir, { recursive: true })
        writeFileSync(join(dir, 'index.html'), html)
        urls.push(path)
      }

      if (SITE_URL) {
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
          .map((u) => `  <url><loc>${SITE_URL}${u}</loc></url>`)
          .join('\n')}\n</urlset>\n`
        writeFileSync(join(outDir, 'sitemap.xml'), sitemap)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    projectPages(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
