---
title: "交通线路 - Cesium.js 案例讲解"
description: "Cesium 接第三方库或扩展能力。主流程在 `registerFlowLineMaterial`、`loadLinesData`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,交通线路,扩展功能"
outline: deep
---

# 交通线路

*Transport Line*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=expand&id=transportLine)


![交通线路](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/expand/transportLine.jpg)


## 效果说明

Cesium 接第三方库或扩展能力。主流程在 `registerFlowLineMaterial`、`loadLinesData`。

> 扩展功能 · Cesium.js

## 实现思路

- 自定义 Fabric 材质：向 `Material._materialCache` 注册 type，在 `czm_getMaterial` 里改 diffuse/alpha。`Property.getValue` 每帧回传 uniform（常见是 `time`），驱动纹理滚动或颜色变化。

## 独立函数

- `registerFlowLineMaterial()` — 材质 / GLSL
- `updateLines()` — 移除 Entity / 解绑监听

## 源码

```js
import * as Cesium from 'cesium'
import * as dat from 'dat.gui'

// 注册自定义流动线材质
function registerFlowLineMaterial() {
    Cesium.Material.PolylineFlowType = 'PolylineFlow';
    Cesium.Material.PolylineFlowSource = `
        uniform vec4 color;
        uniform float speed;
        uniform float percent;
        uniform float gradient;
        
        czm_material czm_getMaterial(czm_materialInput materialInput) {
            czm_material material = czm_getDefaultMaterial(materialInput);
            
            // 获取纹理坐标
            float st = materialInput.st.s;
            
            // 计算流动效果
            float time = czm_frameNumber * speed / 1000.0;
            float currentPos = fract(time - st);
            
            // 计算流动边缘
            float trailPos = smoothstep(0.0, percent, currentPos);
            float glowPos = smoothstep(0.0, gradient * percent, currentPos) * 
                           smoothstep(percent, percent * (1.0 - gradient), currentPos);
            
            // 计算颜色
            vec4 trailColor = color;
            vec4 glowColor = vec4(color.rgb * 1.5, color.a * 0.5);
            
            material.diffuse = color.rgb;
            material.alpha = trailPos * color.a;
            material.emission = glowPos * glowColor.rgb;
            
            return material;
        }
    `;

    // 修改着色器代码，增加更丰富的视
```

