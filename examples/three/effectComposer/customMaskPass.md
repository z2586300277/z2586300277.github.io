---
title: "自定义遮罩通道 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `ScreenMaskPass`。"
head:
  - - meta
    - name: keywords
      content: "three.js,自定义遮罩通道"
outline: deep
---

# 自定义遮罩通道

*Custom Mask*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=customMaskPass)


![自定义遮罩通道](https://z2586300277.github.io/three-cesium-examples/threeExamples/effectComposer/customMaskPass.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `ScreenMaskPass`。

> 后期处理 · Three.js

## 实现思路

- 后期：`EffectComposer` 串 Pass，先 `RenderPass` 出场景，再 bloom/SSAO 等屏幕 Pass。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 类与方法

### ScreenMaskPass

- `constructor()` — 初始化成员

## 独立函数

- `animate()` — rAF：update controls + render

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
varying vec2 vUv;
                void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }
```

### 片元

```glsl
uniform float opacity;
                uniform float intensity;
                uniform sampler2D tDiffuse;
                uniform vec3 maskColor;
                uniform float R;
                uniform float sr;
                varying vec2 vUv;
                void main() {
                // 阴影颜色
                vec4 texel = texture2D( tDiffuse, vUv );
                // 距离中心的距离
                float dist = sqrt((vUv.x-0.5)*(vUv.x-0.5)+(vUv.y-0.5)*(vUv.y-0.5));
                // 渐变, sr 是开始黑色参数
                float rr = (sr - smoothstep(R, R + 0.5, dist));
                /
```

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'

class ScreenMaskPass extends ShaderPass {

    constructor() {

        super({

            name: 'ScreenMaskShader',

            uniforms: {
                tDiffuse: { value: null },
                opacity: { value: 1.0 },
                intensity: { value: 2.0 },
                maskColor: { value: new THREE.Color(1, 1, 1) },
                R: { value: 0.1 },
                sr: { value: 1.2 }
            },

            vertexShader: `
                varying vec2 vUv;
                void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }
            `,

            fragmentShader: `
                uniform float opacity;
                uniform float intensity;
                uniform sampler2D tDiffuse;
                uniform vec3 maskColor;
                uniform float R;
                uniform float sr;
                varying vec2 vUv;
                void main() {
                // 阴影颜色
```

