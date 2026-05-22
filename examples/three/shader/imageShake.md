---
title: "图片抖动 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `init`、`createScene`。"
head:
  - - meta
    - name: keywords
      content: "three.js,图片抖动"
outline: deep
---

# 图片抖动

*Image Shake*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=imageShake)


![图片抖动](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/imageShake.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `init`、`createScene`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 点精灵/粒子：`Points` + `PointsMaterial`，或自定义 shader 控 size/颜色。

## 独立函数

- `init()` — Scene / Camera / Renderer 初始化
- `createPaticles()` — 材质 / GLSL
- `tick()` — 材质 / GLSL
- `update()` — 材质 / GLSL
- `render()` — renderer.render(scene, camera)

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
uniform float amplitude;
          attribute vec3 customColor;
          varying vec3 vColor;
          void main() {
            vColor = customColor;
            vec4 pos = vec4(position, 1.0);
            pos.z *= amplitude;
            vec4 mvPosition = modelViewMatrix * pos;
            gl_PointSize = 2.0 * ( 300.0 / -mvPosition.z );
            gl_Position = projectionMatrix * mvPosition;
          }
```

### 片元

- 片元输出 gl_FragColor

```glsl
varying vec3 vColor;
          void main() {
            gl_FragColor = vec4( vColor, 1.0 );
          }
```

## 源码

```js
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';

var container;
var camera, scene, renderer;
var controls;

var shaderUniforms, shaderAttributes;

var particles = [];
var particleSystem;

var imageWidth = 640;
var imageHeight = 400;
var imageData = null;

var animationTime = 0;
var animationDelta = 0.005;

init();
// tick();

function init() {
  createScene();
  createControls();
  createPixelData();

  window.addEventListener('resize', onWindowResize, false);
}

function createScene() {
  container = document.getElementById('box');

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 3000;
  camera.lookAt(scene.position)

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);

  container.appendChild(renderer.domElement);

  scene.add(new THREE.AxesHelper(1000));
  scene.add(new THREE.AmbientLight(0xffffff, 3));
}

function createControls() {
    
  controls = new TrackballControls(camera, renderer.domElement);

  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;

  controls.noZoom = false;
  controls.noPan = true;


```

