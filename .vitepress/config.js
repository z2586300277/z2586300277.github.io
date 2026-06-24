import { defineConfig } from 'vitepress'
import examplesSidebar from './examples-sidebar.mjs'
import { generateRss } from './rss.mjs'
import {
  SITE_HOST,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_IMAGE,
  SITE_KEYWORDS,
  SITE_AUTHOR,
  transformPageData,
  transformSitemapItems
} from './seo.mjs'

export default defineConfig({
  title: SITE_NAME,
  titleTemplate: ':title | 优雅三维',
  description: SITE_DESCRIPTION,
  lang: 'zh-CN',
  base: '/',
  lastUpdated: true,
  srcExclude: ['README.md'],
  sitemap: {
    hostname: SITE_HOST,
    transformItems: transformSitemapItems
  },
  transformPageData,
  async buildEnd(siteConfig) {
    await generateRss(siteConfig)
  },
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/site.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/site.png' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: `${SITE_NAME} 案例文章`, href: '/feed.xml' }],
    ['meta', { name: 'author', content: SITE_AUTHOR }],
    ['meta', { name: 'keywords', content: SITE_KEYWORDS }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large' }],
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['script', { async: true, src: 'https://www.googletagmanager.com/gtag/js?id=G-LKJQBJNGVF' }],
    ['script', { async: true, src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8697430839896878', crossorigin: 'anonymous' }],
    ['script', {}, `window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-LKJQBJNGVF');`],
    ['script', {}, `var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?85aef82369b0fe002f0e62a775344e89";
      var s = document.getElementsByTagName("script")[0]; 
      s.parentNode.insertBefore(hm, s);
    })();`]
  ],
  themeConfig: {
    logo: SITE_IMAGE,
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '未找到结果',
            resetButtonTitle: '清除',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },
    nav: [
      { text: '案例讲解📖', link: '/examples/' },
      { text: '企业🏬', link: 'http://site.threehub.cn/' },
      { text: '二维码📱', link: '/personalCode.md' },
      { text: '3D展示🍂', link: '/works.md' },
      { text: '资源💙', link: '/resource.md' },
      { text: '简介🐸', link: '/message.md' },
      { text: '赞赏👍', link: '/sponsor.md' },
      { text: 'BiBi📺', link: 'https://space.bilibili.com/245165721' },
      { text: '闲鱼🐟', link: 'https://www.goofish.com/personal?userId=2885508577' },
      // { text: '淘宝🐸', link: 'https://z2586300277.taobao.com/' },
      { text: 'Gitee🐳', link: 'https://gitee.com/zhang-jingguang' },
      { text: 'CSDN📘', link: 'https://blog.csdn.net/guang2586' }
    ],
    sidebar: {
      '/examples/': examplesSidebar
    },
    footer: {
      copyright: `<img src="https://visitor-badge.laobi.icu/badge?page_id=z2586300277" style="float:left" > 版权所有 ©2019-${new Date().getFullYear()} 2586300277@qq.com 优雅永不过时 `
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/z2586300277' }
    ]
  },

})
