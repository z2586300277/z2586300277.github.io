---
title: "模型边框 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。入口在 `MeshEdgesGeometry`。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,模型边框"
outline: deep
---
# 模型边框

*Model Border*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=modelBorder)

![模型边框](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/modelBorder.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 相机交互控制器
- requestAnimationFrame 渲染循环

## 效果说明

Three.js 业务向场景组合。入口在 `MeshEdgesGeometry`。

> 应用场景 · Three.js

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
import { BufferGeometry, EdgesGeometry } from 'three';
import { mergeAttributes } from 'three/addons/utils/BufferGeometryUtils.js';

class MeshEdgesGeometry extends BufferGeometry {

    constructor(object, thresholdAngle = 1) {

        super();

        object.updateWorldMatrix(true, true);

        var position = this.extractEdges(object, thresholdAngle);

        this.setAttribute('position', position);

    } // MeshEdgesGeometry.constructor

    extractEdges(object, thresholdAngle) {

        var attributes = [];

        object.traverse(child => {

            if (child.geometry) {

                var geo = new EdgesGeometry(child.geometry, thresholdAngle);
                var pos = geo.getAttribute('position');

                attributes.push(pos.applyMatrix4(child.matrixWorld));

            } // if

        }); // object.traverse

        if (attributes.length == 0) {

            throw 'MeshEdgesGeometry: No edges found';

        }

        return mergeAttributes(attributes);

    } // MeshEdgesGeometry.extractEdges

} // MeshEdgesGeometry

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(10, 10, 12)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

animate()

function animate() {

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

}

const loader = new GLTFLoader()

loader.setDRACOLoader(new DRACOLoader().setDecoderPath(FILE_HOST + 'js/three/draco/'))

loader.load(

    FILE_HOST + 'files/model/elegant.glb',

    gltf => {

        const model = new THREE.LineSegments(new MeshEdgesGeometry(gltf.scene), new THREE.LineBasicMaterial({ color: 'pink' }));

        scene.add(model)

    }

)
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=modelBorder) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
