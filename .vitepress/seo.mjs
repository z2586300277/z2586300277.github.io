import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export const SITE_HOST = 'https://z2586300277.github.io'
export const SITE_NAME = '优雅三维'
export const SITE_DESCRIPTION =
  'Three.js / Cesium.js / WebGL 三维可视化教程与 380+ 开源案例讲解，涵盖着色器、粒子特效、数字孪生与智慧城市应用。'
export const SITE_IMAGE = `${SITE_HOST}/site.png`
export const SITE_KEYWORDS =
  'Three.js,Cesium.js,WebGL,三维可视化,数字孪生,智慧城市,着色器,GLSL,开源案例,教程'
export const SITE_AUTHOR = 'z2586300277'

const CATEGORY_LABELS = {
  three: 'Three.js',
  cesium: 'Cesium.js',
  introduction: '入门案例',
  basic: '基础案例',
  shader: '着色器',
  particle: '粒子',
  game: '游戏复刻',
  application: '应用场景',
  animation: '动画效果',
  physics: '物理应用',
  expand: '扩展功能',
  effectComposer: '后期处理',
  tools: '相关工具',
  friendStation: '首页导航',
  layer: '在线地图',
  offline: '离线地图',
  singleEffect: '单一效果',
  advancedEffect: '高级特效',
  applyExample: '应用相关',
  topStation: '首页导航'
}

export function pageUrl(relativePath) {
  if (!relativePath || relativePath === 'index.md') {
    return `${SITE_HOST}/`
  }
  return `${SITE_HOST}/${relativePath.replace(/\.md$/, '.html')}`
}

function extractArticleImage(srcDir, relativePath) {
  try {
    const content = readFileSync(join(srcDir, relativePath), 'utf-8').replace(/^\uFEFF/, '')
    const body = content.replace(/^---[\s\S]*?---\n/, '')
    const match = body.match(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/)
    return match?.[1] || null
  } catch {
    return null
  }
}

function parseArticleCategory(relativePath) {
  const parts = relativePath.replace(/\.md$/, '').split('/')
  if (parts[0] !== 'examples' || parts.length < 3) {
    return null
  }
  const framework = CATEGORY_LABELS[parts[1]] || parts[1]
  const category = CATEGORY_LABELS[parts[2]] || parts[2]
  return { framework, category }
}

function resolveTitle(pageData) {
  const { title, frontmatter } = pageData
  if (frontmatter.layout === 'home') {
    return `${SITE_NAME} | Three.js Cesium.js 三维可视化教程`
  }
  return title ? `${title} | ${SITE_NAME}` : SITE_NAME
}

function extractKeywords(frontmatter) {
  const head = frontmatter.head
  if (!Array.isArray(head)) return undefined
  for (const entry of head) {
    if (Array.isArray(entry) && entry[0] === 'meta' && entry[1]?.name === 'keywords') {
      return entry[1].content
    }
  }
  return undefined
}

function resolveDescription(pageData) {
  return pageData.description || pageData.frontmatter.description || SITE_DESCRIPTION
}

function buildBreadcrumbSchema(relativePath, pageTitle) {
  const items = [
    { '@type': 'ListItem', position: 1, name: '首页', item: SITE_HOST },
    { '@type': 'ListItem', position: 2, name: '案例讲解', item: `${SITE_HOST}/examples/` }
  ]

  const category = parseArticleCategory(relativePath)
  if (!category) {
    return null
  }

  items.push({
    '@type': 'ListItem',
    position: 3,
    name: category.framework,
    item: `${SITE_HOST}/examples/${relativePath.split('/')[1]}/`
  })

  const parts = relativePath.replace(/\.md$/, '').split('/')
  const pageName = pageTitle.split(' | ')[0]

  if (parts.length >= 4 && parts[parts.length - 1] !== 'index') {
    const section = parts[2]
    items.push({
      '@type': 'ListItem',
      position: 4,
      name: category.category,
      item: `${SITE_HOST}/examples/${parts[1]}/${section}/`
    })
    items.push({
      '@type': 'ListItem',
      position: 5,
      name: pageName
    })
  } else {
    items.push({
      '@type': 'ListItem',
      position: 4,
      name: pageName
    })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items
  }
}

function buildJsonLd(pageData, pageTitle, pageDesc, url, image) {
  if (pageData.frontmatter.layout === 'home') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_HOST,
      description: pageDesc,
      inLanguage: 'zh-CN',
      author: {
        '@type': 'Person',
        name: SITE_AUTHOR,
        url: 'https://github.com/z2586300277'
      }
    }
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: pageData.title || pageTitle,
    description: pageDesc,
    url,
    inLanguage: 'zh-CN',
    image,
    author: {
      '@type': 'Person',
      name: SITE_AUTHOR,
      url: 'https://github.com/z2586300277'
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: SITE_IMAGE
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  }

  const category = parseArticleCategory(pageData.relativePath)
  if (category) {
    schema.articleSection = `${category.framework} / ${category.category}`
    const keywords = extractKeywords(pageData.frontmatter)
    if (keywords) {
      schema.keywords = keywords
    }
  }

  if (pageData.lastUpdated) {
    schema.dateModified = new Date(pageData.lastUpdated).toISOString()
  }

  return schema
}

export function transformPageData(pageData, { siteConfig }) {
  const pageTitle = resolveTitle(pageData)
  const pageDesc = resolveDescription(pageData)
  const url = pageUrl(pageData.relativePath)
  const isArticle = pageData.relativePath?.startsWith('examples/')

  let image = pageData.frontmatter.image || SITE_IMAGE
  if (isArticle && siteConfig?.srcDir) {
    image = extractArticleImage(siteConfig.srcDir, pageData.relativePath) || image
  }

  pageData.frontmatter.head ??= []
  const head = pageData.frontmatter.head

  head.push(
    ['link', { rel: 'canonical', href: url }],
    ['meta', { property: 'og:type', content: pageData.frontmatter.layout === 'home' ? 'website' : 'article' }],
    ['meta', { property: 'og:site_name', content: SITE_NAME }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:title', content: pageTitle }],
    ['meta', { property: 'og:description', content: pageDesc }],
    ['meta', { property: 'og:url', content: url }],
    ['meta', { property: 'og:image', content: image }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: pageTitle }],
    ['meta', { name: 'twitter:description', content: pageDesc }],
    ['meta', { name: 'twitter:image', content: image }]
  )

  if (isArticle) {
    head.push(['meta', { name: 'robots', content: 'index, follow, max-image-preview:large' }])
    if (pageData.lastUpdated) {
      head.push([
        'meta',
        { property: 'article:modified_time', content: new Date(pageData.lastUpdated).toISOString() }
      ])
    }
    head.push(['meta', { property: 'article:author', content: SITE_AUTHOR }])
    const category = parseArticleCategory(pageData.relativePath)
    if (category) {
      head.push(['meta', { property: 'article:section', content: `${category.framework} / ${category.category}` }])
    }
  }

  head.push([
    'script',
    { type: 'application/ld+json' },
    JSON.stringify(buildJsonLd(pageData, pageTitle, pageDesc, url, image))
  ])

  const breadcrumb = isArticle ? buildBreadcrumbSchema(pageData.relativePath, pageTitle) : null
  if (breadcrumb) {
    head.push(['script', { type: 'application/ld+json' }, JSON.stringify(breadcrumb)])
  }
}

export function transformSitemapItems(items) {
  return items
    .filter((item) => !/\/README\.html$/.test(item.url))
    .map((item) => {
      let pathname = item.url
      try {
        pathname = new URL(item.url).pathname.replace(/\/index\.html$/, '/')
      } catch {
        pathname = item.url.replace(/\/index\.html$/, '/')
      }

      let priority = 0.6
      let changefreq = 'monthly'

      if (pathname === '/' || pathname === '/index.html') {
        priority = 1
        changefreq = 'weekly'
      } else if (pathname === '/examples/' || pathname === '/examples') {
        priority = 0.9
        changefreq = 'weekly'
      } else if (pathname.startsWith('/examples/')) {
        priority = 0.8
        changefreq = 'monthly'
      }

      return { ...item, changefreq, priority }
    })
}
