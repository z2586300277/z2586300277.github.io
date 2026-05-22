---
title: "3d热力图-体积版 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `initPalette`、`animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,3d热力图-体积版,扩展功能"
outline: deep
---

# 3d热力图-体积版

*volumeHeatmap*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=Volumetric Heatmap)


![3d热力图-体积版](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/volumeHeatmap.webp)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `initPalette`、`animate`。

> 扩展功能 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 点击选中：`Raycaster` + 鼠标 NDC 坐标，`intersectObjects` 取交点。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render
- `onMouseMove()` — 材质 / GLSL
- `checkIntersection()` — 材质 / GLSL

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
varying vec3 vWorldPosition;
    varying vec3 vLocalPosition; // 新增局部坐标传递
    void main() {
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
       vLocalPosition = position; // 传递局部坐标（-size/2到size/2）
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
```

### 片元

```glsl
uniform sampler3D uVolume;
      uniform vec3 uResolution;
      uniform float uThreshold;
      uniform sampler2D uColorMap; // 取色带纹理
      uniform int uSteps;
      varying vec3 vWorldPosition;
      varying vec3 vLocalPosition;

      uniform vec3 uCursorPos;
      uniform float uCursorRadius;

      // 热力值转颜色（保持不变）
      vec3 heatmap(float value) {
        return texture2D(uColorMap, vec2(clamp(value, 0.0, 1.0), 0.5)).rgb;
      }

    void main() {
      // 1. 计算光线起点（相机位置）和方向（指向当前像素）
      vec3 rayOrigin = cameraPosition;
      vec3 rayDir = normalize(vWorldPosition - c
```

## 源码

```js
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {GUI} from "three/addons/libs/lil-gui.module.min.js"
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
console.log('Three.js 版本:', THREE.REVISION);
const gui = new GUI()

// 初始化场景、相机、渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(50, 100, 100)
camera.lookAt(0, 0, 0)
scene.add(camera);
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    logarithmicDepthBuffer: true
});
renderer.outputColorSpace = 'srgb'
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);

const cssRender = new CSS2DRenderer()
cssRender.setSize(window.innerWidth, window.innerHeight)
cssRender.domElement.style.position = "absolute"
cssRender.domElement.style.top = "0"
cssRender.domElement.style.zIndex = "3"
cssRender.domElement.style.pointerEvents = "none"
document.body.appendChild(cssRender.domElement)

// 添加性能监控
const stats = new Stats();
document.body.appendChild(stats.dom);
// 初始化控制器
const controls = new OrbitControls(camera, renderer.do
```

