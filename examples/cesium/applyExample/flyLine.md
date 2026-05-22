---
title: "流动飞线运动 - Cesium.js 案例讲解"
description: "地图上的弧形飞线，线条材质贴图沿切线方向滚动；如有 model 则沿测地曲线飞行。入口在 `PolylineTrailLinkMaterialProperty`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,流动飞线运动"
outline: deep
---

# 流动飞线运动

*Flowing Line*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=applyExample&id=flyLine)


![流动飞线运动](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/flyLine.jpg)


## 效果说明

地图上的弧形飞线，线条材质贴图沿切线方向滚动；如有 model 则沿测地曲线飞行。入口在 `PolylineTrailLinkMaterialProperty`。

> 应用相关 · Cesium.js

## 实现思路

**流动线材质**：`Material._materialCache.addMaterial` 注册 Fabric；`getValue` 用 `(Date.now - _time) % duration` 得到 0–1 的 `time` uniform。片元里 `texture(image, vec2(fract(3*st.s - time), st.t))`，`st.s` 沿 polyline 长度、`st.t` 沿线宽，贴图沿切线滚。

**弧线路径**：`EllipsoidGeodesic.interpolateUsingFraction(t)` 在椭球面测地插值；`height = maxHeight * sin(πt)` 把线抬成弧，末尾补一个贴地终点。

**飞机运动**：`SampledPositionProperty` 按 `i/speedFactor` 秒写入每个 `curvePoints[i]`；`VelocityOrientationProperty` 对齐速度方向。`onTick` 里 `JulianDate.compare` 到终点后重设采样区间，实现循环。

## 代码结构

- 飞线材质类
- 生成曲线
- 飞行动画

## 类与方法

### PolylineTrailLinkMaterialProperty

- `constructor()` — 参数：image, color = Color.WHITE, duration = 1000
- `getType()` — 返回已注册的 Material fabric type 字符串
- `getValue()` — Property 接口：按 simulation time 返回 uniform 对象，供 Fabric 材质读取
- `equals()` — Property 相等性比较，避免重复注册

## 独立函数

- `createPlaneCurve()` — 一条线：getGenerateCurve → 飞机 model + 流动 polyline
- `getGenerateCurve()` — EllipsoidGeodesic 插值，sin 抬升，返回 curvePoints
- `getCurvePointAtTime()` — 测地线插值 + sin 抬升高度
- `setEntityAnimate()` — SampledPositionProperty + onTick 循环
- `setProperty()` — 把 curvePoints 按 speedFactor 写入 position 采样

## 着色器

### Fabric 片元

- `fract(…st.s - time)`：沿 polyline 的 s 方向滚动贴图
- `texture(image, …)`：采样线条贴图
- `material.diffuse/alpha`：输出最终颜色与透明度
- 先取 Cesium 默认 material，再改 diffuse/alpha

```glsl
czm_getMaterial(czm_materialInput materialInput) 
                    {
                    czm_material material = czm_getDefaultMaterial(materialInput);
                    vec2 st = materialInput.st;
                    vec4 sampledColor = texture(image, vec2(fract(3.0*st.s - time), st.t));
                    material.alpha = sampledColor.a * color.a;
                    material.diffuse = (sampledColor.rgb + color.rgb) / 2.0;
                    return material;
                }
```

## 源码

```js
import * as Cesium from 'cesium'
import { Color, defined, Event, Material, Property } from 'cesium'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {

    animation: false,

    baseLayerPicker: false,

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl(GLOBAL_CONFIG.getLayerUrl())),

    fullscreenButton: false,

    timeline: false,

    infoBox: false,

})

viewer._cesiumWidget._creditContainer.style.display = "none"

viewer.clock.shouldAnimate = true

//定位北京
viewer.camera.flyTo({

    destination: Cesium.Cartesian3.fromDegrees(116.41, 36.91, 10000000),

    orientation: {

        heading: Cesium.Math.toRadians(0),

        pitch: Cesium.Math.toRadians(-90),

        roll: 0

    }

})
```

### 飞线材质类

```js
class PolylineTrailLinkMaterialProperty {

    constructor(image, color = Color.WHITE, duration = 1000) {

        this._definitionChanged = new Event()

        this._color = undefined

        this.color = color

        this.duration = duration

        this._time = new Date().getTime()

        this.image = image

        Material._materialCache.addMaterial('PolylineTrailLink', {

            fabric: {

                type: 'PolylineTrailLink',

                uniforms: {

                    color: color.withAlpha(1.0),

                    image: image,

                    time: 0

                },

                source: `
                    czm_material czm_getMaterial(czm_materialInput materialInput) 
                    {
                    czm_material material = czm_getDefaultMaterial(materialInput);
                    vec2 st = materialInput.st;
                    vec4 sampledColor = texture(image, vec2(fract(3.0*st.s - time), st.t));
                    material.alpha = sampledColor.a * color.a;
                    material.diffuse = (sampledColor.rgb + color.rgb) / 2.0;
                    return material;
                }`

            },

            translucent: () => true

        })

    }

    get isConstant() { return false }

    get definitionChanged() { return this._definitionChanged }

 
```

### 生成曲线

```js
function getGenerateCurve(start, end, params = {}) {

    const [startLongitude, startLatitude] = start

    const [endLongitude, endLatitude] = end

    const startCartographic = Cesium.Cartographic.fromDegrees(startLongitude, startLatitude)

    const endCartographic = Cesium.Cartographic.fromDegrees(endLongitude, endLatitude)

    const geodesic = new Cesium.EllipsoidGeodesic(startCartographic, endCartographic)

    const curvePoints = []

    for (let t = 0; t <= 1; t += (params.step || 0.01)) {

        const pointCartographic = geodesic.interpolateUsingFraction(t)

        pointCartographic.height = (params.maxHeight || 400000) * Math.sin(Math.PI * t)

        const pointCartesian = Cesium.Cartographic.toCartesian(pointCartographic)

        curvePoints.push(pointCartesian)

    }

    endCartographic.height = 0

    const endPointCartesian = Cesium.Cartographic.toCartesian(endCartographic)

    curvePoints.push(endPointCartesian)

    function getCurvePointAtTime(t) {

        const pointCartographic = geodesic.interpolateUsingFraction(t)

        pointCartographic.height = (params.maxHeight || 400000) * Math.sin(Math.PI * t)

        return Cesium.Cartographic.toCartesian(pointCartographic)

    }

    return { curvePoints, getCurvePointAtTime }

}
```

