---
title: "火球效果 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `init`、`createScene`。"
head:
  - - meta
    - name: keywords
      content: "three.js,火球效果"
outline: deep
---

# 火球效果

*Fireball*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=fireball)


![火球效果](https://z2586300277.github.io/3d-file-server/images/four/fireball.png)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `init`、`createScene`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 后期：`EffectComposer` 串 Pass，先 `RenderPass` 出场景，再 bloom/SSAO 等屏幕 Pass。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `init()` — Scene / Camera / Renderer 初始化
- `mesh()` — 材质 / GLSL
- `updateDraw()` — 材质 / GLSL

## 源码

```js
<!DOCTYPE html><html lang="en"><head>
    <title>three.js</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
  </head>
  <body>
    <script type="importmap">
        {
          "imports": {
            "three": "https://threejs.org/build/three.module.js",
            "three/addons/": "https://threejs.org/examples/jsm/"
          }
        }
      </script>

    <script type="module">
      import * as THREE from "three";
      import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
      import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
      import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
      import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
      import { OrbitControls } from "three/addons/controls/OrbitControls.js";
      import { GUI } from "three/addons/libs/lil-gui.module.min.js";

      const ENTIRE_SCENE = 0,
        BLOOM_SCENE = 1;

      const bloomLayer = new THREE.Layers();
      bloomLayer.set(BLOOM_SCENE);
      const materials = {};
      const darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });

      const vert = `
    varying vec3 vNormal;
    varying vec3 camPos;
    varying vec2 vUv;

    void main() {
    vNor
```

