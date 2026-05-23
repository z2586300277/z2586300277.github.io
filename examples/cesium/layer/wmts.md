---
title: "OGC- wmts服务 - Cesium.js 案例讲解"
description: "OGC- wmts服务：Cesium Viewer 初始化与场景配置、Cesium 环境 / 水体 / 地形（在线地图）"
head:
  - - meta
    - name: keywords
      content: "cesium.js,layer,wmts"
outline: deep
---

# OGC- wmts服务

*OGC- wmts服务 *

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=CesiumJS&classify=layer&id=wmts)

![OGC- wmts服务](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/layer/wmts.jpg)

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
    animation: false,//是否创建动画小器件，左下角仪表    
    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮
    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮
    imageryProvider: false,
    geocoder: false,//是否显示geocoder小器件，右上角查询按钮    
    homeButton: false,//是否显示Home按钮，右上角home按钮 
    sceneMode: Cesium.SceneMode.SCENE3D,//初始场景模式

    contextOptions: { webgl: { alpha: true } },
    skyBox: new Cesium.SkyBox({ show: false })
})


// 加载天地图wmts
var _layer = 'vec';
var token = 'bcc62222fc634ec736589c483de933e6';
var maxLevel = 18;

var _url = 'https://t{s}.tianditu.gov.cn/' + _layer + '_c/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={TileMatrix}&layer=' + _layer + '&style={style}&tilerow={TileRow}&tilecol={TileCol}&tilematrixset={TileMatrixSet}&format=tiles&tk=' + token;
var wmts = new Cesium.WebMapTileServiceImageryProvider({
    url: _url,
    layer: _l
// ...
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/cesiumExamples/layer/wmts.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=CesiumJS&classify=layer&id=wmts) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[OGC- wms服务](/examples/cesium/layer/wms)
- 下一篇：[地形](/examples/cesium/layer/terrainLayer)

> 在线地图 · Cesium.js · 11/12
