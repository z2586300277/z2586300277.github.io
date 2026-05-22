---
title: "百度图层 - Cesium.js 案例讲解"
description: "Cesium 在线底图图层。入口在 `BaiduImageryProvider`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,百度图层"
outline: deep
---

# 百度图层

*Baidu Layer*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=layer&id=baiduLayer)


![百度图层](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/layer/baiduLayer.jpg)


## 效果说明

Cesium 在线底图图层。入口在 `BaiduImageryProvider`。

> 在线地图 · Cesium.js

## 实现思路

- 底图换 `ImageryProvider`：XYZ 模板、WMTS、ArcGIS 等，挂到 `viewer.imageryLayers`。

## 代码结构

- 百度 影像服务

## 类与方法

### BaiduImageryProvider

- `constructor()` — 参数：options
- `requestImage()`

## 源码

```js
import * as Cesium from 'cesium'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {

    animation: false,

    baseLayerPicker: false,

    baseLayer: false,

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
```

### 百度 影像服务

```js
class BaiduImageryProvider {

    constructor(options) {

        // 创建错误事件对象
        this._errorEvent = new Cesium.Event()

        // 定义瓦片宽度和高度
        this._tileWidth = 256

        this._tileHeight = 256

        // 定义最大和最小级别
        this._maximumLevel = 18

        this._minimumLevel = 1

        // 定义瓦片范围的南西角和东北角坐标
        let southwestInMeters = new Cesium.Cartesian2(-33554054, -33746824)

        let northeastInMeters = new Cesium.Cartesian2(33554054, 33746824)

        // 创建 WebMercatorTilingScheme 对象
        this._tilingScheme = new Cesium.WebMercatorTilingScheme({

            rectangleSouthwestInMeters: southwestInMeters,

            rectangleNortheastInMeters: northeastInMeters

        })

        // 获取瓦片范围
        this._rectangle = this._tilingScheme.rectangle

        // 创建资源对象
        this._resource = Cesium.Resource.createIfNeeded(options.url)

        // 设置其他属性的初始值
        this._tileDiscardPolicy = undefined

        this._credit = undefined

        this._readyPromise = undefined

    }

    // 定义属性访问器
    get url() {

        return this._resource.url

    }

    get proxy() {

        return this._resource.proxy

    }

    get tileWidth() {

        if (!this.ready) throw new Cesium.DeveloperError('tileWidth must not be called before the imagery provider is ready.')

        return this._tile
```

