---
title: "内网高德 - Cesium.js 案例讲解"
description: "内网高德：Cesium Viewer 初始化与场景配置（离线地图）"
head:
  - - meta
    - name: keywords
      content: "cesium.js,offline,gaode"
outline: deep
---

# 内网高德

*内网高德 *

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=offline&id=gaode)

![内网高德](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/offline/gaode.jpg)

## 你将学到什么

- Cesium Viewer 初始化与场景配置

## 效果说明

Cesium 地球场景。打开在线案例可查看最终画面。

## 核心概念

- **Viewer** 封装地球、相机、图层与 clock；可关闭 animation/timeline 精简 UI。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 按需 flyTo 定位视角
3. 注册拾取 / 绘制 / 漫游等交互

## 代码要点

```js
const viewer = new Cesium.Viewer(box, {

    animation: false,//是否创建动画小器件，左下角仪表    

    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮

    baseLayer: false, // 不显示默认图层



    new Cesium.UrlTemplateImageryProvider({

        url: FILE_HOST + 'map/Gaode/tiles/{z}/{x}/{y}.png',

        maximumLevel: 5,

        minimumLevel: 3,
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/cesiumExamples/offline/gaode.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=offline&id=gaode) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[内网百度](/examples/cesium/offline/baiDu)
- 下一篇：[高德纠偏](/examples/cesium/offline/gaodeTrans)

> 离线地图 · Cesium.js · 6/7
