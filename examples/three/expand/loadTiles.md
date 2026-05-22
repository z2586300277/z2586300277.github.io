---
title: "加载3dtiles - Three.js 案例讲解"
description: "Three.js 接第三方库或扩展能力。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,3dtiles"
outline: deep
---

# 加载3dtiles

*Load Tiles*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=loadTiles)


![加载3dtiles](https://z2586300277.github.io/three-cesium-examples/threeExamples/expand/loadTiles.jpg)


## 效果说明

Three.js 接第三方库或扩展能力。主流程在 `animate`。

> 扩展功能 · Three.js

## 实现思路

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TilesRenderer } from '3d-tiles-renderer'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 30, 30)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AxesHelper(1000))

// 加载3d tiles
const tilesRenderer = new TilesRenderer(FILE_HOST + '3dtiles/test/tileset.json')

tilesRenderer.setCamera(camera)

tilesRenderer.setResolutionFromRenderer(camera, renderer)

const model = new THREE.Group().add(tilesRenderer.group)

scene.add(model)

const box3 = new THREE.Box3()

tilesRenderer.addEventListener('load-tile-set', () => {

    if (tilesRenderer.getBoundingBox(box3)) {

        box3.getCenter(tilesRenderer.group.position)

        tilesRenderer.group.position.multiplyScalar(-1)

    }

})

animate()

function animate() {

    requestAnimationFrame(animate)

    tilesRenderer.update()

    renderer.render(scene, camera)

}

// tilesRenderer.errorTarget = 1 // 设
```

```js
/* function initTiles() {
    tilesRenderer = new TilesRenderer("3dtiles路径/tileset.json");
    const gltfLoader = new GLTFLoader();
 
    // Draco
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://unpkg.com/three@0.180.0/examples/jsm/libs/draco/");
    gltfLoader.setDRACOLoader(dracoLoader);
 
    // KTX2
    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath("https://unpkg.com/three@0.180.0/examples/jsm/libs/basis/");
    ktx2Loader.detectSupport(renderer);
    gltfLoader.setKTX2Loader(ktx2Loader);
 
    tilesRenderer.manager.addHandler(/\.(gltf|glb)$/g, gltfLoader);
    tilesRenderer.setCamera(camera);
    tilesRenderer.setResolutionFromRenderer(camera, renderer);
 
    // 更新矩阵并设置相机位置
    let loadedTileSetHandled = false;
    tilesRenderer.addEventListener("load-tile-set", () => {
        if (loadedTileSetHandled) return;
        loadedTileSetHandled = true;
 
        const sphere = new THREE.Sphere();
        tilesRenderer.getBoundingSphere(sphere);
        const center = sphere.center.clone(); // 获取包围球中心
        const radius = sphere.radius; // 获取包围球半径
        controls.target.copy(center); // 把控制器目标设为包围球中心
        const offset = new THREE.Vector3(radius * 2, radius, 0); // 给相机一个偏移
        camera.position.copy(center).add(offset); // 设置相机位置
 
        const m = (tilesRenderer as any).root.tra
```

