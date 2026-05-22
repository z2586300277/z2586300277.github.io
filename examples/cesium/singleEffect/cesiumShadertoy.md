---
title: "使用Shadertoy - Cesium.js 案例讲解"
description: "Cesium 地球上的 GIS 小特效。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,使用Shadertoy,单一效果"
outline: deep
---

# 使用Shadertoy

*Use Shadertoy*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=singleEffect&id=cesiumShadertoy)


![使用Shadertoy](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/expand/cesiumShadertoy.jpg)


## 效果说明

Cesium 地球上的 GIS 小特效。

> 单一效果 · Cesium.js

## 实现思路

- 自定义 Fabric 材质：向 `Material._materialCache` 注册 type，在 `czm_getMaterial` 里改 diffuse/alpha。`Property.getValue` 每帧回传 uniform（常见是 `time`），驱动纹理滚动或颜色变化。

- 局部 ENU → 世界坐标：`Transforms.eastNorthUpToFixedFrame`，雷达/箭头类特效常用。

## 着色器

### Fabric 片元

- `material.diffuse/alpha`：输出最终颜色与透明度
- 先取 Cesium 默认 material，再改 diffuse/alpha

```glsl
czm_getMaterial(czm_materialInput materialInput) {
                czm_material material = czm_getDefaultMaterial(materialInput);
                vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
                mainImage(color, materialInput.st * iResolution);
                material.diffuse = color.rgb;
                material.alpha = 1.0;
                return material;
            }
```

## 源码

```js
import * as Cesium from 'cesium'

const viewer = new Cesium.Viewer(document.getElementById('box'), {
    animation: false,
    baseLayerPicker: false,
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(
        Cesium.ArcGisMapServerImageryProvider.fromUrl('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')
    ),
    fullscreenButton: false,
    timeline: false,
    infoBox: false,
});

const customMaterial = new Cesium.Material({
    translucent: false,
    fabric: {
        type: "CustomBoxShader",
        uniforms: {
            iTime: 0.0,
            iResolution: new Cesium.Cartesian2(1024, 1024),
        },
        source: `
            uniform float iTime;
            uniform vec2 iResolution;
            void mainImage( out vec4 o, vec2 u )
            {
                vec2 v = iResolution.xy;
                u = .2*(u+u-v)/v.y;    
                vec4 z = o = vec4(1,2,3,0);
                for (float a = .5, t = iTime, i; ++i < 19.; 
                    o += (1. + cos(z+t))  / length((1.+i*dot(v,v)) * sin(1.5*u/(.5-dot(u,u)) - 9.*u.yx + t))
                    )  
                    v = cos(++t - 7.*u*pow(a += .03, i)) - 5.*u, 
                    u += tanh(40. * dot(u *= mat2(cos(i + .02*t - vec4(0,11,33,0))), u)
                    * cos(1e2*u.yx + t)) / 2e2 + .2 * a * u + cos(4./exp(dot(o,o)/1e2) + 
```

