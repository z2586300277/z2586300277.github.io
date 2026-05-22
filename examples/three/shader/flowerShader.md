---
title: "花 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,花"
outline: deep
---
# 花

*Flower Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=flowerShader)

![花](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/flowerShader.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 实时阴影 ShadowMap
- 天空盒与环境贴图
- GSAP / anime.js 属性动画
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- 阴影四步：`renderer.shadowMap.enabled`、光源 `castShadow`、物体 `castShadow`、地面 `receiveShadow`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

- 时间线库驱动 position/rotation/uniform，与 rAF 渲染循环配合。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`createWorld()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`onWindowResize()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createLights()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createGUI()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createPrimitive()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`animation()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "dat.gui";

var scene, camera, renderer;
var _width, _height;
var mat;

function createWorld() {
  _width = window.innerWidth;
  _height= window.innerHeight;
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 5, 15);
  scene.background = new THREE.Color(0x000000);
  camera = new THREE.PerspectiveCamera(35, _width/_height, 1, 1000);
  camera.position.set(0,0,10);
  renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
  renderer.setSize(_width, _height);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);
}
function onWindowResize() {
  _width = window.innerWidth;
  _height = window.innerHeight;
  renderer.setSize(_width, _height);
  camera.aspect = _width / _height;
  camera.updateProjectionMatrix();
  console.log('- resize -');
}

var _ambientLights, _lights;
function createLights() {
  _ambientLights = new THREE.HemisphereLight(0xFFFFFF, 0x000000, 1.4);
  _lights = new THREE.PointLight(0xFFFFFF, .5);
  _lights.position.set(20,20,20);
  scene.add(_ambientLights);
}

var uniforms = {
  time: {
    type: "f",
    value: 1.0
  },
  pointscale: {
    type: "f",
    value: 1.0
  },
  decay: {
    type: "f",
    value: 2.0
  },
  complex: {
    type: "f",
    value: 2.0
  },
  waves: {
    type: "f",
    value: 3.0
  },
  eqcolor: {
    type: "f",
    value: 3.0
  },
  fragment: {
    type: 'i',
    value: false
  },
  dnoise: {
    type: 'f',
    value: 0.0
  },
  qnoise: {
    type: 'f',
    value: 4.0
  },
  r_color: {
    type: 'f',
    value: 0.0
  },
  g_color: {
    type: 'f',
    value: 0.0
  },
  b_color: {
    type: 'f',
    value: 0.0
  }
}

var speedRandom = Math.random(10) / 10000;

var options = {
  perlin: {
    vel: 0.002,
    speed: speedRandom,
    perlins: 1.0,
    decay: 0.40,
    complex: 0.0,
    waves: 10.0,
    eqcolor: 11.0,
    fragment: false,
    redhell: true
  },
  rgb: {
    r_color: 6.0,
    g_color: 0.0,
    b_color: 0.2
  },
  cam: {
    zoom: 10
  }
}
function createGUI() {
  var gui = new dat.GUI();
  var configGUI = gui.addFolder('Setup');
  configGUI.add(options.perlin, 'speed', 0.0, 0.001);
  configGUI.add(options.cam, 'zoom', 0, 30);
  configGUI.open();
  var perlinGUI = gui.addFolder('Perlin');
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=flowerShader) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
