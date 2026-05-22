---
title: "高斯模糊 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,高斯模糊"
outline: deep
---
# 高斯模糊

*Gaussian Blur*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=gaussianBlur)

![高斯模糊](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/gaussianBlur.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环
- GUI 面板调试参数
- Stats 性能监视

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`initLight()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`initModel()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`update()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`onWindowResize()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createGUI()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

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
  scene.add(light);
}

// model
function initModel() {
  const cubeShader = {
    uniforms: {
      tDiffuse: { type: 't', value: new THREE.TextureLoader().load(FILE_HOST + 'threeExamples/shader/dlam.jpg') },
      vScreenSize: { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      fScale: { type: "float", value: 10 },
    },
    vertexShader: `
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D tDiffuse;
      uniform vec2 vScreenSize;
      uniform float fScale;

      void main() {
        vec4 sum = vec4(0.0);
        float h = fScale/vScreenSize.x;
        float v = fScale/vScreenSize.y;

        //纵向高斯模糊
        sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y - 4.0 * v)) * (0.051/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y - 3.0 * v)) * (0.0918/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y - 2.0 * v)) * (0.12245/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y - 1.0 * v)) * (0.1531/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y)) * (0.1633/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y + 1.0 * v)) * (0.1531/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y + 2.0 * v)) * (0.12245/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y + 3.0 * v)) * (0.0918/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y + 4.0 * v)) * (0.051/2.0);

        //横向高斯模糊
        sum += texture2D(tDiffuse, vec2(vUv.x - 4.0 * h, vUv.y)) * (0.051/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x - 3.0 * h, vUv.y)) * (0.0918/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x - 2.0 * h, vUv.y)) * (0.12245/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x - 1.0 * h, vUv.y)) * (0.1531/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y)) * (0.1633/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x + 1.0 * h, vUv.y)) * (0.1531/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x + 2.0 * h, vUv.y)) * (0.12245/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x + 3.0 * h, vUv.y)) * (0.0918/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x + 4.0 * h, vUv.y)) * (0.051/2.0);

        gl_FragColor = sum;
      }
    `,
  }

  cubeMaterial = new THREE.ShaderMaterial({
    uniforms: cubeShader.uniforms,
    vertexShader: cubeShader.vertexShader,
    fragmentShader: cubeShader.fragmentShader,
    side: THREE.DoubleSide
  });

  var geometry = new THREE.PlaneGeometry();
  var cube = new THREE.Mesh(geometry, cubeMaterial);
  scene.add(cube);
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=gaussianBlur) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
