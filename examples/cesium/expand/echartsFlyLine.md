---
title: "echarts飞线 - Cesium.js 案例讲解"
description: "地图上的弧形飞线，线条材质贴图沿切线方向滚动；如有 model 则沿测地曲线飞行。入口在 `RegisterCoordinateSystem`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,webgl,expand,echarts飞线"
outline: deep
---
# echarts飞线

*EchartsFlyLine*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=expand&id=echartsFlyLine)

![echarts飞线](https://z2586300277.github.io/three-editor/src/codes/cesiumjs/basic/flyCharts.jpg)

## 你将学到什么

- Cesium Viewer 初始化
- Cesium 鼠标拾取交互
- Cesium 影像图层
- ECharts 与三维融合
- Tween 补间动画

## 效果说明

地图上的弧形飞线，线条材质贴图沿切线方向滚动；如有 model 则沿测地曲线飞行。入口在 `RegisterCoordinateSystem`。

> 扩展功能 · Cesium.js

## 核心概念

- **Viewer** 封装地球、相机、图层；可关闭 animation/timeline 等 UI 精简界面。

- **ScreenSpaceEventHandler** 监听点击；`scene.pick` 取 Entity，`pickPosition` 取地表坐标。

- **ImageryLayer** 叠加 XYZ/WMTS/ArcGIS 等底图，`imageryLayers.add/remove` 管理。

- 二维图表/飞线与 Cesium/Three 场景叠加或纹理映射。

## 实现步骤

1. 初始化 `Cesium.Viewer` 与底图图层
2. 添加 Entity / Primitive / DataSource 等业务对象
3. 配置 ScreenSpaceEventHandler 交互
4. 按需 `camera.flyTo` 定位视角

## 源码

```js
/* 注 echarts 版本使用 4.9.0  请自行引入  此处我为 src 引入 */
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

// 视角设置北京
viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(116.4551, 40.2539, 10000000) })

class RegisterCoordinateSystem {
    static dimensions = ['lng', 'lat']
    constructor(glMap) {
        this._GLMap = glMap
        this._mapOffset = [0, 0]
        this.dimensions = ['lng', 'lat']
    }
    setMapOffset(mapOffset) {
        this._mapOffset = mapOffset
    }
    getBMap() {
        return this._GLMap
    }
    fixLat(lat) {
        return lat >= 90 ? 89.99999999999999 : lat <= -90 ? -89.99999999999999 : lat
    }
    dataToPoint(coords) {
        let lonlat = [99999, 99999]
        coords[1] = this.fixLat(coords[1])
        let position = Cesium.Cartesian3.fromDegrees(coords[0], coords[1])
        if (!position) return lonlat
        let coordinates = this._GLMap.cartesianToCanvasCoordinates(position)
        if (!coordinates) return lonlat
        if (this._GLMap.mode === Cesium.SceneMode.SCENE3D) {
            if (Cesium.Cartesian3.angleBetween(this._GLMap.camera.position, position) > Cesium.Math.toRadians(75)) return !1
        }
        return [coordinates.x - this._mapOffset[0], coordinates.y - this._mapOffset[1]]
    }
    pointToData(pt) {
        var mapOffset = this._mapOffset
        pt = this._bmap.project([pt[0] + mapOffset[0], pt[1] + mapOffset[1]])
        return [pt.lng, pt.lat]
    }
    getViewRect() {
        let api = this._api
        return new echarts.graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight())
    }
    getRoamTransform() {
        return echarts.matrix.create()
    }
    static create(echartModel, api) {
        this._api = api
        let registerCoordinateSystem
        echartModel.eachComponent('GLMap', function (seriesModel) {
            let painter = api.getZr().painter
            if (painter) {
                let glMap = echarts.glMap
                registerCoordinateSystem = new RegisterCoordinateSystem(glMap, api)
                registerCoordinateSystem.setMapOffset(seriesModel.__mapOffset || [0, 0])
                seriesModel.coordinateSystem = registerCoordinateSystem
            }
        })
        echartModel.eachSeries(function (series) {
            'GLMap' === series.get('coordinateSystem') && (series.coordinateSystem = registerCoordinateSystem)
        })
    }
}

const mockClickChart = (event, chart) => {
    const evmousedown = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    const evmouseup = new MouseEvent('mouseup', { bubbles: true, cancelable: true });
    const evmouseclick = new MouseEvent('click', { bubbles: true, cancelable: true });
    for (const key in event) {
        try {
            Object.defineProperty(evmousedown, key, { value: event[key] });
            Object.defineProperty(evmouseup, key, { value: event[key] });
            Object.defineProperty(evmouseclick, key, { value: event[key] });
        } catch (err) { /* event 对象中部分属性是只读，忽略即可 */ }
    }

    // 事件触发的容器，即不是 #app 也不是 canvas，而是中间这个 div
    const container = chart._dom.firstElementChild;
    container.dispatchEvent(evmousedown);
    container.dispatchEvent(evmouseup);
    container.dispatchEvent(evmouseclick);
}

class EchartsLayer {

    constructor(map, options) {
        this._map = map;
        this._overlay = this._createChartOverlay();
        if (options) this._registerMap();
        this._overlay.setOption(options || {});
    }
    _registerMap() {
        if (!this._isRegistered) {
            echarts.registerCoordinateSystem('GLMap', RegisterCoordinateSystem);
            echarts.registerAction({ type: 'GLMapRoam', event: 'GLMapRoam', update: 'updateLayout' }, function (t, e) { });
            echarts.extendComponentModel({
                type: 'GLMap',
                getBMap() {
                    return this.__GLMap;
                },
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=expand&id=echartsFlyLine) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [扩展功能目录](/examples/cesium/expand/)

> 扩展功能 · Cesium.js
