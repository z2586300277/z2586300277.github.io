---
title: "默认图层 - Cesium.js 案例讲解"
description: "Cesium 在线底图图层。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,默认图层"
outline: deep
---

# 默认图层

*Default Layer*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=layer&id=defaultLayer)


![默认图层](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/layer/defaultLayer.jpg)


## 效果说明

Cesium 在线底图图层。

> 在线地图 · Cesium.js

## 源码

```js
import * as Cesium from 'cesium'

// Cesium官网的token
Cesium.Ion.defaultAccessToken = "your-cesium-ion-access-token"

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {

    imageryProvider: false, //关闭默认底图

    animation: false,

    baseLayerPicker: false,

    fullscreenButton: false,

    geocoder: false,

    homeButton: false,

    sceneMode: Cesium.SceneMode.SCENE3D,//初始场景模式

    sceneModePicker: false,

    navigationHelpButton: false,

    selectionIndicator: false,

    timeline: false,

    infoBox: false,

    scene3DOnly: true,//如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源  

    orderIndependentTranslucency: false,

    contextOptions: { webgl: { alpha: true } },

    skyBox: new Cesium.SkyBox({ show: false })

})

viewer.scene.sun.show = false

viewer.scene.moon.show = false

viewer.scene.skyBox.show = false

viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0)

viewer._cesiumWidget._creditContainer.style.display = "none"

console.log(Cesium.VERSION)
```

