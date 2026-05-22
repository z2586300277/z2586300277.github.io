---
title: "燃烧烟雾 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`、`rand`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,燃烧烟雾,着色器"
outline: deep
---

# 燃烧烟雾

*Smoke*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=smoke)


![燃烧烟雾](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/smoke.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`、`rand`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 大量重复物体用 `InstancedMesh`，一次 draw call；矩阵写 `setMatrixAt`。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

## 独立函数

- `animate()` — rAF：update controls + render

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
attribute vec3 offset; attribute vec2 scale; attribute vec3 quaternion; attribute float rotation;
        attribute vec4 color; attribute float blend; uniform float time; varying vec2 vUv;
        varying vec4 vColor; varying float vBlend;
        void main() {
            float a = time * rotation, c = cos(a), s = sin(a);
            vec3 vR = vec3(position.x*scale.x*c - position.y*scale.y*s, position.y*scale.y*c + position.x*scale.x*s, 0.0);
            vec3 vL = offset - cameraPosition, up = vec3(0,1,0);
            vec3 right = normalize(cross(vL, up));
            vec3 vP = vR.x *
```

### 片元

- 片元输出 gl_FragColor

```glsl
uniform sampler2D map; varying vec2 vUv; varying vec4 vColor; varying float vBlend;
        void main() {
            vec4 c = texture2D(map, vUv) * vColor;
            gl_FragColor = c; gl_FragColor.rgb *= gl_FragColor.a; gl_FragColor.a *= vBlend;
        }
```

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 基础场景设置
const DOM = document.querySelector("#box"), width = DOM.clientWidth, height = DOM.clientHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor(0xbfe3dd, 1)
renderer.setSize(width, height);
DOM.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 100000).translateX(5);
new OrbitControls(camera, renderer.domElement).target.set(0, 0.5, 0);

// 核心变量
const clock = new THREE.Clock(), particles = [];
let delta = 0, emitTime = 0;

// 粒子配置
const config = {
    wind: [0.001, 0, 0],
    emit: { pos: [0, 0, 0], r1: 0.1, r2: 0.8, height: 8, rate: 0.05, maxPerFrame: 3 },
    particle: {
        life: [4, 5], rot: [0.2, 0.4], speed: [0.008, 0.012], 
        scale: 0.3, growth: 0.006, fade: 0.006, opacity: 0.8, blend: 0.95,
        color: { start: [0.8, 0.8, 0.8], end: [0.2, 0.2, 0.2], speed: [0.3, 0.4] },
        brightness: [0.8, 1]
    }
};

// 工具函数
const rand = (a, b) => a + Math.random() * (b - a);
const randCircle = (r) => {
    const rad = r * Math.sqrt(Math.random()), ang = Math.PI * 2 * Math.random();
    return [rad * Math.cos(ang), rad * Math.sin(ang)];
};

// 创建几何体
const geo = new THREE.InstancedBu
```

