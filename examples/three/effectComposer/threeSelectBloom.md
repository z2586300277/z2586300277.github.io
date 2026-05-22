---
title: "官方选择辉光简化版 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `onClick`、`render`。"
head:
  - - meta
    - name: keywords
      content: "three.js,官方选择辉光简化版"
outline: deep
---

# 官方选择辉光简化版

*Three Bloom*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=threeSelectBloom)


![官方选择辉光简化版](https://z2586300277.github.io/three-cesium-examples/threeExamples/effectComposer/threeSelectBloom.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `onClick`、`render`。

> 后期处理 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 后期：`EffectComposer` 串 Pass，先 `RenderPass` 出场景，再 bloom/SSAO 等屏幕 Pass。

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

## 独立函数

- `render()` — renderer.render(scene, camera)

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
```

### 片元

- 片元输出 gl_FragColor

```glsl
uniform sampler2D baseTexture;
        uniform sampler2D bloomTexture;
        varying vec2 vUv;
        void main() {
            gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
        }
```

## 源码

```js
import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js"
import { RenderPass } from "three/addons/postprocessing/RenderPass.js"
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js"
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js"

const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true, })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100000)
camera.position.set(200, 200, 200)
new OrbitControls(camera, renderer.domElement)

const light = new THREE.DirectionalLight(0xffffff, 3)
light.position.set(100, 100, 100)
scene.add(light)

// 物体
new GLTFLoader().load(FILE_HOST + "files/model/Fox.glb", (gltf) => scene.add(gltf.scene))
const mesh = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshStandardMaterial({ color: 0x00ff00 }))
mesh.position.set(50, 0, 0)
scene.add(mesh)

// 后期处理
const renderScene = new RenderPass(scene, camera)
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWid
```

