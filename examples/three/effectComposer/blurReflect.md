---
title: "模糊反射(drei转原生) - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `MeshReflectorMaterial`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,模糊反射(drei转原生),后期处理"
outline: deep
---

# 模糊反射(drei转原生)

*Blur Reflect*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=blurReflect)


![模糊反射(drei转原生)](https://z2586300277.github.io/three-cesium-examples/threeExamples/expand/blurReflect.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `MeshReflectorMaterial`。

> 后期处理 · Three.js

## 实现思路

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 反射/水面常用 Reflector 或自定义 renderTarget 贴图。

## 代码结构

- glsl

## 类与方法

### MeshReflectorMaterial

- `constructor()` — 参数：renderer, camera, scene, object, {
        mixBlur = 0,
        mixStrength = 
- `setupBuffers()`
- `beforeRender()`
- `update()` — 每帧更新 geometry uniform 或实例矩阵
- `onBeforeCompile()` — 材质 / GLSL

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { KawaseBlurPass } from "postprocessing"
import { Pane } from 'tweakpane'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 200, 200)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setClearColor(0x000000, 1)

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

scene.add(new THREE.AmbientLight(0xffffff, 0.3))

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)

directionalLight.position.set(0, 200, 200)

scene.add(directionalLight)

new GLTFLoader().load(FILE_HOST + "files/model/Fox.glb", (gltf) => scene.add(gltf.scene))

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

const { DepthFormat, DepthTexture, LinearFilter, Matrix4, MeshStandardMaterial, PerspectiveCamera, Plane, UnsignedShortType, Vector3, Vector4, WebGLRenderTarget } = THREE

class MeshReflectorMaterial extends MeshStandardMaterial {
    constructor(renderer, camera, scene, object, {

```

### glsl

```js
`
            #include <project_vertex>
            my_vUv = textureMatrix * vec4( position, 1.0 );
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            `
        )

        shader.fragmentShader =
```

### glsl

```js
`
              uniform sampler2D tDiffuse;
              uniform sampler2D tDiffuseBlur;
              uniform sampler2D tDepth;
              uniform sampler2D distortionMap;
              uniform float distortion;
              uniform float cameraNear;
              uniform float cameraFar;
              uniform bool hasBlur;
              uniform float mixBlur;
              uniform float mirror;
              uniform float mixStrength;
              uniform float minDepthThreshold;
              uniform float maxDepthThreshold;
              uniform float mixContrast;
              uniform float depthScale;
              uniform float depthToBlurRatioBias;
              varying vec4 my_vUv;        
              ${shader.fragmentShader}`

        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <emissivemap_fragment>',
```

