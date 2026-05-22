---
title: "图片抖动 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,图片抖动"
outline: deep
---
# 图片抖动

*Image Shake*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=imageShake)

![图片抖动](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/imageShake.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 点云 / 粒子 / 实例化渲染
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **Points** 大量顶点用点精灵渲染；**InstancedMesh** 相同几何体批量绘制，降低 draw call。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`createScene()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createControls()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createPixelData()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createPaticles()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`tick()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`update()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

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

  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;
}

function createPixelData() {
    var image = document.createElement("img");
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    
    image.crossOrigin = "Anonymous";
    image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;
        imageWidth = image.width;
        imageHeight = image.height;
      
      context.fillStyle = context.createPattern(image, 'no-repeat');
      context.fillRect(0, 0, imageWidth, imageHeight);
      
      imageData = context.getImageData(0, 0, imageWidth, imageHeight).data;

      createPaticles();
      tick();
    };
    
    image.src = HOST + 'files/author/z2586300277.png'
  }

  function createPaticles() {
    var colors = [];
    var weights = [0.2126, 0.7152, 0.0722];
    var c = 0;

    var geometry, material;
    var x, y;
    var zRange = 400;

    geometry = new THREE.BufferGeometry();
    var positions = [];
    var colors = [];

    x = imageWidth * -0.5;
    y = imageHeight * 0.5;

    shaderUniforms = {
      amplitude: {
        type: "f",
        value: 0.5
      },
      vertexColor: {
        type: "c",
        value: []
      }
    };

    var shaderMaterial = new THREE.ShaderMaterial({
        uniforms: shaderUniforms,
        vertexShader: `
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=imageShake) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
