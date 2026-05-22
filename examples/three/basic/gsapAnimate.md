---
title: "GSAP动画 - Three.js 案例讲解"
description: "本案例展示 **GSAP动画** 的实现。涉及：相机交互控制器、GSAP / anime.js 属性动画、requestAnimationFrame 渲染循环。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,basic,GSAP动画"
outline: deep
---
# GSAP动画

*GSAP Animate*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=gsapAnimate)

![GSAP动画](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/gsapAnimate.jpg)

## 你将学到什么

- 相机交互控制器
- GSAP / anime.js 属性动画
- requestAnimationFrame 渲染循环
- GUI 面板调试参数

## 效果说明

本案例展示 **GSAP动画** 的实现。涉及：相机交互控制器、GSAP / anime.js 属性动画、requestAnimationFrame 渲染循环。

> 基础案例 · Three.js

## 核心概念

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- 时间线库驱动 position/rotation/uniform，与 rAF 渲染循环配合。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. rAF 循环中 update 并 render

## 代码要点

- **`createGsapAnimation()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import dat from 'dat.gui'
import gsap from 'gsap'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 30, 30)

const renderer = new THREE.WebGLRenderer({ antialias: true , alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AxesHelper(1000))

scene.add(new THREE.GridHelper(100, 20))

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

// 环境贴图
const boxGeometry = new THREE.BoxGeometry(10, 10, 10);

const boxMaterial = new THREE.MeshBasicMaterial({ color: 'blue' });

const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

scene.add(boxMesh);

new dat.GUI().add({fn: () => {

    // 创建一个相机动画
    createGsapAnimation(camera.position, { x: 20, y: 20, z: 20 })

    // 创建一个目标运动动画
    createGsapAnimation(controls.target, { x: -5, y: 2, z: 1 })

}}, 'fn').name('播放');

/* 视角动画 */
function createGsapAnimation(position, position_, gsapQuery = null) {

    //设置动画 x轴运动 持续时间
    return gsap.to(

        position,

        {

            ...position_,

            //间隔时间
            duration: 2,

            //动画参数名
            ease: 'none',

            //重复次数
            repeat: 0,

            //往返移动
            yoyo: false,

            yoyoEase: true,

            ...gsapQuery,

        }

    )

}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=gsapAnimate) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础案例目录](/examples/three/basic/)

> 基础案例 · Three.js
