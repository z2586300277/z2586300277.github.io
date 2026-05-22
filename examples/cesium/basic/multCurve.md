---
title: "cesium大量曲线 - Cesium.js 案例讲解"
description: "Cesium Scene/Camera/Renderer 基础搭建。主流程在 `setCurveCollection`、`generateCurvePoints`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,cesium大量曲线"
outline: deep
---

# cesium大量曲线

*Multiple Curves*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=multCurve)


![cesium大量曲线](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/multCurve.jpg)


## 效果说明

Cesium Scene/Camera/Renderer 基础搭建。主流程在 `setCurveCollection`、`generateCurvePoints`。

> 基础功能 · Cesium.js

## 代码结构

- 创建曲线合集
- 曲线算法

## 独立函数

- `generateCurvePoints()` — 经纬高 ↔ Cartesian3

## 源码

```js
import * as Cesium from 'cesium'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {

    animation: false,

    baseLayerPicker: false,

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')),

    fullscreenButton: false,

    timeline: false,

    infoBox: false,

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
```

### 创建曲线合集

```js
function setCurveCollection(viewer, callback) {
```

### 曲线算法

```js
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

                    vertexFormat: Cesium.PolylineColorAppe
```

