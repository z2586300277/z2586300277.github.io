import { defineConfig } from 'vitepress'
import examplesSidebar from './examples-sidebar.mjs'

export default defineConfig({
  title: "优雅永不过时",
  base: '/',
  description: "WebGL Three.js Cesium.js 三维可视化 - 案例讲解与技术分享",
  sitemap: {
    hostname: 'https://z2586300277.github.io'
  },
  head: [
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
    logo: 'https://z2586300277.github.io/site.png',
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
