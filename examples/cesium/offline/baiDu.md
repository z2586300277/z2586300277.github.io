---
title: "内网百度 - Cesium.js 案例讲解"
description: "Cesium 离线/内网影像。入口在 `BaiduImageryProvider`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,内网百度"
outline: deep
---

# 内网百度

*Intranet Baidu*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=offline&id=baiDu)


![内网百度](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/offline/baidu.jpg)


## 效果说明

Cesium 离线/内网影像。入口在 `BaiduImageryProvider`。

> 离线地图 · Cesium.js

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

    baseLayer: false, // 不显示默认图层

    fullscreenButton: false,

    timeline: false,

    infoBox: false,

})

// 这里 https://github.com/z2586300277/3d-file-server 是我存放离线地图瓦片资源的仓库 

// 瓦片下载 - 可通过多种方式 例如 望远网 地图资源下载 

// 这里我只下载了 3 - 5 级的瓦片
```

### 百度 影像服务

```js
class BaiduImageryProvider {
    constructor(options) {
        this._errorEvent = new Cesium.Event();
        this._tileWidth = 256;
        this._tileHeight = 256;
        this._maximumLevel = 18;
        this._minimumLevel = 1;
        this._tilingScheme = new Cesium.WebMercatorTilingScheme({
            rectangleSouthwestInMeters: new Cesium.Cartesian2(-33554054, -33746824),
            rectangleNortheastInMeters: new Cesium.Cartesian2(33554054, 33746824)
        });
        this._rectangle = this._tilingScheme.rectangle;
        this._resource = Cesium.Resource.createIfNeeded(options.url);
    }

    get url() { return this._resource.url; }
    get proxy() { return this._resource.proxy; }
    get tileWidth() { return this._tileWidth; }
    get tileHeight() { return this._tileHeight; }
    get maximumLevel() { return this._maximumLevel; }
    get minimumLevel() { return this._minimumLevel; }
    get tilingScheme() { return this._tilingScheme; }
    get tileDiscardPolicy() { return this._tileDiscardPolicy; }
    get rectangle() { return this._rectangle; }
    get errorEvent() { return this._errorEvent; }
    get ready() { return this._resource; }
    get readyPromise() { return this._readyPromise; }
    get credit() { return this._credit; }

    requestImage(x, y, level) {
        let url = this.url
            .replace("{x}", x - this._tilingS
```

