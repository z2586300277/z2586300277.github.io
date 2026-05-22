---
title: "视角切换 - Cesium.js 案例讲解"
description: "Cesium Scene/Camera/Renderer 基础搭建。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,视角切换,基础功能"
outline: deep
---

# 视角切换

*Switch View*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=switchView)


![视角切换](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/switchView.jpg)


## 效果说明

Cesium Scene/Camera/Renderer 基础搭建。

> 基础功能 · Cesium.js

## 实现思路

- Entity.model 加载 glTF/glb，`minimumPixelSize` 保证远距离仍可见。

- 3D Tiles 倾斜摄影/白膜：`Cesium3DTileset.fromUrl`，可配 `heightReference`、style。

- 底图换 `ImageryProvider`：XYZ 模板、WMTS、ArcGIS 等，挂到 `viewer.imageryLayers`。

## 源码

```js
import * as Cesium from 'cesium'
import { GUI } from 'dat.gui'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {

    animation: false,

    baseLayerPicker: false,

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')),

    fullscreenButton: false,

    timeline: false,

    infoBox: false,

})

// 天地图注记图层
viewer.imageryLayers.addImageryProvider(

    new Cesium.WebMapTileServiceImageryProvider({

        url: "https://t0.tianditu.gov.cn/cva_w/wmts?tk=c4e3a9d54b4a79e885fff9da0fca712a&service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",

        layer: "tdtAnnoLayer",

        style: "default",

        format: "image/jpeg",

        tileMatrixSetID: "GoogleMapsCompatible"

    })

)

const tileset = await Cesium.Cesium3DTileset.fromUrl(FILE_HOST + '3dtiles/house/tileset.json')

viewer.scene.primitives.add(tileset)

const entity = viewer.entities.add({

    name: 'gltf',

    position: Cesium.Cartesian3.fromDegrees(104.0668, 30.5728, 0), // 设置位置

    model: {

        uri: FILE_HOST + '/models/glb/map_park.glb',

    }

})

const gui = new GUI()

// viewer.flyTo
```

