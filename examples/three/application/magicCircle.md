---
title: "魔法阵 - Three.js 案例讲解"
description: "大量重复物体或粒子，注意 draw call 与 update 频率。入口在 `ThreeCore`。"
head:
  - - meta
    - name: keywords
      content: "three.js,魔法阵"
outline: deep
---

# 魔法阵

*Magic Circle*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=magicCircle)


![魔法阵](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/magicCircle.jpg)


## 效果说明

大量重复物体或粒子，注意 draw call 与 update 频率。入口在 `ThreeCore`。

> 应用场景 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 点精灵/粒子：`Points` + `PointsMaterial`，或自定义 shader 控 size/颜色。

## 类与方法

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
- `getParticles()` — 材质 / GLSL
- `getCylinderGeo()`
- `init()`
- `onRenderer()`
- `updateCircle()`
- `updateRing()`
- `updatePartical()`

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from 'three/examples/jsm/libs/stats.module.js';

class ThreeCore {
    dom;
    scene;
    camera;
    defaultCamera;
    renderer;
    clock;
    options;
    stats;
    // 要执行动画的对象集合, 子类可以把自己的动画写进 onRender 也可以 this.addAnimate() 添加到父类动画集合里
    animates;
    constructor(dom, options) {
        this.dom = dom;
        this.options = options;
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.animates = {};
        const k = dom.clientWidth / dom.clientHeight;
        if ("fov" in options.cameraOptions) {
            this.defaultCamera = new THREE.PerspectiveCamera(options.cameraOptions.fov, k, options.cameraOptions.near, options.cameraOptions.far);
        }
        else {
            const s = options.cameraOptions.s;
            this.defaultCamera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, options.cameraOptions.near, options.cameraOptions.far);
        }
        this.camera = this.defaultCamera;
        this.scene.add(this.camera);
        const rendererOptions = {
            // 抗锯齿
            antialias: true,
            alpha: true,
            // 深度缓冲, 解决模型重叠部分不停闪烁问题
            // 这个属性会导致精灵材质会被后面的物体遮挡
            // 只能出现问题的时候, 在那个场景 new ThreeCore继承类的时候, 传入rendere
```

