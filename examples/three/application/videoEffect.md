---
title: "视频碎片 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,视频碎片"
outline: deep
---
# 视频碎片

*Video Effect*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=videoEffect)

![视频碎片](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/videoEffect.jpg)

## 你将学到什么

- 相机交互控制器
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时

## 效果说明

Three.js 业务向场景组合。

> 应用场景 · Three.js

## 核心概念

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 20)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

const video = document.createElement('video')

video.crossOrigin = 'anonymous' // 跨域

video.src = 'https://z2586300277.github.io/3d-file-server/video/test.mp4'

video.loop = true // 循环播放

video.muted = true // 静音

video.play()

const texture = await new Promise(r => video.onloadeddata = () => r(new THREE.VideoTexture(video))) // 创建视频纹理

const group = new THREE.Group()
const config = {
    width: 16,
    height: 9,
    xGrid: 4,
    yGrid: 3,
    offset: 0.1
}
const ux = 1 / config.xGrid
const uy = 1 / config.yGrid
const planeWidth = config.width / config.xGrid - config.offset
const planeHeight = config.height / config.yGrid - config.offset
for (let i = 0; i < config.xGrid; i++) {
    for (let j = 0; j < config.yGrid; j++) {
        // 创建 4 * 3 子平面实现整体效果
        const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
        })

        // 切割uv来实现纹理映射到全部平面
        const uvs = geometry.attributes.uv.array
        for (let index = 0; index < uvs.length; index += 2) {
            uvs[index] = (uvs[index] + i) * ux
            uvs[index + 1] = (uvs[index + 1] + j) * uy
        }

        const mesh = new THREE.Mesh(geometry, material)

        mesh.dx = 0.004 * (0.5 - Math.random())
        mesh.dy = 0.004 * (0.5 - Math.random())

        const x = (i - config.xGrid / 2) * planeWidth + planeWidth * 0.5 + (i * config.offset) / 2
        const y = (j - config.yGrid / 2) * planeHeight + planeHeight * 0.5 + (j * config.offset) / 2
        mesh.position.set(x, y, 0)
        group.add(mesh)

    }

}
scene.add(group)

const clock = new THREE.Clock()
animate()

function animate() {

    const elapsedTime = clock.getElapsedTime()

    for (const mesh of group.children) {
        mesh.rotation.x += Math.sin(elapsedTime * 0.1) * mesh.dx;
        mesh.rotation.y += Math.sin(elapsedTime * 0.2) * mesh.dy;

        mesh.position.x -= Math.sin(elapsedTime * 0.1) * mesh.dx;
        mesh.position.y += Math.sin(elapsedTime * 0.3) * mesh.dy;
        mesh.position.z += Math.cos(elapsedTime * 0.2) * mesh.dx;
    }

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=videoEffect) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
