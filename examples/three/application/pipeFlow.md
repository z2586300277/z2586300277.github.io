---
title: "管道流动 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。入口在 `DemoPipe`。"
head:
  - - meta
    - name: keywords
      content: "three.js,管道流动"
outline: deep
---

# 管道流动

*Pipe Flow*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=pipeFlow)


![管道流动](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/pipeFlow.jpg)


## 效果说明

Three.js 业务向场景组合。入口在 `DemoPipe`。

> 应用场景 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 补间动画交给 GSAP/anime/Tween，别在 rAF 里手搓 easing。

## 类与方法

### DemoPipe

- `constructor()` — 参数：name, options
- `createFlowAnimation()` — 材质 / GLSL
- `startFlow()` — 材质 / GLSL
- `stopFlow()` — 材质 / GLSL

### ThreeCore

- `constructor()` — 参数：dom, options
- `onRenderer()` — 移除 Entity / 解绑监听
- `onDestroy()` — 移除 Entity / 解绑监听
- `animate()` — 移除 Entity / 解绑监听
- `addAnimate()` — 移除 Entity / 解绑监听
- `removeAnimate()`
- `destroyed()` — 移除 Entity / 解绑监听

### ThreeProject

- `constructor()` — 参数：dom
- `init()`
- `addGUI()`
- `addAndGetPipe()`
- `onRenderer()`

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "dat.gui";
import Stats from "three/examples/jsm/libs/stats.module.js";
import gsap from "gsap";

class MyMesh extends THREE.Mesh{

    constructor(name, geometry, material) {
        super(geometry, material)
        this.name = name
    }

    getBox(){
        // 更新模型的世界矩阵
        this.updateMatrixWorld()
        // 获取模型的包围盒
        const box = new THREE.Box3().setFromObject(this)

        return {
            minX: box.min.x,
            maxX: box.max.x,
            minY: box.min.y,
            maxY: box.max.y,
            minZ: box.min.z,
            maxZ: box.max.z,
            xLength: box.max.x - box.min.x,
            yLength: box.max.y - box.min.y,
            zLength: box.max.z - box.min.z,
            // 数轴上任意两点中心点公式 = a + (b - a)/2
            centerX: box.min.x + (box.max.x - box.min.x)/2,
            centerY: box.min.y + (box.max.y - box.min.y)/2,
            centerZ: box.min.z + (box.max.z - box.min.z)/2
        }
    }

}

class DemoPipe extends MyMesh {
    flowAnimation;
    flowTexture;
    constructor(name, options) {
        const defaultOptions = {
            radius: 70,
            color: 0x777777,
            radiusSegments: 16,
            tubularSegments: 100,
            curv
```

