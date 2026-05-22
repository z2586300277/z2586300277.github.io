---
title: "记录视角 - Cesium.js 案例讲解"
description: "本案例展示 **记录视角 ** 的实现。涉及：Cesium Viewer 初始化、Cesium 影像图层、GUI 面板调试参数。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,webgl,basic,记录视角"
outline: deep
---
# 记录视角

*Camera View*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=cameraView)

![记录视角](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/layer/defaultLayer.jpg)

## 你将学到什么

- Cesium Viewer 初始化
- Cesium 影像图层
- GUI 面板调试参数

## 效果说明

本案例展示 **记录视角 ** 的实现。涉及：Cesium Viewer 初始化、Cesium 影像图层、GUI 面板调试参数。

> 基础功能 · Cesium.js

## 核心概念

- **Viewer** 封装地球、相机、图层；可关闭 animation/timeline 等 UI 精简界面。

- **ImageryLayer** 叠加 XYZ/WMTS/ArcGIS 等底图，`imageryLayers.add/remove` 管理。

## 实现步骤

1. 初始化 `Cesium.Viewer` 与底图图层
2. 添加 Entity / Primitive / DataSource 等业务对象
3. 按需 `camera.flyTo` 定位视角

## 代码要点

- **`loadView()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as Cesium from 'cesium'
import { GUI } from 'dat.gui'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {

    animation: false,//是否创建动画小器件，左下角仪表    

    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')),

    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮

    timeline: false,//是否显示时间轴    

    infoBox: false,//是否显示信息框   

})

const gui = new GUI()

const cartesian3ToDegrees = (cartesian3) => {
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian3)
    return {
        longitude: Cesium.Math.toDegrees(cartographic.longitude),
        latitude: Cesium.Math.toDegrees(cartographic.latitude),
        height: cartographic.height
    }
}

const saveView = () => ({
    positionDegrees: cartesian3ToDegrees(camera.positionWC), // 经纬度坐标
    position: camera.positionWC, // 笛卡尔坐标
    direction: camera.directionWC, // 方向
    up: camera.upWC,  // 上方向
    frustum: {
        fov: camera.frustum.fov, // 视场角
        near: camera.frustum.near, // 近裁剪面距离
        far: camera.frustum.far // 远裁剪面距离
    },
    heading: camera.heading, // 偏航角 只读
    pitch: camera.pitch, // 俯仰角 只读
    roll: camera.roll, // 翻滚角 只读
})

function loadView(view) {
    if (view) {
        Math.random() > 0.5 ? viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(view.positionDegrees.longitude, view.positionDegrees.latitude
                , view.positionDegrees.height),
            orientation: {
                heading: view.heading,
                pitch: view.pitch,
                roll: view.roll
            }
        }) : camera.setView({
            destination: view.position,
            orientation: {
                heading: view.heading,
                pitch: view.pitch,
                roll: view.roll
            }
        })
    } else {
        slert('没有保存的视角数据')
    }
}

const camera = viewer.camera // 获取相机对象

let storage = JSON.parse(sessionStorage.getItem('TCE_savedView'))
if (!storage) storage = {
    url: FILE_HOST + '/examples/coffeeMug/coffeeMug.glb', // FILE_HOST + '/examples/coffeeMug/coffeeMug.glb'
    view: null
}

if (storage.view) {
    const { view } = storage
    camera.positionWC.x = view.position.x // 设置相机位置
    camera.positionWC.y = view.position.y
    camera.positionWC.z = view.position.z
    camera.directionWC.x = view.direction.x // 设置相机方向
    camera.directionWC.y = view.direction.y
    camera.directionWC.z = view.direction.z
    camera.upWC.x = view.up.x // 设置相机上方向
    camera.upWC.y = view.up.y
    camera.upWC.z = view.up.z
    camera.frustum.fov = view.frustum.fov // 设置视场角
    camera.frustum.near = view.frustum.near // 设置近裁剪面距离
    camera.frustum.far = view.frustum.far // 设置远裁剪面距离

    if (storage.url) {
        Cesium.Model.fromGltfAsync({
            url: storage.url,
            minimumPixelSize: 128,
            maximumScale: 200,
            modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(139.767052, 35.681167, 0)),
        }).then(model => {
            viewer.scene.primitives.add(model)
        })
    }
}

gui.add({
    '保存视角': () => {
        storage.view = saveView()
        sessionStorage.setItem('TCE_savedView', JSON.stringify(storage))
        alert('视角已保存')
    }
}, '保存视角')

gui.add({
    '恢复保存视角': () => {
        const s = JSON.parse(sessionStorage.getItem('TCE_savedView'))
        if (s && s.view) loadView(s.view)
        else alert('没有保存的视角数据')
    }
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=cameraView) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础功能目录](/examples/cesium/basic/)

> 基础功能 · Cesium.js
