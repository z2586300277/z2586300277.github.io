---
title: "管道流动 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。入口在 `DemoPipe`。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,管道流动"
outline: deep
---
# 管道流动

*Pipe Flow*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=pipeFlow)

![管道流动](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/pipeFlow.jpg)

## 你将学到什么

- 相机交互控制器
- 天空盒与环境贴图
- GSAP / anime.js 属性动画
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时

## 效果说明

Three.js 业务向场景组合。入口在 `DemoPipe`。

> 应用场景 · Three.js

## 核心概念

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

- 时间线库驱动 position/rotation/uniform，与 rAF 渲染循环配合。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. rAF 循环中 update 并 render

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
            curve: new THREE.CatmullRomCurve3(),
        };
        const finalOptions = Object.assign({}, defaultOptions, options);
        const flowTexture = new THREE.TextureLoader().load(FILE_HOST + "threeExamples/application/flow.png");
        flowTexture.colorSpace = THREE.SRGBColorSpace;
        flowTexture.wrapS = flowTexture.wrapT = THREE.RepeatWrapping;
        // finalOptions.curve.getLength() / 1000 获取管道总长度 / 1000, 是贴图横向重复次数, 以确保每条管道贴图样式相同
        flowTexture.repeat.set(finalOptions.curve.getLength() / 1000, 1);
        flowTexture.needsUpdate = true;
        const mat = new THREE.MeshPhongMaterial({
            color: finalOptions.color,
            transparent: true,
            side: THREE.DoubleSide,
            specular: finalOptions.color,
            shininess: 15,
            //map: flowTexture
        });
        //mat.needsUpdate = true
        const geo = new THREE.TubeGeometry(finalOptions.curve, finalOptions.tubularSegments, finalOptions.radius, finalOptions.radiusSegments);
        super(name, geo, mat);
        this.flowTexture = flowTexture;
        this.flowAnimation = this.createFlowAnimation();
    }
    createFlowAnimation() {
        return gsap.to(this.flowTexture.offset, {
            x: -3,
            duration: 1,
            ease: "none",
            repeat: -1,
            paused: true
        });
    }
    startFlow() {
        const mat = this.material;
        mat.map = this.flowTexture;
        this.flowAnimation.resume();
    }
    stopFlow() {
        this.flowAnimation.pause();
        const mat = this.material;
        mat.map = null;
    }
}

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
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=pipeFlow) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
