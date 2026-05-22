---
title: "地形 - Cesium.js 案例讲解"
description: "场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,地形"
outline: deep
---

# 地形

*Terrain*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=layer&id=terrainLayer)


![地形](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/layer/terrainLayer.jpg)


## 效果说明

场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。

> 在线地图 · Cesium.js

## 源码

```js
import * as Cesium from 'cesium'

// 如果出现地图没加载出地球 可能是多人访问公用token导致的问题,换成你自己的token 就好
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjOTVhZGI5Zi0wMTYzLTQ2MWEtYTBjYS02OTc5ZGNkNTY3ZDMiLCJpZCI6NTcwNzEsImlhdCI6MTc2MjQ3OTkyNH0.1bx7V2IFDE_Id5uqrQx-pJvRlzH34NDa2zc8vDY-Y0w"

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {

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

// 加载地形
// viewer.terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(3957, {

//     requestWaterMask: true,

//     requestVertexNormals: true

// })

viewer.terrainProvider = await Cesium.createWorld
```

