import { defineConfig, loadEnv } from 'vitepress'

export default defineConfig({
  title: "优雅永不过时",
  base: '/',
  description: "优雅永不过时的个人主页",
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
    logo: 'https://z2586300277.github.io/three-editor/dist/site.png',
    nav: [
      { text: '赞赏👍', link: '/sponsor.md' },
      { text: '作者资源💙', link: '/resource.md' },
      { text: '新编辑器🍏', link: 'https://z2586300277.github.io/threejs-editor/' },
      { text: 'QQ群🐧', link: 'https://qm.qq.com/q/QdsKkzo2gI' },
      { text: 'BiBi📺', link: 'https://space.bilibili.com/245165721' },
      { text: 'CSDN📘', link: 'https://blog.csdn.net/guang2586' }
    ],
    footer: {
        copyright: `<img src="https://visitor-badge.laobi.icu/badge?page_id=z2586300277" style="float:left" > 版权所有 ©2019-2025 优雅永不过时`,
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/z2586300277' }
    ]
  },

})
