---
title: "中国旗帜 - Three.js 案例讲解"
description: "RawShaderMaterial 顶点正弦波模拟旗面飘动与明暗"
head:
  - - meta
    - name: keywords
      content: "three.js,旗帜,RawShaderMaterial,顶点动画"
outline: deep
---

# 中国旗帜

*China Flag*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=shader&id=chinaFlag)

![中国旗帜](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/chinaFlag.jpg)

## 你将学到什么

- **RawShaderMaterial** 手写完整 GLSL（含 projectionMatrix 等）
- 高细分 **BoxGeometry** 当旗面
- 多频率 **sin** 叠加 Z 向波浪 + 杆边 **xFactor** 衰减
- `vDark` 传递位移量做片元明暗

## 效果说明

国旗贴图在薄盒体上飘动：靠旗杆处几乎不动，自由端波浪幅度大；褶皱处纹理变暗。

## 核心概念

### 顶点波浪

```glsl
float xFactor = clamp((modelPosition.x + 1.25) / 2.0, 0.0, 2.0);
float vWave = sin(modelPosition.x * uFrequency.x - uTime) * xFactor * uStrength;
vWave += sin(modelPosition.y * uFrequency.y - uTime) * xFactor * uStrength * 0.5;
modelPosition.z += vWave;
```

`xFactor` 让靠近旗杆（x 较小）顶点几乎不动。

### 片元明暗

```glsl
textColor.rgb *= vDark + 0.85;
```

波浪隆起处 `vDark` 较大，颜色略亮/略暗形成褶皱感。

### RawShaderMaterial

需自行声明 `attribute` / `uniform mat4 projectionMatrix` 等；不自动注入 Three chunk。

## 实现步骤

1. TextureLoader 加载国旗 JPG
2. BoxGeometry(3, 2, 0.025, 64, 64) 高细分
3. uniforms：`uTime`、`uFrequency`、`uStrength`、`uTexture`
4. animate 里 `uTime += 0.06`

## 源码

完整源码见 [GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/shader/chinaFlag.js)。

## 小结

- 布匹飘动 = 顶点 sin 组合 + 固定边衰减
- 上一篇：[海面](/examples/three/shader/oceanShader) · 下一篇：[圆波扫光](/examples/three/shader/circleWave)

> 着色器 · Three.js · 7/89
