---
title: "OGC- wms服务 - Cesium.js 案例讲解"
description: "本案例展示 **OGC- wms服务 ** 的实现。涉及：Cesium Viewer 初始化、Cesium 影像图层。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,webgl,layer,OGC- wms服务"
outline: deep
---
# OGC- wms服务

*OGC- WMS*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=layer&id=wms)

![OGC- wms服务](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/layer/wms.jpg)

## 你将学到什么

- Cesium Viewer 初始化
- Cesium 影像图层

## 效果说明

本案例展示 **OGC- wms服务 ** 的实现。涉及：Cesium Viewer 初始化、Cesium 影像图层。

> 在线地图 · Cesium.js

## 核心概念

- **Viewer** 封装地球、相机、图层；可关闭 animation/timeline 等 UI 精简界面。

- **ImageryLayer** 叠加 XYZ/WMTS/ArcGIS 等底图，`imageryLayers.add/remove` 管理。

## 实现步骤

1. 初始化 `Cesium.Viewer` 与底图图层
2. 添加 Entity / Primitive / DataSource 等业务对象
3. 按需 `camera.flyTo` 定位视角

## 源码

```js
import * as Cesium from 'cesium'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {
    imageryProvider: false,
    animation: false,//是否创建动画小器件，左下角仪表    
    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮
    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮
    geocoder: false,//是否显示geocoder小器件，右上角查询按钮    
    homeButton: false,//是否显示Home按钮，右上角home按钮 
    sceneMode: Cesium.SceneMode.SCENE3D,//初始场景模式
    sceneModePicker: false,//是否显示3D/2D选择器，右上角按钮 
    navigationHelpButton: false,//是否显示右上角的帮助按钮  
    selectionIndicator: false,//是否显示选取指示器组件   
    timeline: false,//是否显示时间轴    
    infoBox: false,//是否显示信息框   
    scene3DOnly: true,//如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源  
    orderIndependentTranslucency: false, //是否启用无序透明
    contextOptions: { webgl: { alpha: true } },
    skyBox: new Cesium.SkyBox({ show: false })
})

// 加载wms
let wms = new Cesium.WebMapServiceImageryProvider({
    url: "https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi?",
    layers: "nexrad-n0r",
    credit: "demo",
    parameters: {
        transparent: "true",
        format: "image/png",
    },
})
viewer.imageryLayers.addImageryProvider(wms)
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=layer&id=wms) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [在线地图目录](/examples/cesium/layer/)

> 在线地图 · Cesium.js
