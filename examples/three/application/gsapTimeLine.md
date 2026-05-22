---
title: "时间轴动画 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,时间轴动画"
outline: deep
---
# 时间轴动画

*Gsap TimeLine*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=gsapTimeLine)

![时间轴动画](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/gsapTimeLine.jpg)

## 你将学到什么

- 相机交互控制器
- 实时阴影 ShadowMap
- 天空盒与环境贴图
- GSAP / anime.js 属性动画
- requestAnimationFrame 渲染循环

## 效果说明

Three.js 业务向场景组合。

> 应用场景 · Three.js

## 核心概念

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- 阴影四步：`renderer.shadowMap.enabled`、光源 `castShadow`、物体 `castShadow`、地面 `receiveShadow`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

- 时间线库驱动 position/rotation/uniform，与 rAF 渲染循环配合。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)
camera.position.set(0, 10, 20)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize(box.clientWidth, box.clientHeight)
renderer.shadowMap.enabled = true
box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

// 场景设置
scene.background = new THREE.Color(0x87ceeb)
scene.add(new THREE.AmbientLight(0xffffff, 0.6))
const light = new THREE.DirectionalLight(0xffffff, 2)
light.position.set(10, 20, 5)
light.castShadow = true
scene.add(light)

const ground = new THREE.Mesh( new THREE.PlaneGeometry(30, 30),new THREE.MeshLambertMaterial({ color: 0x228b22 }))
ground.rotation.x = -Math.PI / 2
ground.receiveShadow = true
scene.add(ground)

// 花朵
const flower = new THREE.Group()
const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 3),
    new THREE.MeshPhongMaterial({ color: 0x228b22 })
)
stem.position.y = 1.5
stem.castShadow = true

const petals = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 12, 12),
    new THREE.MeshPhongMaterial({ color: 0xff69b4, shininess: 100 })
)
petals.position.y = 3
petals.scale.set(1, 0.5, 1)
petals.castShadow = true

flower.add(stem, petals)
scene.add(flower)

// 蝴蝶
const butterfly = new THREE.Group()
const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 1),
    new THREE.MeshPhongMaterial({ color: 0x8b4513 })
)
const wing1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 8, 8),
    new THREE.MeshPhongMaterial({ color: 0xff6347, transparent: true, opacity: 0.8 })
)
wing1.scale.set(1.5, 0.1, 1)
wing1.position.set(0.3, 0, 0)

const wing2 = wing1.clone()
wing2.position.set(-0.3, 0, 0)

butterfly.add(body, wing1, wing2)
butterfly.position.set(5, 4, 0)
scene.add(butterfly)

// 简洁花园动画
const tl = gsap.timeline({ repeat: -1, yoyo: true }) // repeat: -1 无限循环, yoyo: true 往返动画

tl.from(flower.scale, { x: 0, y: 0, z: 0, duration: 2, ease: "back.out(1.7)" })
  .to(petals.material.color, { r: 1, g: 0.8, b: 0.2, duration: 1 }, "-=0.5") // -=0.5 表示与前一个动画同时开始
  .to(butterfly.position, { x: 0, y: 5, z: 2, duration: 3, ease: "power1.inOut" })
  .to(butterfly.rotation, { z: Math.PI / 4, duration: 0.5 }, "-=1") // -=1 表示与前一个动画同时开始
  .to(petals.scale, { x: 1.3, y: 0.6, z: 1.3, duration: 1 })
  .to(butterfly.position, { x: -3, y: 3, z: -2, duration: 2 })

animate()

function animate() {
    requestAnimationFrame(animate)
    
    // 蝴蝶翅膀扇动
    wing1.rotation.z = Math.sin(Date.now() * 0.02) * 0.3
    wing2.rotation.z = -Math.sin(Date.now() * 0.02) * 0.3
    
    // 花朵轻微摆动
    petals.rotation.y += 0.005
    
    renderer.render(scene, camera)
}

window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()
}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=gsapTimeLine) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
