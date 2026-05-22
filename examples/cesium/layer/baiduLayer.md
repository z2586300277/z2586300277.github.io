---
title: "百度图层 - Cesium.js 案例讲解"
description: "Cesium 在线底图图层。入口在 `BaiduImageryProvider`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,webgl,layer,百度图层"
outline: deep
---
# 百度图层

*Baidu Layer*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=layer&id=baiduLayer)

![百度图层](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/layer/baiduLayer.jpg)

## 你将学到什么

- 天空盒与环境贴图
- Cesium Viewer 初始化
- Cesium 影像图层

## 效果说明

Cesium 在线底图图层。入口在 `BaiduImageryProvider`。

> 在线地图 · Cesium.js

## 核心概念

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

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

    animation: false,//是否创建动画小器件，左下角仪表    

    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮

    baseLayer: false,

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

viewer.scene.sun.show = false

viewer.scene.moon.show = false

viewer.scene.skyBox.show = false

viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0)

viewer._cesiumWidget._creditContainer.style.display = "none"

/* 百度 影像服务 */
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

        return this._tileWidth
    }

    get tileHeight() {

        if (!this.ready) throw new Cesium.DeveloperError('tileHeight must not be called before the imagery provider is ready.')
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=layer&id=baiduLayer) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [在线地图目录](/examples/cesium/layer/)

> 在线地图 · Cesium.js
