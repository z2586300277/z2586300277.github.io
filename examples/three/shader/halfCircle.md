---
title: "半圆 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `init`、`createRayMarchingFireMaterial`。"
head:
  - - meta
    - name: keywords
      content: "three.js,半圆"
outline: deep
---

# 半圆

*Half Circle*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=halfCircle)


![半圆](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/halfCircle.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `init`、`createRayMarchingFireMaterial`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `init()` — Scene / Camera / Renderer 初始化
- `createRayMarchingFireMaterial()` — 材质 / GLSL
- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'

var scene, camera, renderer, clock, controller, stats
var shader_material, rayMarchingFireMaterial, shaderMaterial
const vs = `
varying vec2 vUv;
varying vec3 vPosition;

void main(){
    vec4 modelPosition=modelMatrix*vec4(position,1.);
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPosition;
    gl_Position=projectedPosition;
    
    vUv=uv;
    vPosition=position;
}
`;

const fs = `
      #define PI 3.1415926535897932384626433832795
      varying vec2 vUv;

      uniform float uTime;

      vec2 rotatePoint(vec2 center,float angle,vec2 p) {
        float s = sin(angle);
        float c = cos(angle);

        // translate point back to origin:
        p.x -= center.x;
        p.y -= center.y;

        // rotate point
        float xNew = p.x * c - p.y * s;
        float yNew = p.x * s + p.y * c;

        // translate point back:
        p.x = xNew + center.x;
        p.y = yNew + center.y;
        return p;
      }

      float angleVec(vec2 a_, vec2 b_) {
          vec3 a = vec3(a_, 0);
          vec3 b = vec3(b_, 0);
          float dotProd = dot(a,b); 
          vec3 crossprod = cross(a,b);
          float cr
```

