---
title: "渲染贴图物体 - Three.js 案例讲解"
description: "本案例展示 **渲染贴图物体** 的实现。涉及：glTF/FBX/OBJ 外部模型加载、相机交互控制器、天空盒与环境贴图。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,basic,渲染贴图物体"
outline: deep
---
# 渲染贴图物体

*Render Target*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=renderTarget)

![渲染贴图物体](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/renderTarget.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 相机交互控制器
- 天空盒与环境贴图
- 离屏渲染 RenderTarget
- requestAnimationFrame 渲染循环

## 效果说明

本案例展示 **渲染贴图物体** 的实现。涉及：glTF/FBX/OBJ 外部模型加载、相机交互控制器、天空盒与环境贴图。

> 基础案例 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

- **WebGLRenderTarget** 渲染到纹理，用于镜子、小地图、后处理输入。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(2, 0, 9)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const urls = [0, 1, 2, 3, 4, 5].map(k => (FILE_HOST + 'files/sky/skyBox0/' + (k + 1) + '.png'));

const textureCube = new THREE.CubeTextureLoader().load(urls);

scene.background = textureCube;

const renderTarget = new THREE.WebGLRenderTarget(box.clientWidth, box.clientHeight)

new GLTFLoader().load(

    FILE_HOST + 'models/glb/computer.glb',

    gltf => {

        const model = gltf.scene

        model.traverse(child =>  child.layers.set(1))

        scene.add(model)

    }

)

const plane = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), new THREE.MeshBasicMaterial({ map: renderTarget.texture }))

scene.add(plane)

const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({ map: renderTarget.texture }))

sphere.position.set(3, 0, 0)

scene.add(sphere)

animate()

function animate() {

    camera.layers.set(1)

    renderer.setRenderTarget(renderTarget)

    renderer.render(scene, camera)

    camera.layers.set(0)

    renderer.setRenderTarget(null)

    renderer.render(scene, camera)

    requestAnimationFrame(animate)

}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=renderTarget) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础案例目录](/examples/three/basic/)

> 基础案例 · Three.js
