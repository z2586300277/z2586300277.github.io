---
title: "UV图像变换 - Three.js 案例讲解"
description: "原场景 + 后期 Pass 叠加。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,effectComposer,UV图像变换"
outline: deep
---
# UV图像变换

*UV Transform*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=effectComposer&id=uvTransformation)

![UV图像变换](https://z2586300277.github.io/3d-file-server/images/four/uvTransformation.png)

## 你将学到什么

- EffectComposer 后期处理管线
- 相机交互控制器
- 轮廓高亮 OutlinePass
- requestAnimationFrame 渲染循环

## 效果说明

原场景 + 后期 Pass 叠加。

> 后期处理 · Three.js

## 核心概念

- **EffectComposer** 多 Pass 链式渲染：RenderPass → 特效 Pass → 输出屏幕。`composer.render()` 替代 `renderer.render()`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- 选中物体外轮廓发光，常用于编辑器选中态。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. EffectComposer 组装 Pass 链并 render

## 代码要点

- **`resize()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RenderPass, EffectPass, EffectComposer, GodRaysEffect } from 'postprocessing'
// Max Muselmann https://unsplash.com/photos/oIVvGqqwVJw
const image_url =
  FILE_HOST + "images/four/photo-1583766395091-2eb9994ed094.avif";
const image_ratio = 687 / 1031;
const image_tex = new THREE.TextureLoader().load(image_url);
image_tex.repeat.set(1, 1);

// Daniil Silantev https://unsplash.com/photos/dxGTQArsC3M
const alpha_url =
  FILE_HOST + "images/four/photo-1510942752400-ebce99a8a2c0.avif";
const alpha_tex = new THREE.TextureLoader().load(alpha_url);
alpha_tex.repeat.set(0.6, 2);
alpha_tex.offset.x = (1 - alpha_tex.repeat.x) / 2;
alpha_tex.wrapT = THREE.RepeatWrapping;

// ----
// main
// ----

const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 100);
const controls = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 0, 1);
controls.enableDamping = true;

const light = new THREE.DirectionalLight();
light.position.set(0, 0, 1);
scene.add(light);

const geom = new THREE.PlaneGeometry(image_ratio * 2, 2);
const mat = new THREE.MeshLambertMaterial({
  alphaMap: alpha_tex,
  alphaTest: 0.15,
  map: image_tex,
});
const mesh = new THREE.Mesh(geom, mat);
scene.add(mesh);

const wall = new THREE.Mesh(
  geom,
  new THREE.MeshBasicMaterial({
    alphaMap: alpha_tex,
    alphaTest: 0.15,
    map: image_tex,
  })
);
wall.scale.setScalar(1.2);
wall.position.z = -0.1;
scene.add(wall);

// ----
// render
// ----

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const effect = new GodRaysEffect(camera, wall, {
  density: 1,
  decay: 0.96,
  weight: 1,
});
const effectPass = new EffectPass(camera, effect);
composer.addPass(renderPass);
composer.addPass(effectPass);

renderer.setAnimationLoop((t) => {
  composer.render();
  controls.update();
  alpha_tex.offset.y = t * -0.001;
});

// ----
// view
// ----

function resize(w, h, dpr = devicePixelRatio) {
  renderer.setPixelRatio(dpr);
  // renderer.setSize(w, h, false)
  composer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
addEventListener("resize", () => resize(innerWidth, innerHeight));
dispatchEvent(new Event("resize"));
document.body.prepend(renderer.domElement);
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=effectComposer&id=uvTransformation) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [后期处理目录](/examples/three/effectComposer/)

> 后期处理 · Three.js
