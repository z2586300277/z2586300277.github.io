---
title: "绘制文字 - Cesium.js 案例讲解"
description: "场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,webgl,basic,绘制文字"
outline: deep
---
# 绘制文字

*Draw Text*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=cesiumText)

![绘制文字](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/layer/defaultLayer.jpg)

## 你将学到什么

- Cesium Viewer 初始化
- Cesium Entity 高层 API
- Cesium 影像图层

## 效果说明

场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。

> 基础功能 · Cesium.js

## 核心概念

- **Viewer** 封装地球、相机、图层；可关闭 animation/timeline 等 UI 精简界面。

- **Entity** 加点线面、模型、标签；适合业务对象与交互。

- **ImageryLayer** 叠加 XYZ/WMTS/ArcGIS 等底图，`imageryLayers.add/remove` 管理。

## 实现步骤

1. 初始化 `Cesium.Viewer` 与底图图层
2. 添加 Entity / Primitive / DataSource 等业务对象
3. 按需 `camera.flyTo` 定位视角

## 代码要点

- **`add()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as Cesium from 'cesium'

const DOM = document.getElementById('box')

const viewer = new Cesium.Viewer(DOM, {

    animation: false,//是否创建动画小器件，左下角仪表    

    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl(GLOBAL_CONFIG.getLayerUrl())),

    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮

    timeline: false,//是否显示时间轴    

    infoBox: false,//是否显示信息框   

})

viewer._cesiumWidget._creditContainer.style.display = "none"

// 深度监测
viewer.scene.globe.depthTestAgainstTerrain = true;

var text = viewer.entities.add({
    name: '贴地',
    position: Cesium.Cartesian3.fromDegrees(-75.166493, 39.9060534),
    point: {
        pixelSize: 5,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.TOP,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,

    },
    label: {
        text: '贴地',
        font: '14pt monospace',
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.TOP,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        showBackground: true,
        backgroundColor: Cesium.Color.WHITE
    }
});

var world = viewer.entities.add({
    name: '不贴地',
    position: Cesium.Cartesian3.fromDegrees(-95.166493, 39.9060534, 2000),
    point: {
        pixelSize: 5,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
    },
    label: {
        text: '不贴地',
        font: '14pt monospace',
        outlineWidth: 2,
    }
});

// 自动计算贴地，需要等地形加载完方可
function add() {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-115.166493, 39.9060534, 15000.0),
        duration: 3,
        orientation: {
            heading: Cesium.Math.toRadians(90.0), // 水平旋转，围绕Y轴，0为正北方向
            pitch: Cesium.Math.toRadians(-90),     // 上下旋转，围绕X轴，-90为俯视地面
            roll: 0.0                             // 视口的翻滚角度，围绕Z轴，0为不翻转
        },
        complete: () => {
            setTimeout(() => {
                var cartographic = Cesium.Cartographic.fromDegrees(-115.166493, 39.9060534, 10);
                var posi = new Cesium.Cartographic(cartographic.longitude, cartographic.latitude)
                var height = viewer.scene.globe.getHeight(posi)
                console.log(height)

                var haha = viewer.entities.add({
                    name: '自动计算贴地',
                    position: Cesium.Cartesian3.fromDegrees(-115.166493, 39.9060534, height + 0.1),
                    point: {
                        pixelSize: 5,
                        color: Cesium.Color.RED,
                        outlineColor: Cesium.Color.WHITE,
                        outlineWidth: 2,
                        verticalOrigin: Cesium.VerticalOrigin.TOP,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    },
                    label: {
                        text: '自动计算贴地',
                        font: '14pt monospace',
                        outlineWidth: 2,
                        verticalOrigin: Cesium.VerticalOrigin.TOP,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    }
                });
            }, 1000)
        }
    });
}

// 修改值和属性
text.label.text = '贴地文字'
text.label.fillColor = Cesium.Color.RED
 // text.position =  Cesium.Cartesian3.fromDegrees(-100, 39.9060534)
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=cesiumText) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础功能目录](/examples/cesium/basic/)

> 基础功能 · Cesium.js
