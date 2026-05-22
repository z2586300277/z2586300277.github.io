---
title: "点击第三人称移动 - Three.js 案例讲解"
description: "Three.js 关键帧或补间动画。点击地面，人物会自动走到目标位置。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,animation,点击第三人称移动"
outline: deep
---
# 点击第三人称移动

*Person Move*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=animation&id=personAnimation)

![点击第三人称移动](https://z2586300277.github.io/three-cesium-examples/threeExamples/animation/personAnimation.jpg)

## 你将学到什么

- AnimationMixer 骨骼动画播放与过渡
- glTF/FBX/OBJ 外部模型加载
- 相机交互控制器
- GSAP / anime.js 属性动画
- requestAnimationFrame 渲染循环

## 效果说明

Three.js 关键帧或补间动画。点击地面，人物会自动走到目标位置。

> 动画效果 · Three.js

## 核心概念

- **AnimationMixer** 驱动 glTF 骨骼动画；每帧 `mixer.update(delta)`。动作切换可用 `crossFadeTo` 平滑过渡。

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- 时间线库驱动 position/rotation/uniform，与 rAF 渲染循环配合。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. rAF 循环中 update 并 render

## 代码要点

- **`goAddress()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(5, 5, 5)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AmbientLight(0xffffff, 4), new THREE.GridHelper(40, 20))

animate()

function animate() {

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

}

let group = null

new GLTFLoader().load(FILE_HOST + 'files/model/Soldier.glb',

    gltf => {

        group = gltf.scene

        scene.add(group)

        const clock = new THREE.Clock() // 时钟

        const mixer = new THREE.AnimationMixer(group) // 模型动画

        group.mixerAnimateRender = () => mixer.update(clock.getDelta()) // 动画帧

        group.currentAction = mixer.clipAction(gltf.animations[3]) // walk 动画

    }

)

const raycaster = new THREE.Raycaster() // 射线

const targetPositon = new THREE.Vector3() // 目标位置

const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0) // 碰撞面

// 点击事件
box.addEventListener('click', (event) => {

    const mouse = new THREE.Vector2((event.offsetX / event.target.clientWidth) * 2 - 1, -(event.offsetY / event.target.clientHeight) * 2 + 1)

    raycaster.setFromCamera(mouse, camera)

    raycaster.ray.intersectPlane(plane, targetPositon)

    const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshBasicMaterial())

    mesh.position.copy(targetPositon)

    scene.add(mesh)

    goAddress(group, targetPositon)

})

let oldgsap = null

function goAddress(group, targetPositon) {

    oldgsap?.kill() // 停止上一个动画

    const distance = group.position.distanceTo(targetPositon) // 距离

    const vector = camera.position.clone().sub(group.position) // camera 和 group 差向量

    group.lookAt(targetPositon) // 模型朝向

    group.rotation.y += Math.PI  // 朝向纠正

    const duration = distance / 3  // 距离 / 速度

    oldgsap = gsap.to(group.position, {

        ...targetPositon, duration, ease: "none",

        onStart: () => {

            controls.enabled = false // 禁止控制

            group.currentAction.play() // 播放动画

        },

        onUpdate: () => {

            group.mixerAnimateRender() // 动画帧

            controls.target.copy(group.position) // 目标跟随
            
            camera.position.lerp(group.position.clone().add(vector), 0.1) // 相机跟随

        },

        onComplete: () => controls.enabled = true // 恢复控制

// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=animation&id=personAnimation) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [动画效果目录](/examples/three/animation/)

> 动画效果 · Three.js
