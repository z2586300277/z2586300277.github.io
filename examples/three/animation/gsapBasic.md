---
title: "gsap使用 - Three.js 案例讲解"
description: "Three.js 关键帧或补间动画。主流程在 `animate`、`createMesh`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,gsap使用,动画效果"
outline: deep
---

# gsap使用

*GSAP Basic*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=animation&id=gsapBasic)


![gsap使用](https://z2586300277.github.io/three-cesium-examples/threeExamples/animation/animejsBasic.jpg)


## 效果说明

Three.js 关键帧或补间动画。主流程在 `animate`、`createMesh`。

> 动画效果 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 补间动画交给 GSAP/anime/Tween，别在 rAF 里手搓 easing。

## 代码结构

- 第3步：Timeline 控制方法
- 第4步：label 标签
- 第5步：嵌套时间线
- 第6步：综合实战 - 方块编队表演

## 独立函数

- `animate()` — rAF：update controls + render
- `createMesh()` — 材质 / GLSL

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import { GUI } from 'dat.gui'

const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)
camera.position.set(0, 10, 40)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)
scene.add(new THREE.GridHelper(100, 20))
const gidHelper = new THREE.GridHelper(100, 20)
gidHelper.rotation.x = Math.PI / 2
scene.add(gidHelper)

animate()
function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

function createMesh(color = 0xffffff, p, size = 1) {
    const geometry = new THREE.BoxGeometry(size, size, size)
    const material = new THREE.MeshBasicMaterial({ color })
    const mesh = new THREE.Mesh(geometry, material)
    if (p) mesh.position.set(...p)
    scene.add(mesh)
    return mesh
}
const mesh = createMesh()

// https://gsap.com/cheatsheet

// 设置默认动画参数
gsap.defaults({ ease: "none", duration: 2 });

/**
 * 所有参数
 * duration: 2, // 动画持续时间
 * delay: 0, // 动画延迟时间
 * rep
```

### 第3步：Timeline 控制方法

```js
// timeline 和 tween 一样，支持 play/pause/reverse/seek 等全部控制方法
let mainTl = gsap.timeline({
    defaults: { duration: 0.6, ease: 'power2.inOut' },
    paused: true,  // 创建时暂停，手动控制播放
    repeat: 1,
    yoyo: true
})
mainTl.to(mesh6.position, { y: 15 })
    .to(mesh8.position, { y: 15 }, "<")
    .to(mesh9.position, { y: 15 }, "<0.2")
    .to(mesh6.position, { x: 10 })
    .to(mesh8.position, { x: 15 }, "<")

folder2.addFn(() => mainTl.play()).name('6-tl.play()')
folder2.addFn(() => mainTl.pause()).name('6-tl.pause()')
folder2.addFn(() => mainTl.reverse()).name('6-tl.reverse()')
folder2.addFn(() => mainTl.restart()).name('6-tl.restart()')
folder2.add({ progress: 0 }, 'progress', 0, 1).step(0.01).onChange(v => {
    mainTl.progress(v) // 拖拽滑块控制整条时间线的进度
}).name('6-tl.progress滑块')
```

### 第4步：label 标签

```js
// label 可以给时间线的某个时间点命名，方便跳转和定位
folder2.addFn(() => {
    const tl = gsap.timeline({ defaults: { duration: 0.6, ease: 'bounce.out' } })

    tl.to(mesh6.position, { y: 10 })
      .addLabel("middle")                            // 在此处添加标签 "middle"
      .to(mesh8.position, { y: 10 }, "middle")       // 从 "middle" 标签处开始
      .to(mesh9.position, { y: 10 }, "middle+=0.2")  // 从 "middle" 标签后 0.2s 开始
      .addLabel("end")

    // 也可以跳转到标签
    // tl.play("middle")   // 从 middle 标签处开始播放
    // tl.seek("end")      // 直接跳到 end 标签

    console.log('标签 middle 的时间点:', tl.labels.middle, 's')
    console.log('标签 end 的时间点:', tl.labels.end, 's')
}).name('7-label标签')
```

