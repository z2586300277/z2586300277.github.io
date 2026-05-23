---
title: "Opt解压(su7 模型) - Three.js 案例讲解"
description: "Meshopt 压缩 glTF 解码、HDR 环境贴图与 PMREMGenerator 预滤波"
head:
  - - meta
    - name: keywords
      content: "three.js,Meshopt,glTF,HDR,PMREM,su7"
outline: deep
---

# Opt 解压（su7 模型）

*GLTF Meshopt + HDR*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=basic&id=gltfOptLoader)

![Opt解压](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/gltfOptLoader.jpg)

## 你将学到什么

- **Meshopt** 几何压缩与 `setMeshoptDecoder`
- **HDR + PMREMGenerator** 生成 PBR 环境贴图
- 加载后为 Mesh **逐个设置 envMap**

## 效果说明

加载小米 SU7 的 **Meshopt 压缩 glTF** 模型，在 **HDR 环境反射** 下展示车身 PBR 质感。OrbitControls 环绕观察。

## 核心概念

### Meshopt 压缩

除 Draco 外，glTF 还常用 **EXT_meshopt_compression**（Meshopt）压缩顶点数据，体积更小、解码 often 更快：

```js
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);
loader.load('sm_car.gltf', gltf => scene.add(gltf.scene));
```

| 压缩 | 解码器 |
|------|--------|
| Draco | `DRACOLoader` |
| Meshopt | `MeshoptDecoder` |

### HDR → PMREM 环境贴图

```js
const pmremGenerator = new THREE.PMREMGenerator(renderer);
const texture = new RGBELoader().load('1k.hdr', (t) => {
    const map = pmremGenerator.fromEquirectangular(t).texture;
    pmremGenerator.dispose();
    return map;
});
texture.mapping = THREE.EquirectangularReflectionMapping;
```

**PMREM**（Prefiltered Mipmapped Radiance Environment Map）把 HDR 全景预滤波为各级 mip，供 PBR 材质按粗糙度采样反射。

### 手动 envMap

本案例未设 `scene.environment`，而是 traverse 给每个 mesh：

```js
gltf.scene.traverse(obj => {
    if (obj.isMesh) obj.material.envMap = texture;
});
```

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js"
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 2, 3)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const pmremGenerator = new THREE.PMREMGenerator(renderer)
const texture = new RGBELoader().load(FILE_HOST + '/files/hdr/1k.hdr', (t) => {
    const map = pmremGenerator.fromEquirectangular(t).texture
    pmremGenerator.dispose()
    return map
})
texture.mapping = THREE.EquirectangularReflectionMapping

const loader = new GLTFLoader()
loader.setMeshoptDecoder(MeshoptDecoder)
loader.load(FILE_HOST + 'models/su7/sm_car.gltf', gltf => {
    scene.add(gltf.scene)
    gltf.scene.traverse(obj => {
        if (obj.isMesh) obj.material.envMap = texture
    })
})

function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
}
animate()
```

## 小结

- 大模型压缩：**Draco + Meshopt** 按 glTF 扩展选用对应 Decoder
- HDR 反射推荐 `PMREMGenerator` + `scene.environment`（本案例为逐 mesh 赋值）
- 上一篇：[场景雾化](/examples/three/basic/sceneFog) · 下一篇：[加载动画](/examples/three/basic/loadingAnimate)

> 基础案例 · Three.js · 9/35
