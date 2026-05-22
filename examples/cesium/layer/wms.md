---
title: "OGC- wms服务 - Cesium.js 案例讲解"
description: "OGC- wms服务：Cesium Viewer 初始化与场景配置、Cesium 环境 / 水体 / 地形（在线地图）"
head:
  - - meta
    - name: keywords
      content: "cesium.js,layer,wms"
outline: deep
---

# OGC- wms服务

*OGC- wms服务 *

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=layer&id=wms)

![OGC- wms服务](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/layer/wms.jpg)

## 你将学到什么

- Cesium Viewer 初始化与场景配置
- Cesium 环境 / 水体 / 地形

## 效果说明

Cesium 地球场景。打开在线案例可查看最终画面。

## 核心概念

- **Viewer** 封装地球、相机、图层与 clock；可关闭 animation/timeline 精简 UI。
- SkyBox 六面图换天空；Water 用法线贴图 + time；地形需 depthTestAgainstTerrain。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 配置 scene.skyBox / Water / globe 参数
3. 按需 flyTo 定位视角
4. 注册拾取 / 绘制 / 漫游等交互

## 代码要点

```js
const viewer = new Cesium.Viewer(box, {
    imageryProvider: false,
    animation: false,//是否创建动画小器件，左下角仪表    
    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮
    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮
    geocoder: false,//是否显示geocoder小器件，右上角查询按钮    
    homeButton: false,//是否显示Home按钮，右上角home按钮 
    sceneMode: Cesium.SceneMode.SCENE3D,//初始场景模式

    contextOptions: { webgl: { alpha: true } },
    skyBox: new Cesium.SkyBox({ show: false })
})


// 加载wms
let wms = new Cesium.WebMapServiceImageryProvider({
    url: "https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi?",
    layers: "nexrad-n0r",
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/cesiumExamples/layer/wms.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=layer&id=wms) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[OGC- tms服务](/examples/cesium/layer/tms)
- 下一篇：[OGC- wmts服务](/examples/cesium/layer/wmts)

> 在线地图 · Cesium.js · 10/12
