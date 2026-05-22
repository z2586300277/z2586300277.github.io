---
title: "模型导出 - Three.js 案例讲解"
description: "本案例展示 **模型导出** 的实现。涉及：glTF/FBX/OBJ 外部模型加载、相机交互控制器、天空盒与环境贴图。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,basic,模型导出"
outline: deep
---
# 模型导出

*Model Export*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=modelExport)

![模型导出](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/modelExport.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 相机交互控制器
- 天空盒与环境贴图
- requestAnimationFrame 渲染循环

## 效果说明

本案例展示 **模型导出** 的实现。涉及：glTF/FBX/OBJ 外部模型加载、相机交互控制器、天空盒与环境贴图。

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
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(5, 5, 5)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

scene.add(new THREE.AmbientLight(0xffffff, 3))

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

const urls = [0, 1, 2, 3, 4, 5].map(k => (FILE_HOST + 'files/sky/skyBox0/' + (k + 1) + '.png'));

const textureCube = new THREE.CubeTextureLoader().load(urls);

scene.background = textureCube

const objLoader = new OBJLoader()

const mtlLoader = new MTLLoader()

mtlLoader.load(FILE_HOST + 'files/model/house/house.mtl', (mtl) => {

    mtl.preload()

    objLoader.setMaterials(mtl)

    objLoader.load(FILE_HOST + 'files/model/house/house.obj', (obj) => scene.add(obj))

})

const exporter = new GLTFExporter();

const button = document.createElement('button');
button.textContent = '导出模型';
button.style.position = 'absolute';
button.style.top = '10px';
button.style.left = '100px';
box.appendChild(button);

button.onclick = async () => {

    exporter.parse(scene, (result) => {

        const outBlob = result instanceof ArrayBuffer
            ? new Blob([result], { type: 'model/gltf-binary' })
            : new Blob([JSON.stringify(result, null, 2)], { type: 'model/gltf+json' })

        const link = document.createElement('a')
        link.href = URL.createObjectURL(outBlob)
        link.download = result instanceof ArrayBuffer ? 'scene.glb' : 'scene.gltf'
        link.click()
        URL.revokeObjectURL(link.href)

    }, { binary: true, onlyVisible: true, embedImages: true })

}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=modelExport) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础案例目录](/examples/three/basic/)

> 基础案例 · Three.js
