---
title: "浮雕图像 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,浮雕图像"
outline: deep
---
# 浮雕图像

*Relief Image*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=reliefImage)

![浮雕图像](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/reliefImage.jpg)

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
            fScale: { type: "float", value: 100.00 },
        },
        vertexShader: `  varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
        fragmentShader: `  varying vec2 vUv;
        uniform sampler2D tDiffuse;
        uniform float fScale;
        const highp vec3 W = vec3(0.2125, 0.7154, 0.0721);
        const vec4 bkColor = vec4(0.5, 0.5, 0.5, 1.0);
      
        void main() {
          vec2 upLeftUV = vec2(vUv.x-1.0/fScale, vUv.y-1.0/fScale);
          vec4 curColor = texture2D(tDiffuse, vUv);
          vec4 upLeftColor = texture2D(tDiffuse, upLeftUV);
          vec4 delColor = curColor - upLeftColor;
          float luminance = dot(delColor.rgb, W);
          gl_FragColor = vec4(vec3(luminance), 0.0) + bkColor;
        }`,
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
}

function update() {
    requestAnimationFrame(update);
    renderer.render(scene, camera);

    controls.update();
    stats.update();
}

function onWindowResize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
}

function createGUI() {
    var gui = new GUI();
    gui.add(cubeMaterial.uniforms['fScale'], 'value', 50.0, 500.0).step(1.0).name('fScale');
}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=reliefImage) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
