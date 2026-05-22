---
title: "加载3dtiles - Three.js 案例讲解"
description: "Three.js 接第三方库或扩展能力。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,expand,加载3dtiles"
outline: deep
---
# 加载3dtiles

*Load Tiles*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=loadTiles)

![加载3dtiles](https://z2586300277.github.io/three-cesium-examples/threeExamples/expand/loadTiles.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 相机交互控制器
- requestAnimationFrame 渲染循环

## 效果说明

Three.js 接第三方库或扩展能力。

> 扩展功能 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. rAF 循环中 update 并 render

## 代码要点

- **`initTiles()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

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

// tilesRenderer.errorTarget = 1 // 设置错误阈值，默认值为0.5，范围0~1，值越小越严格

// https://blog.csdn.net/m0_73348873/article/details/151783069

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
 
        const m = (tilesRenderer as any).root.transform; // 获取原始矩阵
        const rotationMat3 = new THREE.Matrix3().set(m[0], m[1], m[2], m[4], m[5], m[6], m[8], m[9], m[10]); // 取出旋转部分
        rotationMat3.transpose(); // 逆旋转
        const rotationMat4 = new THREE.Matrix4().setFromMatrix3(rotationMat3); // 转回Matrix4以便应用
        const rotX90 = new THREE.Matrix4().makeRotationX((90 * Math.PI) / 180); // x轴旋转90度矩阵
        rotationMat4.multiply(rotX90); // 合并矩阵（由z轴向上坐标系 转为 y轴向上坐标系）
        const translationMatrix1 = new THREE.Matrix4().makeTranslation(center.x, center.y, center.z); // T(center)
        const translationMatrix2 = new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z); // T(-center)
        const finalMatrix = new THREE.Matrix4().multiplyMatrices(translationMatrix1, rotationMat4).multiply(translationMatrix2); // 最终矩阵 = T(center) * R⁻¹ * T(-center)
 
        tilesRenderer.group.matrix.copy(finalMatrix); // 设置矩阵
        tilesRenderer.group.matrixAutoUpdate = false; // 禁止自动更新矩阵
        tilesRenderer.group.updateMatrixWorld(true); // 更新矩阵
    });
 
    scene.add(tilesRenderer.group); // 添加到场景
}
 */
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=loadTiles) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [扩展功能目录](/examples/three/expand/)

> 扩展功能 · Three.js
