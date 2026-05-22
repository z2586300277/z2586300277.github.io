---
title: "模型边框 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。入口在 `MeshEdgesGeometry`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,模型边框,应用场景"
outline: deep
---

# 模型边框

*Model Border*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=modelBorder)


![模型边框](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/modelBorder.jpg)


## 效果说明

Three.js 业务向场景组合。入口在 `MeshEdgesGeometry`。

> 应用场景 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 类与方法

### MeshEdgesGeometry

- `constructor()` — 参数：object, thresholdAngle = 1
- `extractEdges()`

## 独立函数

- `animate()` — rAF：update controls + render

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

const box = document.getEleme
```

