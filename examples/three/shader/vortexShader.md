---
title: "扭曲 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `init`、`initLight`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,扭曲,着色器"
outline: deep
---

# 扭曲

*Vortex Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=vortexShader)


![扭曲](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/vortexShader.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `init`、`initLight`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `init()` — Scene / Camera / Renderer 初始化
- `initLight()` — 材质 / GLSL
- `initModel()` — 材质 / GLSL
- `update()` — 材质 / GLSL
- `onWindowResize()` — 材质 / GLSL
- `createGUI()` — 材质 / GLSL

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
```

### 片元

- 片元输出 gl_FragColor

```glsl
uniform sampler2D tDiffuse;
    varying vec2 vUv;
    uniform vec2 vScreenSize;
    uniform vec2 vCenter;
    uniform float fRadius;
    uniform float fUzuStrength;

    void main() {
      vec2 pos = (vUv * vScreenSize) - vCenter;
      float len = length(pos);
      if (len >= fRadius) {
        gl_FragColor = texture2D(tDiffuse, vUv);
        return;
      }

      float uzu = min(max(1.0 - (len / fRadius), 0.0), 1.0) * fUzuStrength;
      float x = pos.x * cos(uzu) - pos.y * sin(uzu);
      float y = pos.x * sin(uzu) + pos.y * cos(uzu);
      vec2 retPos = (vec2(x, y) + v
```

## 源码

```js
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";

var container;
var scene, camera, renderer;
var controls;
var stats;

var cubeMaterial;

init();
update();
createGUI();

function init() {
  container = document.getElementById('box');

  // scene
  scene = new THREE.Scene();

  // camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(1, 1, 1);
  camera.target = new THREE.Vector3(0, 0, 0);
  scene.add(camera);

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 2;
  controls.maxDistance = 10;
  stats = new Stats();
  document.body.appendChild(stats.dom);

  // light
  initLight();

  // model
  initModel();

  // event
  window.addEventListener('resize', onWindowResize, false);
}

function initLight() {
  var light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0, 200, 100);
  scene
```

