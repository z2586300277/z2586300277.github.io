---
title: "等高线 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `PerlinNoise`。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,等高线"
outline: deep
---
# 等高线

*Contour Line*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=contourLine)

![等高线](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/contourLine.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时
- GUI 面板调试参数

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `PerlinNoise`。

> 着色器 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "dat.gui";

const canvas = document.createElement("canvas");
canvas.style.width = "100vw !important";
canvas.style.height = "100vh !important";
document.body.appendChild(canvas);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setClearColor(0x161616, 1);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(90, 1, 0.1, 1000);
camera.position.set(0, 26, 40);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.maxDistance = 25;

class PerlinNoise {
  static noise(x, y) {
    const posIntX = Math.floor(x);
    const posIntY = Math.floor(y);
    const posFloatX = x - posIntX;
    const posFloatY = y - posIntY;

    const sx = PerlinNoise.cubicInterpolate(posFloatX);
    const sy = PerlinNoise.cubicInterpolate(posFloatY);

    const v00 = PerlinNoise.hash(posIntX, posIntY);
    const v10 = PerlinNoise.hash(posIntX + 1, posIntY);
    const v01 = PerlinNoise.hash(posIntX, posIntY + 1);
    const v11 = PerlinNoise.hash(posIntX + 1, posIntY + 1);

    const v0 = PerlinNoise.mix(v00, v10, sx);
    const v1 = PerlinNoise.mix(v01, v11, sx);
    return PerlinNoise.mix(v0, v1, sy);
  }

  static mix(a, b, t) {
    return a * (1 - t) + b * t;
  }

  static hash(x, y) {
    const dot = x * 12.9898 + y * 78.233;
    const value = Math.sin(dot) * 43758.5453;
    return value - Math.floor(value);
  }

  static cubicInterpolate(x) {
    return 3.0 * Math.pow(x, 2.0) - 2.0 * Math.pow(x, 3.0);
  }
}

class GroundGeometry extends THREE.PlaneGeometry {
  constructor(width, height, widthSegments, heightSegments) {
    super(width, height, widthSegments, heightSegments);

    this.rotateX(-Math.PI / 2);

    const attr_pos = this.attributes.position;
    for (let i = 0; i < attr_pos.count; i++) {
      const x = attr_pos.getX(i);
      const z = attr_pos.getZ(i);

      attr_pos.setY(i, PerlinNoise.noise(x * 0.1, z * 0.1) * 12.0);
    }

    this.computeVertexNormals();
  }
}

const ground_geo = new GroundGeometry(50, 50, 60, 60);
const ground_mat = new THREE.ShaderMaterial({
  uniforms: {
    // 高度范围
    range: {
      value: 12.0,
    },
    // 等高线宽度
    lw: {
      value: 0.1,
    },
    // 等高线段数
    ln: {
      value: 10,
    },
    // 背景色
    c_bg: {
      value: new THREE.Color(0x161616),
    },
    // 等高线颜色 0
    c_l_0: {
      value: new THREE.Color(0x01bbbff),
    },
    c_l_1: {
      value: new THREE.Color(0xff4199),
    },
    // 时间
    t: {
      value: 0.0,
    },
  },
  vertexShader: /* glsl */ `
    uniform  float  range  ;

    varying  vec3  vPos     ;
    varying  vec3  vNormal  ;

    void main() {
      vec3 pos = position;

      vPos = pos;
      vNormal = normalize(normal);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=contourLine) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
