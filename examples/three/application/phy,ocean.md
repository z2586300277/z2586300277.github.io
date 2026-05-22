---
title: "具有物理效果的卡通海面 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `initScene`、`setSky`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,具有物理效果的卡通海面,应用场景"
outline: deep
---

# 具有物理效果的卡通海面

*Cartoon Ocean*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=phy,ocean)


![具有物理效果的卡通海面](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/cartoon_ocean.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `initScene`、`setSky`。

> 应用场景 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

## 独立函数

- `setSky()` — 材质 / GLSL
- `updateSun()` — 材质 / GLSL
- `initOceanAndSphere()` — 材质 / GLSL
- `animate()` — rAF：update controls + render

## 源码

```js
/**
 * 卡通海面
 */

import { Scene, PerspectiveCamera, WebGLRenderer, DirectionalLight, MathUtils, PMREMGenerator, AmbientLight, PlaneGeometry, Clock, Mesh, MeshBasicMaterial, Vector3, BoxGeometry, Box3, BufferGeometry, Float32BufferAttribute, BufferAttribute, Matrix4, ShaderMaterial, } from "three";
import { OrbitControls, Sky } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const three = document.getElementById("box");
let scene, camera, renderer, controls;
// onMounted(() => {
//     initScene();
//     initOceanAndSphere();
// });
// onBeforeUnmount(() => {
//     cancelAnimationFrame(rf);
//     window.removeEventListener("resize", onWindowResize);
// });
const clock = new Clock();
function initScene() {
    scene = new Scene();
    camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(30, 5, 20);
    renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    three.appendChild(renderer.domElement);
    //utils.setSkyFromTexture(scene, renderer)
    // .setSky(scene, renderer);
    setSky(scene, renderer)
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    c
```

