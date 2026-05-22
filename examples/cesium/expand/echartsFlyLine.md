---
title: "echarts飞线 - Cesium.js 案例讲解"
description: "地图上的弧形飞线，线条材质贴图沿切线方向滚动；如有 model 则沿测地曲线飞行。入口在 `RegisterCoordinateSystem`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,echarts飞线"
outline: deep
---

# echarts飞线

*EchartsFlyLine*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=expand&id=echartsFlyLine)


![echarts飞线](https://z2586300277.github.io/three-editor/src/codes/cesiumjs/basic/flyCharts.jpg)


## 效果说明

地图上的弧形飞线，线条材质贴图沿切线方向滚动；如有 model 则沿测地曲线飞行。入口在 `RegisterCoordinateSystem`。

> 扩展功能 · Cesium.js

## 实现思路

- 拾取用 `ScreenSpaceEventHandler` + `scene.pick` / `pickPosition`，注意地形深度。

## 代码结构

- 注 echarts 版本使用 4.9.0  请自行引入  此处我为 src 引入
- event 对象中部分属性是只读，忽略即可

## 类与方法

### RegisterCoordinateSystem

- `constructor()` — 参数：glMap
- `setMapOffset()` — 经纬高 ↔ Cartesian3
- `getBMap()` — 经纬高 ↔ Cartesian3
- `fixLat()` — 经纬高 ↔ Cartesian3
- `dataToPoint()` — 经纬高 ↔ Cartesian3
- `pointToData()`
- `getViewRect()`
- `getRoamTransform()`

### EchartsLayer

- `constructor()` — 参数：map, options
- `_registerMap()`
- `getBMap()`
- `init()` — 移除 Entity / 解绑监听
- `moveHandler()` — 移除 Entity / 解绑监听
- `render()` — 移除 Entity / 解绑监听
- `dispose()` — 移除 Entity / 解绑监听
- `_createChartOverlay()`
- `updateOverlay()` — 移除 Entity / 解绑监听
- `getMap()` — 移除 Entity / 解绑监听
- `getOverlay()` — 移除 Entity / 解绑监听
- `show()` — 移除 Entity / 解绑监听
- `hide()` — 移除 Entity / 解绑监听
- `remove()` — 移除 Entity / 解绑监听
- `resize()`

## 源码

### 注 echarts 版本使用 4.9.0  请自行引入  此处我为 src 引入

```js
import * as Cesium from 'cesium'

const DOM = document.getElementById('box')

const viewer = new Cesium.Viewer(DOM, {

    animation: false,

    baseLayerPicker: false,

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl(GLOBAL_CONFIG.getLayerUrl())),

    fullscreenButton: false,

    timeline: false,

    infoBox: false,

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
        if (this._GLMap.mode === Cesium
```

### event 对象中部分属性是只读，忽略即可

```js
}
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
                defaultOption: { roam: false },
            });
            echarts.extendComponentView({
                type: 'GLMap',
                init(t, e) {
                    this.api = e;
                    echarts.glMap.postRender.addEventListener(this.moveHandler, this);
                },
                moveHandler(t, e) {
                    this.api.dispatchAction({ type: 'GLMapRoam' });
                },
                render(t, e, i) { },
          
```

