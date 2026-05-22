---
title: "3D热力图 - Cesium.js 案例讲解"
description: "热力或密度可视化，通常把数值映射到颜色/高度。主流程在 `Canvas2dRenderer`、`Coordinator`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,3D热力图"
outline: deep
---

# 3D热力图

*3D Heat Map*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=expand&id=3DheatMap)


![3D热力图](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/expand/3DheatMap.jpg)


## 效果说明

热力或密度可视化，通常把数值映射到颜色/高度。主流程在 `Canvas2dRenderer`、`Coordinator`。

> 扩展功能 · Cesium.js

## 实现思路

- 局部 ENU → 世界坐标：`Transforms.eastNorthUpToFixedFrame`，雷达/箭头类特效常用。

## 独立函数

- `initializeHeatmap()` — 经纬高 ↔ Cartesian3
- `destroyHeatmap()` — 移除 Entity / 解绑监听
- `computeNormalizedCoordinates()` — 经纬高 ↔ Cartesian3

## 源码

```js
import {
  EllipsoidSurfaceAppearance,
  GeometryInstance,
  Material,
  Primitive,
  Rectangle,
  RectangleGeometry,
  SingleTileImageryProvider,
  ImageryLayer,
  ImageMaterialProperty,
  Entity,
} from "cesium";
import * as Cesium from "cesium";
```

### ----------------------------------------------------heatMap类-----------------------------------------------

```js
var HeatmapConfig = {
  defaultRadius: 40,
  defaultRenderer: "canvas2d",
  defaultGradient: {
    0.25: "rgb(0,0,255)",
    0.55: "rgb(0,255,0)",
    0.85: "yellow",
    1.0: "rgb(255,0,0)",
  },
  defaultMaxOpacity: 1,
  defaultMinOpacity: 0,
  defaultBlur: 0.85,
  defaultXField: "x",
  defaultYField: "y",
  defaultValueField: "value",
  plugins: {},
};
var Store = (function StoreClosure() {
  var Store = function Store(config) {
    this._coordinator = {};
    this._data = [];
    this._radi = [];
    this._min = 0;
    this._max = 1;
    this._xField = config["xField"] || config.defaultXField;
    this._yField = config["yField"] || config.defaultYField;
    this._valueField = config["valueField"] || config.defaultValueField;

    if (config["radius"]) {
      this._cfgRadius = config["radius"];
    }
  };

  var defaultRadius = HeatmapConfig.defaultRadius;

  Store.prototype = {
    // when forceRender = false -> called from setData, omits renderall event
    _organiseData: function (dataPoint, forceRender) {
      var x = dataPoint[this._xField];
      var y = dataPoint[this._yField];
      var radi = this._radi;
      var store = this._data;
      var max = this._max;
      var min = this._min;
      var value = dataPoint[this._valueField] || 1;
      var radius = dataPoint.radius || this._cfgRadius || defaultRadius;

      i
```

```js
/*,

      TODO: rethink.

    getValueAt: function(point) {
      var value;
      var radius = 100;
      var x = point.x;
      var y = point.y;
      var data = this._data;

      if (data[x] && data[x][y]) {
        return data[x][y];
      } else {
        var values = [];
        // radial search for datapoints based on default radius
        for(var distance = 1; distance < radius; distance++) {
          var neighbors = distance * 2 +1;
          var startX = x - distance;
          var startY = y - distance;

          for(var i = 0; i < neighbors; i++) {
            for (var o = 0; o < neighbors; o++) {
              if ((i == 0 || i == neighbors-1) || (o == 0 || o == neighbors-1)) {
                if (data[startY+i] && data[startY+i][startX+o]) {
                  values.push(data[startY+i][startX+o]);
                }
              } else {
                continue;
              } 
            }
          }
        }
        if (values.length > 0) {
          return Math.max.apply(Math, values);
        }
      }
      return false;
    }*/,
  };

  return Store;
})();

var Canvas2dRenderer = (function Canvas2dRendererClosure() {
  var _getColorPalette = function (config) {
    var gradientConfig = config.gradient || config.defaultGradient;
    var paletteCanvas = document.createElement("canvas");
    var paletteCt
```

