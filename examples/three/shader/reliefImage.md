---
title: "浮雕图像 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `init`、`initLight`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,浮雕图像,着色器"
outline: deep
---

# 浮雕图像

*Relief Image*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=reliefImage)


![浮雕图像](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/reliefImage.jpg)


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
varying vec2 vUv;
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
        }
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
    var light = new THREE.DirectionalLight(0xf
```

