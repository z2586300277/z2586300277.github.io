---
title: "程序化地形生成 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `init_scene`、`add_helper`。"
head:
  - - meta
    - name: keywords
      content: "three.js,程序化地形生成"
outline: deep
---

# 程序化地形生成

*Terrain*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=terrain)


![程序化地形生成](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/generate_terrain.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `init_scene`、`add_helper`。

> 应用场景 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `render()` — renderer.render(scene, camera)

## 源码

```js
import {
    Scene,
    Color,
    Fog,
    PerspectiveCamera,
    WebGLRenderer,
    DirectionalLight,
    AmbientLight,
    GridHelper,
    PlaneGeometry,
    Mesh,
    ShaderMaterial,
    DoubleSide,
  } from "three";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

  let scene,
    camera,
    renderer,
    controls;
  let init_scene = () => {
    scene = new Scene();
    scene.background = new Color(0.5, 1, 0.875);
    scene.fog = new Fog(scene.background, 20, 45);
    camera = new PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
    let vHeight = 3;
    camera.position.set(30, vHeight + 2, 20).setLength(15);
    renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(innerWidth, innerHeight);
    document.body.appendChild(renderer.domElement);
    window.addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    });
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, vHeight, 0);
    controls.update();
    controls.minPolarAngle = Math.PI * 0.4;
    controls.maxPolarAngle = Math.PI * 0.5;
    controls.minDistance = 10;
    controls.maxDistance = 20;
    controls.enableDamping = true;
    controls.enablePan = false;
    let
```

