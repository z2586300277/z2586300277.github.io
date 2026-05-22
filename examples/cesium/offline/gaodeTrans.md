---
title: "高德纠偏 - Cesium.js 案例讲解"
description: "Cesium 离线/内网影像。入口在 `CoordTransform`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,高德纠偏,离线地图"
outline: deep
---

# 高德纠偏

*Gaode Transform*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=offline&id=gaodeTrans)


![高德纠偏](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/layer/gaodeTrans.jpg)


## 效果说明

Cesium 离线/内网影像。入口在 `CoordTransform`。

> 离线地图 · Cesium.js

## 实现思路

- Entity.model 加载 glTF/glb，`minimumPixelSize` 保证远距离仍可见。

- 底图换 `ImageryProvider`：XYZ 模板、WMTS、ArcGIS 等，挂到 `viewer.imageryLayers`。

## 类与方法

### CoordTransform


## 独立函数

- `flyToLocation()` — 移除 Entity / 解绑监听

## 源码

```js
import * as Cesium from 'cesium';
import * as dat from 'dat.gui';

// 定义一些常量
const BD_FACTOR = (3.14159265358979324 * 3000.0) / 180.0;
const PI = 3.1415926535897932384626;
const RADIUS = 6378245.0;
const EE = 0.00669342162296594323;

class CoordTransform {
    /**
     * BD-09(百度坐标系) To GCJ-02(火星坐标系)
     * @param lng
     * @param lat
     * @returns {number[]}
     */
    static BD09ToGCJ02(lng, lat) {
        let x = +lng - 0.0065;
        let y = +lat - 0.006;
        let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * BD_FACTOR);
        let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * BD_FACTOR);
        let gg_lng = z * Math.cos(theta);
        let gg_lat = z * Math.sin(theta);
        return [gg_lng, gg_lat];
    }

    /**
     * GCJ-02(火星坐标系) To BD-09(百度坐标系)
     * @param lng
     * @param lat
     * @returns {number[]}
     * @constructor
     */
    static GCJ02ToBD09(lng, lat) {
        lat = +lat;
        lng = +lng;
        let z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * BD_FACTOR);
        let theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * BD_FACTOR);
        let bd_lng = z * Math.cos(theta) + 0.0065;
        let bd_lat = z * Math.sin(theta) + 0.006;
        return [bd_lng, bd_lat];
    }

    /**
     * WGS-84(世界大地坐标系) To GCJ-02(火星坐标系)
     * @param lng
     * @param lat
  
```

