---
title: "默认图层 - Cesium.js 案例讲解"
description: "默认图层：Cesium Viewer 初始化与场景配置、Cesium 环境 / 水体 / 地形（在线地图）"
head:
  - - meta
    - name: keywords
      content: "cesium.js,layer,defaultLayer"
outline: deep
---

# 默认图层

*默认图层 *

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=layer&id=defaultLayer)

![默认图层](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/layer/defaultLayer.jpg)

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

    imageryProvider: false, //关闭默认底图

    animation: false,//是否创建动画小器件，左下角仪表    

    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮



    skyBox: new Cesium.SkyBox({ show: false })

})

viewer.scene.sun.show = false

viewer.scene.moon.show = false



viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0)

viewer._cesiumWidget._creditContainer.style.display = "none"

console.log(Cesium.VERSION)
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/cesiumExamples/layer/defaultLayer.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=layer&id=defaultLayer) 运行，再对照源码修改 uniform / 参数加深理解


- 下一篇：[坐标参考](/examples/cesium/layer/coordLayer)

> 在线地图 · Cesium.js · 1/12
