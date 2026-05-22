---
title: "第一人称移动 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `createCyberpunkMaterial`、`createVolumetricSpotlight`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,第一人称移动,动画效果"
outline: deep
---

# 第一人称移动

*First Move*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=animation&id=personFirstMove)


![第一人称移动](https://z2586300277.github.io/three-cesium-examples/threeExamples/animation/personFirstMove.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `createCyberpunkMaterial`、`createVolumetricSpotlight`。

> 动画效果 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 点击选中：`Raycaster` + 鼠标 NDC 坐标，`intersectObjects` 取交点。

## 独立函数

- `createCyberpunkMaterial()` — 材质 / GLSL
- `createVolumetricSpotlight()` — 材质 / GLSL
- `createNeonPointLight()` — 材质 / GLSL
- `createGodRays()` — 材质 / GLSL
- `createAtmosphericGlow()` — 材质 / GLSL
- `createEnvironmentalRimLighting()` — 材质 / GLSL
- `createProceduralLightning()` — 材质 / GLSL

## 源码

```js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { MeshBVH, acceleratedRaycast, computeBoundsTree } from 'three-mesh-bvh';

// 启用 BVH 加速光线投射
THREE.Mesh.prototype.raycast = acceleratedRaycast;

// 初始化场景、相机和渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建赛博朋克着色器材质
function createCyberpunkMaterial(originalColor) {
  const cyberpunkVertexShader = `
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    
    void main() {
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  
  const cyberpunkFragmentShader = `
    uniform vec3 baseColor;
    uniform float time;
    uniform vec3 neonColor1;
    uniform vec3 neonColor2;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    
    // 简单噪声函数
    float hash(vec
```

