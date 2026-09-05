import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { gzipSync } from 'node:zlib'

const root = new URL('../dist/', import.meta.url)
const read = (file) => readFileSync(new URL(file, root), 'utf8')
const html = read('index.html')
assert.match(html, /rel="canonical" href="https:\/\/ironnest\.stevenacz\.com\/"/)
assert.match(html, /name="description"/)
assert.match(html, /property="og:image:alt"/)
assert.match(html, /<noscript[\s>]/)
const graphs = [
  ...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g),
].map((match) => JSON.parse(match[1]))
assert(graphs.some((graph) => graph['@graph']?.some((node) => node['@type'] === 'WebApplication')))
assert(!graphs.some((graph) => JSON.stringify(graph).includes('aggregateRating')))
assert.match(read('robots.txt'), /Sitemap: https:\/\/ironnest\.stevenacz\.com\/sitemap\.xml/)
assert.match(read('sitemap.xml'), /<loc>https:\/\/ironnest\.stevenacz\.com\/<\/loc>/)
const image = readFileSync(new URL('og.png', root))
assert.equal(image.readUInt32BE(16), 1200)
assert.equal(image.readUInt32BE(20), 630)
for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)) {
  const asset = new URL(match[1].slice(1), root)
  assert(existsSync(asset), `Missing build asset: ${match[1]}`)
  if (match[1].endsWith('.js'))
    assert(gzipSync(readFileSync(asset)).length < 160000, 'JavaScript chunk exceeds 160 kB gzip')
}
console.log('SEO, static output and asset budgets verified.')
