---
title: "文件分片(打包zip) - Three.js 案例讲解"
description: "本案例展示 **文件分片(打包zip)** 的实现。涉及：glTF/FBX/OBJ 外部模型加载、相机交互控制器、天空盒与环境贴图。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,basic,文件分片(打包zip)"
outline: deep
---
# 文件分片(打包zip)

*File Chunks*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=fileChunks)

![文件分片(打包zip)](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/localModel.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 相机交互控制器
- 天空盒与环境贴图
- requestAnimationFrame 渲染循环

## 效果说明

本案例展示 **文件分片(打包zip)** 的实现。涉及：glTF/FBX/OBJ 外部模型加载、相机交互控制器、天空盒与环境贴图。

> 基础案例 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. rAF 循环中 update 并 render

## 代码要点

- **`downloadBlob()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`loadZipChunksModel()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import JSZip from 'jszip'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 10000000)

camera.position.set(10, 10, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

scene.add(new THREE.AxesHelper(500), new THREE.AmbientLight(0xffffff, 2))

animate()

function animate() {

  requestAnimationFrame(animate)

  controls.update()

  renderer.render(scene, camera)

}

window.onresize = () => {

  renderer.setSize(box.clientWidth, box.clientHeight)

  camera.aspect = box.clientWidth / box.clientHeight

  camera.updateProjectionMatrix()

}

// 文件地址
const urls = [0, 1, 2, 3, 4, 5].map(k => (FILE_HOST + 'files/sky/skyBox0/' + (k + 1) + '.png'));

const textureCube = new THREE.CubeTextureLoader().load(urls);

scene.background = textureCube;

// 创建一个文件上传的输入框
const input = document.createElement('input')
input.type = 'file'
input.accept = '.glb'
Object.assign(input.style, { position: 'absolute', top: '30px', left: '100px', zIndex: 9999 })
document.body.appendChild(input)

const zip = new JSZip();

input.onchange = async (e) => {

  const file = e.target.files[0]

  const chunkSize = Math.ceil(file.size / 5) // 每个分片的大小，这里分成5份

  for (let i = 0; i * chunkSize < file.size; i++) {

    zip.file(`${i}.chunk`, file.slice(i * chunkSize, (i + 1) * chunkSize))

  }

  const zipBlob = await zip.generateAsync({ type: 'blob' })

  downloadBlob(zipBlob, file.name.split('.').slice(0, -1).join('.') + '_chunks.zip')

  // 演示如何加载分片压缩包
  loadZipChunksModel(zipBlob)

}

function downloadBlob(blob, filename) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

function loadZipChunksModel(zipBlob) {

  const loader = new GLTFLoader().setDRACOLoader(new DRACOLoader().setDecoderPath(FILE_HOST + 'js/three/draco/'))

  JSZip.loadAsync(zipBlob).then(async (unzipped) => {

    const chunkFiles = Object.keys(unzipped.files).filter(name => name.endsWith('.chunk')).sort((a, b) => parseInt(a) - parseInt(b))

    const chunks = []
    for (const chunkFile of chunkFiles) {
      const chunkData = await unzipped.files[chunkFile].async('arraybuffer')
      chunks.push(chunkData)
    }

    const completeArray = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.byteLength, 0))
    let offset = 0
    for (const chunk of chunks) {
      completeArray.set(new Uint8Array(chunk), offset)
      offset += chunk.byteLength
    }

    const blob = new Blob([completeArray], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)

    loader.load(url, (gltf) => {
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=fileChunks) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础案例目录](/examples/three/basic/)

> 基础案例 · Three.js
