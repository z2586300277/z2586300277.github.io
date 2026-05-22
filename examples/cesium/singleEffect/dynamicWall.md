---
title: "动态围墙 - Cesium.js 案例讲解"
description: "地图上的弧形飞线，线条材质贴图沿切线方向滚动；如有 model 则沿测地曲线飞行。入口在 `DynamicWallMaterialProperty`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,动态围墙,单一效果"
outline: deep
---

# 动态围墙

*Dynamic Wall*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=singleEffect&id=dynamicWall)


![动态围墙](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/effect/dynamicWall.jpg)


## 效果说明

地图上的弧形飞线，线条材质贴图沿切线方向滚动；如有 model 则沿测地曲线飞行。入口在 `DynamicWallMaterialProperty`。

> 单一效果 · Cesium.js

## 实现思路

- 自定义 Fabric 材质：向 `Material._materialCache` 注册 type，在 `czm_getMaterial` 里改 diffuse/alpha。`Property.getValue` 每帧回传 uniform（常见是 `time`），驱动纹理滚动或颜色变化。

- Entity.wall 用 `fromDegreesArrayHeights` 的经纬高数组拼墙面，适合雷达扇形、电子围栏。

## 类与方法

### DynamicWallMaterialProperty

- `constructor()` — 参数：options
- `getType()` — 返回已注册的 Material fabric type 字符串
- `getValue()` — Property 接口：按 simulation time 返回 uniform 对象，供 Fabric 材质读取
- `equals()` — Property 相等性比较，避免重复注册

## 独立函数

- `_getDirectionWallShader()` — 材质 / GLSL

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

// 🐘优雅永不过时 改编自 https://juejin.cn/post/7431590701496533030
class DynamicWallMaterialProperty {
    constructor(options) {
        // 默认参数设置
        this._definitionChanged = new Cesium.Event() // 材质定义变更事件
        this._color = undefined // 颜色属性
        this._colorSubscription = undefined // 颜色变化订阅
        this.color = options.color // 从选项中获取颜色
        this.duration = options.duration // 持续时间
        this.trailImage = options.trailImage // 路径图像
        this._time = new Date().getTime() // 当前时间戳
        this._viewer = options.viewer // Cesium 视图对象
    }
    // 返回材质类型
    getType(time) {
        return MaterialType // 返回材质类型名称
    }
    getValue(time, result) {
        if (!Cesium.defined(result)) {
            result = {} // 如果结果未定义，则初始化为空对象
        }
        result.color = Cesium.Property.getValueOrClonedDefault(
            this._color, // 获取颜色值
            time, // 当前时间
            Cesium.Color.WHITE, // 默认颜色为白色
   
```

