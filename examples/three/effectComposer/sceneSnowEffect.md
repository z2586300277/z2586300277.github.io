---
title: "场景雪 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `updatePoints`、`animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,场景雪,后期处理"
outline: deep
---

# 场景雪

*sceneSnowEffect*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=sceneSnowEffect)


![场景雪](https://z2586300277.github.io/three-cesium-examples/threeExamples/effectComposer/sceneSnowEffect.webp)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `updatePoints`、`animate`。

> 后期处理 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

## 独立函数

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

- 片元输出 gl_FragColor
- `time` uniform 驱动动画

```glsl
precision highp float;
        precision highp int;
        
        uniform sampler2D tPosition;
        uniform sampler2D tNormal;
        uniform sampler2D tDiffuse;
        uniform vec2 resolution;
        uniform float time;
        uniform vec3 uCameraPosition;
        uniform float snowAmount;
        uniform float snowNoise;
        uniform float snowEdge;
        
        in vec2 vUv;
        out vec4 fragColor;
        
        // 改进的噪声函数
        float rand(vec2 co) {
            return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
```

## 源码

```js
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader.js";
import {GUI} from "three/addons/libs/lil-gui.module.min.js"
console.log('Three.js 版本:', THREE.REVISION);
const gui = new GUI()
const size = { width: window.innerWidth, height: window.innerHeight, maxX: 20, minX: -20, maxY: 20, minY: 0, maxZ: 20, minZ: -20 }
const vertices = []
const offset = []
let particleCount=1000
const geometry = new THREE.BufferGeometry()
for (let i = 0; i < particleCount; i++) {
    const x = 1000 * (Math.random() - 0.5)
    const y = 600 * Math.random()
    const z = 1000 * (Math.random() - 0.5)

    vertices.push(x, y, z)
    offset.push(Math.random() - 0.5, 0, Math.random() - 0.5)
}
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
/**纹理*/
const texture = new THREE.TextureLoader().load(HOST + 'files/images/snow.png')
const pointMesh = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
        size: 5,
        depthTest: true,
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.8,
        sizeAttenuation: true
    })

```

