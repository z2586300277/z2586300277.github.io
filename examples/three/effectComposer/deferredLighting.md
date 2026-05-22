---
title: "延迟光照 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `updateBloom`、`animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,延迟光照,后期处理"
outline: deep
---

# 延迟光照

*Deferred Lighting*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=deferredLighting)


![延迟光照](https://z2586300277.github.io/three-cesium-examples/threeExamples/effectComposer/deferredLighting.webp)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `updateBloom`、`animate`。

> 后期处理 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 后期：`EffectComposer` 串 Pass，先 `RenderPass` 出场景，再 bloom/SSAO 等屏幕 Pass。

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

## 独立函数

- `updateBloom()` — 材质 / GLSL
- `animate()` — rAF：update controls + render

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
out vec3 vNormal;
        out vec3 vWorldPosition;
        void main() {
            vNormal = normal;
            // 计算顶点的世界坐标，模型矩阵将顶点从模型空间转换到世界空间
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
```

### 片元

```glsl
in vec3 vNormal;
        in vec3 vWorldPosition;
        layout(location = 0) out vec4 gPosition;
        layout(location = 1) out vec4 gNormal;
        void main() {
          gPosition = vec4(vWorldPosition, 1.0);
          gNormal = normalize(vec4(vNormal, 1.0));
      }
```

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
out vec2 vUv;
      void main() {
          vUv = uv;
          gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
      }
```

### 片元

```glsl
precision highp float;
    precision highp int;
    // 从 G-buffer 中读取的位置、法线和颜色纹理
    uniform sampler2D tPosition;
    uniform sampler2D tNormal;
    uniform sampler2D tDiffuse;
    uniform sampler2D tLightData;
    uniform vec2 resolution;
    uniform int offset;
    // 输入 UV 坐标
    in vec2 vUv;
    // 输出最终颜色
    out vec4 pc_FragColor;
    const int MAX_LIGHTS_PER_PASS = 50;
    float maxDistance=100.0;
    float smoothFactor=300.0;
    void main() {
     vec3 diffuse = texture(tDiffuse, vUv).rgb;
     vec3 normal = texture(tNormal, vUv).rbg;
     vec3 position = texture(tPo
```

## 源码

```js
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GUI } from "three/addons/libs/lil-gui.module.min.js"
const gui=new GUI()
const bloomParams = {
    exposure: 1,
    bloomStrength: 0.01,
    bloomThreshold: 0,
    bloomRadius: 0.5
};
console.log('Three.js 版本:', THREE.REVISION);
// 初始化场景、相机、渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(400, 400, 400);
scene.add(camera);
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    logarithmicDepthBuffer: true
});
renderer.outputColorSpace = 'srgb'
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight('#fff', 2);
scene.add(ambientLight);
// 添加性能监控
const stats = new Stats();
document.body.appendCh
```

