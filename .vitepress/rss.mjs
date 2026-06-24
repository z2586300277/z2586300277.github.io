import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve, relative } from 'node:path'
import { SITE_HOST, SITE_NAME, SITE_DESCRIPTION, pageUrl } from './seo.mjs'

function escapeXml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function parseFrontmatter(content) {
  const normalized = content.replace(/^\uFEFF/, '')
  const match = normalized.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---/)
  if (!match) {
    return { title: '', description: '', body: content }
  }

  const block = match[1]
  const readField = (name) => {
    const line = block.split('\n').find((entry) => entry.startsWith(`${name}:`))
    if (!line) return ''
    return line.slice(name.length + 1).trim().replace(/^["']|["']$/g, '')
  }

  return {
    title: readField('title'),
    description: readField('description'),
    body: normalized.slice(match[0].length)
  }
}

function extractImage(body) {
  const match = body.match(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/)
  return match?.[1] || null
}

function walkMarkdownFiles(dir, srcDir, files = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      walkMarkdownFiles(fullPath, srcDir, files)
      continue
    }
    if (!entry.endsWith('.md')) continue
    files.push({
      relativePath: relative(srcDir, fullPath).replace(/\\/g, '/'),
      mtime: stat.mtimeMs
    })
  }
  return files
}

export async function generateRss(siteConfig) {
  const srcDir = siteConfig.srcDir || process.cwd()
  const examplesDir = join(srcDir, 'examples')
  const files = walkMarkdownFiles(examplesDir, srcDir)

  const articles = files.map(({ relativePath, mtime }) => {
    const content = readFileSync(join(srcDir, relativePath), 'utf-8')
    const { title, description, body } = parseFrontmatter(content)

    return {
      title: title || '案例讲解',
      description: description || SITE_DESCRIPTION,
      link: pageUrl(relativePath),
      image: extractImage(body),
      date: mtime
    }
  })

  const sorted = articles.sort((a, b) => b.date - a.date)
  const buildDate = new Date().toUTCString()

  const items = sorted
    .map(
      (item) => `<item>
  <title>${escapeXml(item.title)}</title>
  <link>${item.link}</link>
  <guid isPermaLink="true">${item.link}</guid>
  <description>${escapeXml(item.description)}</description>
  <pubDate>${new Date(item.date).toUTCString()}</pubDate>${item.image ? `\n  <enclosure url="${escapeXml(item.image)}" type="image/jpeg"/>` : ''}
</item>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)} - 案例文章</title>
    <link>${SITE_HOST}/examples/</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${SITE_HOST}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  const outDir = siteConfig.outDir || resolve(srcDir, '.vitepress/dist')
  writeFileSync(resolve(outDir, 'feed.xml'), xml, 'utf-8')
}
