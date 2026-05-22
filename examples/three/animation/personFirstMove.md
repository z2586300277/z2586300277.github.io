---
title: "第一人称移动 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,animation,第一人称移动"
outline: deep
---
# 第一人称移动

*First Move*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=animation&id=personFirstMove)

![第一人称移动](https://z2586300277.github.io/three-cesium-examples/threeExamples/animation/personFirstMove.jpg)

## 你将学到什么

- AnimationMixer 骨骼动画播放与过渡
- glTF/FBX/OBJ 外部模型加载
- 自定义 ShaderMaterial / 修改内置 shader
- 实时阴影 ShadowMap
- 点云 / 粒子 / 实例化渲染

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 动画效果 · Three.js

## 核心概念

- **AnimationMixer** 驱动 glTF 骨骼动画；每帧 `mixer.update(delta)`。动作切换可用 `crossFadeTo` 平滑过渡。

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- 阴影四步：`renderer.shadowMap.enabled`、光源 `castShadow`、物体 `castShadow`、地面 `receiveShadow`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. 定义材质/shader 与 uniforms，rAF 中更新
4. rAF 循环中 update 并 render

## 代码要点

- **`createCyberpunkMaterial()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createVolumetricSpotlight()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createNeonPointLight()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createGodRays()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createAtmosphericGlow()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createEnvironmentalRimLighting()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

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
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }
    
    void main() {
      // 基础颜色
      vec3 color = baseColor;
      
      // 扫描线效果
      float scanline = sin(vPosition.y * 50.0 + time * 2.0) * 0.5 + 0.5;
      scanline = smoothstep(0.3, 0.7, scanline);
      
      // 霓虹灯光效果 - 基于高度和位置
      float heightGlow = smoothstep(-0.5, 2.0, vPosition.y);
      float neonPulse = sin(time * 3.0 + vPosition.y * 2.0) * 0.5 + 0.5;
      
      // 网格线效果
      float gridX = abs(fract(vPosition.x * 2.0) - 0.5);
      float gridZ = abs(fract(vPosition.z * 2.0) - 0.5);
      float grid = smoothstep(0.48, 0.5, max(gridX, gridZ));
      
      // 随机霓虹灯闪烁
      float flicker = noise(vec2(vPosition.x, vPosition.z) * 0.5 + time * 0.5);
      flicker = step(0.7, flicker);
      
      // 边缘发光（Fresnel效果）
      vec3 viewDir = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);
      
      // 混合霓虹灯颜色
      vec3 neonColor = mix(neonColor1, neonColor2, neonPulse);
      
      // 应用效果
      color = mix(color, neonColor, heightGlow * 0.3);
      color += neonColor * scanline * 0.2;
      color += neonColor * grid * flicker * 0.5;
      color += neonColor * fresnel * 0.4;
      
      // 增加对比度和饱和度
      color = pow(color, vec3(1.2));
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;
  
  return new THREE.ShaderMaterial({
    uniforms: {
      baseColor: { value: originalColor },
      time: { value: 0 },
      neonColor1: { value: new THREE.Color(0x00ffff) }, // 青色霓虹
      neonColor2: { value: new THREE.Color(0xff00ff) }  // 品红色霓虹
    },
    vertexShader: cyberpunkVertexShader,
    fragmentShader: cyberpunkFragmentShader
  });
}

// 加载模型 fbx
let cityModel;
const collidableObjects = []; // 存储所有可碰撞对象
const cyberpunkMaterials = []; // 存储赛博朋克材质以便更新

new FBXLoader().load(HOST + '/files/model/city.FBX', (object3d) => {
    object3d.scale.multiplyScalar(0.01)
    object3d.position.set(0, -1, 0)
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=animation&id=personFirstMove) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [动画效果目录](/examples/three/animation/)

> 动画效果 · Three.js
