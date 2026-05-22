---
title: "溶解 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `tick`。"
head:
  - - meta
    - name: keywords
      content: "three.js,溶解"
outline: deep
---

# 溶解

*Dissolve*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=dissolve)


![溶解](https://z2586300277.github.io/3d-file-server/images/dissolve/dissolve.png)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `tick`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- GUI
- Tex
- glsl

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from 'dat.gui'
```

### GUI

```js
const gui = new dat.GUI()

// Container
const box = document.getElementById("box")

// Scene
const scene = new THREE.Scene()

/**
 * Loader
 */
const textureLoader = new THREE.TextureLoader()
```

### Tex

```js
const dissolveTex = textureLoader.load(FILE_HOST + 'images/dissolve/dissolveTex.png')
dissolveTex.colorSpace = THREE.SRGBColorSpace
const dissolveRampTex = textureLoader.load(FILE_HOST + 'images/dissolve/dissolveRamp.png')
dissolveRampTex.colorSpace = THREE.SRGBColorSpace
const diffuseTex = textureLoader.load(FILE_HOST + 'images/dissolve/diffuse.png')
diffuseTex.colorSpace = THREE.SRGBColorSpace

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(4, 3, 32, 32)

// Material
const shaderMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  vertexShader:
```

