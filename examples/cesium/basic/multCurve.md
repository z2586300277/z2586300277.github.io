---
title: "cesium大量曲线 - Cesium.js 案例讲解"
description: "本案例展示 **cesium大量曲线 ** 的实现。涉及：Cesium Viewer 初始化、Cesium 影像图层。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,webgl,basic,cesium大量曲线"
outline: deep
---
# cesium大量曲线

*Multiple Curves*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=multCurve)

![cesium大量曲线](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/multCurve.jpg)

## 你将学到什么

- Cesium Viewer 初始化
- Cesium 影像图层

## 效果说明

本案例展示 **cesium大量曲线 ** 的实现。涉及：Cesium Viewer 初始化、Cesium 影像图层。

> 基础功能 · Cesium.js

## 核心概念

- **Viewer** 封装地球、相机、图层；可关闭 animation/timeline 等 UI 精简界面。

- **ImageryLayer** 叠加 XYZ/WMTS/ArcGIS 等底图，`imageryLayers.add/remove` 管理。

## 实现步骤

1. 初始化 `Cesium.Viewer` 与底图图层
2. 添加 Entity / Primitive / DataSource 等业务对象
3. 按需 `camera.flyTo` 定位视角

## 代码要点

- **`setCurveCollection()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`generateCurvePoints()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as Cesium from 'cesium'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {

    animation: false,//是否创建动画小器件，左下角仪表    

    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')),

    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮

    timeline: false,//是否显示时间轴    

    infoBox: false,//是否显示信息框   

})

// 经纬度坐标5个点
const points = [116.405285, 39.904989, 121.472644, 31.231706, 113.280637, 23.125178, 114.057868, 22.543099, 120.153576, 30.287459]

const getColor = () => '#' + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0') // 随机16进制颜色

setCurveCollection(viewer, curveCollection => {

    curveCollection.add({ positions: points, color: getColor(), width: 2, opacity: 0.5, id: 'curve1', multiplier: 1 }) // 添加一条曲线

    // 随机生成 300 个曲线
    for (let i = 0; i < 300; i++) {

        const positions = Array.from({ length: 10 }, () => Math.random() * 360 - 180).reduce((acc, cur) => acc.concat(cur), [])

        curveCollection.add({ positions, color: getColor(), width: 2, opacity: 0.5, id: i, multiplier: 20 })

    }

})

/* 创建曲线合集 */
function setCurveCollection(viewer, callback) {

    /* 曲线算法 */
    function generateCurvePoints(flattenedPoints, multiplier = 30) {

        const numOfPoints = flattenedPoints.length / 2 * multiplier

        // 将一维数组转换为二维数组
        const points = [];

        for (let i = 0; i < flattenedPoints.length; i += 2) {

            points.push([flattenedPoints[i], flattenedPoints[i + 1]])

        }

        const times = points.map((_, index) => index / (points.length - 1))

        const cartesianPoints = points.map(point => Cesium.Cartesian3.fromDegrees(point[0], point[1]))

        const spline = new Cesium.CatmullRomSpline({

            times: times,

            points: cartesianPoints

        });

        const curvePoints = [];

        for (let i = 0; i < numOfPoints; i++) {

            const time = i / (numOfPoints - 1)

            curvePoints.push(spline.evaluate(time))

        }

        return curvePoints;

    }

    const curveCollection = {

        instances: [],

        add({ positions, color = '#fff', id = '', width = 1.0, opacity = 1, multiplier = 10 }) {

            if (!positions) return

            this.instances.push(new Cesium.GeometryInstance({

                geometry: new Cesium.PolylineGeometry({

                    positions: generateCurvePoints(positions, multiplier),

                    width,

                    vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT

                }),

                attributes: {

                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString(color).withAlpha(opacity))

                },

                id

            }))

        }

    }

    if (callback) callback(curveCollection)

// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=multCurve) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础功能目录](/examples/cesium/basic/)

> 基础功能 · Cesium.js
