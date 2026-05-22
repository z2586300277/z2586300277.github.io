---
title: "波涛海浪 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `tick`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,波涛海浪,着色器"
outline: deep
---

# 波涛海浪

*move Sea*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=raningSea)


![波涛海浪](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/raningSea.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `tick`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

// refer https://codepen.io/aderaaij/pen/XWpMONO
const vertexShader = ` #include <fog_pars_vertex>

uniform float uTime;

uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWaveSpeed;

uniform  float uSmallWavesElevation;
uniform  float uSmallWavesFrequency;
uniform  float uSmallWavesSpeed;
uniform float uSmallWavesIterations;

varying float vElevation;

//	Classic Perlin 3D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(g
```

