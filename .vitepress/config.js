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
      { text: '下载案例源码⚡', link: 'https://pan.quark.cn/s/201da5c82fec' },
      { text: '免费搭建github在线网页教程📖', link: 'https://www.bilibili.com/video/BV12T94YhEQA/?share_source=copy_web&vd_source=f15e5929f6b5d7c615287e0780660f84' },
      { text: '新编辑器🍏', link: 'https://z2586300277.github.io/threejs-editor/' },
      { text: '打赏💰', link: 'https://z2586300277.github.io/3d-file-server/images/wx_star.png' },
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
