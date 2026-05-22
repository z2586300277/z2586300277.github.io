---
title: "加载动画 - Three.js 案例讲解"
description: "本案例展示 **加载动画** 的实现。涉及：glTF/FBX/OBJ 外部模型加载、相机交互控制器、requestAnimationFrame 渲染循环。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,basic,加载动画"
outline: deep
---
# 加载动画

*Load Animate*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=loadingAnimate)

![加载动画](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/loadingAnimate.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 相机交互控制器
- requestAnimationFrame 渲染循环

## 效果说明

本案例展示 **加载动画** 的实现。涉及：glTF/FBX/OBJ 外部模型加载、相机交互控制器、requestAnimationFrame 渲染循环。

> 基础案例 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

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

const loadingDiv = document.createElement('div')
loadingDiv.innerText = '加载中...'
Object.assign(loadingDiv.style, {
    pointerEvents: 'none',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    color: 'white',
    fontSize: '20px',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: '10px 20px',
    borderRadius: '5px'
})

document.body.appendChild(loadingDiv)

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000000)

camera.position.set(0, 400, 400)

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

scene.add(new THREE.AmbientLight(0xffffff, 3))

const manager = new THREE.LoadingManager();

manager.onStart = function (url, itemsLoaded, itemsTotal) {
    loadingDiv.innerText = '开始加载'
};

manager.onLoad = function () {
    loadingDiv.innerHTML = '加载完成'
};

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    loadingDiv.innerText = '导入' + (itemsLoaded / itemsTotal * 100).toFixed(2) + '%' 
}

manager.onError = function (url) {

}

const loader = new GLTFLoader(manager)

loader.setDRACOLoader(new DRACOLoader().setDecoderPath(FILE_HOST + 'js/three/draco/'))

loader.load(

    FILE_HOST + '/files/model/LittlestTokyo.glb?time=' + new Date().getTime(),

    gltf => {

        scene.add(gltf.scene)

    },

    xhr => {

        loadingDiv.innerText = '下载' + (xhr.loaded / xhr.total * 100).toFixed(2) + '%'

    }

)

animate()

function animate() {

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=loadingAnimate) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础案例目录](/examples/three/basic/)

> 基础案例 · Three.js
