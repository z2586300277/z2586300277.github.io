---
title: "帧率控制 - Three.js 案例讲解"
description: "本案例展示 **帧率控制** 的实现。涉及：glTF/FBX/OBJ 外部模型加载、相机交互控制器、天空盒与环境贴图。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,basic,帧率控制"
outline: deep
---
# 帧率控制

*Render Frame*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=renderFrame)

![帧率控制](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/renderFrame.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 相机交互控制器
- 天空盒与环境贴图
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时

## 效果说明

本案例展示 **帧率控制** 的实现。涉及：glTF/FBX/OBJ 外部模型加载、相机交互控制器、天空盒与环境贴图。

> 基础案例 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'dat.gui'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(10, 10, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

const stats = new Stats()

stats.dom.style.top = '50px'

document.body.appendChild(stats.dom)

const clock = new THREE.Clock()

let timeS = 0, fps = 60, renderT = 1 / fps

let gui = new GUI()
   
gui.add({ fps }, 'fps', 1, 300).onFinishChange(v => {

    fps = v

    renderT = 1 / fps

})

animate()

function animate() {

    timeS += clock.getDelta()

    if (timeS > renderT) {

        controls.update()

        stats.update()

        renderer.render(scene, camera)

        timeS = 0

    }

    requestAnimationFrame(animate)

}

const loader = new GLTFLoader()

loader.setDRACOLoader(new DRACOLoader().setDecoderPath(FILE_HOST + 'js/three/draco/'))

const urls = [0, 1, 2, 3, 4, 5].map(k => (FILE_HOST + 'files/sky/skyBox0/' + (k + 1) + '.png'));

const textureCube = new THREE.CubeTextureLoader().load(urls);

loader.load(

    FILE_HOST + '/models/glb/build3.glb',

    gltf => {

        gltf.scene.traverse(child => {

            if (child.isMesh) child.material.envMap = textureCube

        })

        scene.add(gltf.scene)

    }

)
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=renderFrame) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础案例目录](/examples/three/basic/)

> 基础案例 · Three.js
