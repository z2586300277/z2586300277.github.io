---
title: "一团揉动 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,一团揉动"
outline: deep
---
# 一团揉动

*Blob Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=blobShader)

![一团揉动](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/blobShader.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 实时阴影 ShadowMap
- 天空盒与环境贴图
- 点云 / 粒子 / 实例化渲染

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- 阴影四步：`renderer.shadowMap.enabled`、光源 `castShadow`、物体 `castShadow`、地面 `receiveShadow`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`createWorld()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`onWindowResize()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createPrimitive()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createGUI()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`animation()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from 'dat.gui'
import gsap from 'gsap'

var Theme = {
  primary: 0xFFFFFF,
  secundary: 0x292733,
  danger: 0xFF0000,
  darker: 0x000000
};

// reference https://codepen.io/vcomics/pen/ZwNgvX
var scene, camera, renderer, mat;
var _width, _height;
var _primitive;
var shapeGroup = new THREE.Group();
var start = Date.now();

function createWorld() {
  _width = window.innerWidth;
  _height= window.innerHeight;
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color(Theme.secundary);
  
  camera = new THREE.PerspectiveCamera(35, _width/_height, 1, 1000);
  camera.position.set(0,10,26);
  
  renderer = new THREE.WebGLRenderer({antialias:false, alpha:false});
  renderer.setSize(_width, _height);
  renderer.shadowMap.enabled = true;

  const controls = new OrbitControls(camera, renderer.domElement)
  
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

var primitiveElement = function() {
  this.mesh = new THREE.Object3D();
  mat = new THREE.ShaderMaterial( {
    side:THREE.DoubleSide,
    uniforms: {
      time: {
        type: "f",
        value: 0.1
      },
      pointscale: {
        type: "f",
        value: 0.2
      },
      decay: {
        type: "f",
        value: 0.3
      },
      size: {
        type: "f",
        value: 0.3
      },
      displace: {
        type: "f",
        value: 0.3
      },
      complex: {
        type: "f",
        value: 0.0
      },
      waves: {
        type: "f",
        value: 0.10
      },
      eqcolor: {
        type: "f",
        value: 0.0
      },
      rcolor: {
        type: "f",
        value: 0.0
      },
      gcolor: {
        type: "f",
        value: 0.0
      },
      bcolor: {
        type: "f",
        value: 0.0
      },
      fragment: {
        type: "i",
        value: true
      },
      redhell: {
        type: "i",
        value: true
      }
    },
    vertexShader: `
    vec3 mod289(vec3 x)
    {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
  
    vec4 mod289(vec4 x)
    {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
  
    vec4 permute(vec4 x)
    {
      return mod289(((x*34.0)+1.0)*x);
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=blobShader) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
