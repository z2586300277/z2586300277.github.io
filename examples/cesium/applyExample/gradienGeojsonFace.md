---
title: "渐变行政区 - Cesium.js 案例讲解"
description: "Cesium 多技术组合的应用 demo。入口在 `CustomMaterialProperty`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,渐变行政区"
outline: deep
---

# 渐变行政区

*Gradient Area*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=applyExample&id=gradienGeojsonFace)


![渐变行政区](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/expand/gradienGeojsonFace.jpg)


## 效果说明

Cesium 多技术组合的应用 demo。入口在 `CustomMaterialProperty`。

> 应用相关 · Cesium.js

## 实现思路

- 自定义 Fabric 材质：向 `Material._materialCache` 注册 type，在 `czm_getMaterial` 里改 diffuse/alpha。`Property.getValue` 每帧回传 uniform（常见是 `time`），驱动纹理滚动或颜色变化。

- 矢量数据走 DataSource 加载 GeoJSON/KML/CZML，Entity 自动生成。

## 类与方法

### CustomMaterialProperty

- `constructor()` — 参数：options = {}
- `getType()` — 返回已注册的 Material fabric type 字符串
- `getValue()` — Property 接口：按 simulation time 返回 uniform 对象，供 Fabric 材质读取
- `equals()` — Property 相等性比较，避免重复注册

## 独立函数

- `addMaterial()` — 材质 / GLSL

## 着色器

### Fabric 片元

- `material.diffuse/alpha`：输出最终颜色与透明度
- 先取 Cesium 默认 material，再改 diffuse/alpha

```glsl
czm_getMaterial(czm_materialInput materialInput) {
        czm_material material = czm_getDefaultMaterial(materialInput);
        vec2 st = materialInput.st;
        float alpha = distance(st, vec2(.5));
        material.alpha = color.a * alpha * 1.5;
        material.diffuse = color.rgb * 1.3;
        return material;
      }
```

## 源码

```js
import * as Cesium from "cesium";

/**
 * 自定义材质类型名称
 * @const {string}
 */
const MATERIAL_TYPE = "Custom";

/**
 * 自定义材质属性类
 * @class
 */
class CustomMaterialProperty {
  /**
   * @param {Object=} options 配置项
   */
  constructor(options = {}) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;

    this.color = options.color || Cesium.Color.RED;
    this.duration = options.duration || 2000;
    this._time = performance.now();
  }

  /**
   * @return {boolean}
   */
  get isConstant() {
    return false;
  }

  /**
   * @return {Cesium.Event}
   */
  get definitionChanged() {
    return this._definitionChanged;
  }

  /**
   * @return {string}
   */
  getType() {
    return MATERIAL_TYPE;
  }

  /**
   * @param {Cesium.JulianDate} time
   * @param {Object=} result
   * @return {Object}
   */
  getValue(time, result = {}) {
    result.color = Cesium.Property.getValueOrUndefined(this.color, time);
    result.time =
      ((performance.now() - this._time) % this.duration) / this.duration;
    return result;
  }

  /**
   * @param {CustomMaterialProperty} other
   * @return {boolean}
   */
  equals(other) {
    return (
      this === other ||
      (other instanceof CustomMaterialProperty && this._color === other._color)
    );
  }
}

// 定义颜色属
```

