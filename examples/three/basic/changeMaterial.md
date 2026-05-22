---
title: "材质修改动画 - Three.js 案例讲解"
description: "本案例展示 **材质修改动画** 的实现。涉及：glTF/FBX/OBJ 外部模型加载、相机交互控制器、天空盒与环境贴图。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,basic,材质修改动画"
outline: deep
---
# 材质修改动画

*ChangeMaterial*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=changeMaterial)

![材质修改动画](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/changeMaterial.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 相机交互控制器
- 天空盒与环境贴图
- GSAP / anime.js 属性动画
- requestAnimationFrame 渲染循环

## 效果说明

本案例展示 **材质修改动画** 的实现。涉及：glTF/FBX/OBJ 外部模型加载、相机交互控制器、天空盒与环境贴图。

> 基础案例 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

- 时间线库驱动 position/rotation/uniform，与 rAF 渲染循环配合。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. rAF 循环中 update 并 render

## 代码要点

- **`changeMaterial()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GUI } from "three/addons/libs/lil-gui.module.min.js"
import gsap from 'gsap'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(1, 2, 2)

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

animate()

function animate() {

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}

scene.add(new THREE.AmbientLight(0xffffff, 0.2))

const pointLight = new THREE.PointLight(0xffffff, 1.5, 0, 2)

pointLight.position.set(5, 5, 5)

scene.add(pointLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 2)

directionalLight.position.set(-5, 5, -5)

scene.add(directionalLight)

let group

// 加载模型 gltf/ glb  draco解码器
const loader = new GLTFLoader()

loader.setDRACOLoader(new DRACOLoader().setDecoderPath(FILE_HOST + 'js/three/draco/'))

loader.load(

    HOST + '/files/model/car.glb',

    gltf => {

        group = gltf.scene

        scene.add(group)

        changeMaterial()

    }

)

// 文件地址
const urls = [0, 1, 2, 3, 4, 5].map(k => (FILE_HOST + 'files/sky/skyBox0/' + (k + 1) + '.png'));

const textureCube = new THREE.CubeTextureLoader().load(urls);

function changeMaterial() {

    let material

    if (!group) return

    group.traverse(child => {

        if (child.isMesh && child.name === '网格138_3') {

            material = child.material

            material.envMap = textureCube

        }

    })

    const folder = new GUI()

    folder.add(material, 'wireframe').name('线框').listen()

    folder.add(material, 'transparent').name('透明').listen()

    folder.add(material, 'opacity').min(0).max(1).name('透明度').listen()

    folder.addColor({ color: material.color.clone() }, 'color').name('颜色').listen().onChange(c => {

        gsap.to(material.color, { ...c, duration: 1.5 })

    })
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=changeMaterial) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础案例目录](/examples/three/basic/)

> 基础案例 · Three.js
