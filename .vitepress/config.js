import { defineConfig, loadEnv } from 'vitepress'

export default defineConfig({
  title: "优雅永不过时",
  base: '/',
  description: "优雅永不过时的个人主页",
  themeConfig: {
    logo: 'https://z2586300277.github.io/three-editor/dist/site.png',
    nav: [
      { text: 'BiBi📺', link: 'https://space.bilibili.com/245165721' },
      { text: 'CSDN📘', link: 'https://blog.csdn.net/guang2586' }
    ],
    footer: {
        copyright: `版权所有 ©2019-2025 优雅永不过时`,
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/z2586300277' }
    ]
  },

})
