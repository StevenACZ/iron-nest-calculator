import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

const hash = async (source: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(source))
  return `'sha256-${btoa(String.fromCharCode(...new Uint8Array(digest)))}'`
}

const contentSecurityPolicy = (): Plugin => ({
  name: 'content-security-policy',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    async handler(html) {
      const inlineScripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)]
      const hashes = await Promise.all(inlineScripts.map(([, source]) => hash(source)))
      const csp = [
        "default-src 'self'",
        `script-src 'self' https://static.cloudflareinsights.com ${hashes.join(' ')}`,
        "style-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self' https://cloudflareinsights.com",
        "base-uri 'self'",
        "form-action 'none'",
        "object-src 'none'",
        'upgrade-insecure-requests',
      ].join('; ')
      return html.replace(
        '<meta name="viewport"',
        `<meta http-equiv="Content-Security-Policy" content="${csp}" />\n    <meta name="viewport"`,
      )
    },
  },
})

export default defineConfig({
  plugins: [vue(), contentSecurityPolicy()],
})
