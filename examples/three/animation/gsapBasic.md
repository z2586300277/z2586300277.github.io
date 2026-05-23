---
title: "gsap使用 - Three.js 案例讲解"
description: "Three.js 关键帧或补间动画。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,animation,gsap使用"
outline: deep
---
# gsap使用

*GSAP Basic*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=animation&id=gsapBasic)

![gsap使用](https://z2586300277.github.io/three-cesium-examples/threeExamples/animation/animejsBasic.jpg)

## 你将学到什么

- 相机交互控制器
- GSAP / anime.js 属性动画
- Tween 补间动画
- requestAnimationFrame 渲染循环
- GUI 面板调试参数

## 效果说明

Three.js 关键帧或补间动画。

> 动画效果 · Three.js

## 核心概念

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- 时间线库驱动 position/rotation/uniform，与 rAF 渲染循环配合。

- 属性插值动画，适合相机动效、UI 过渡。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. rAF 循环中 update 并 render

## 代码要点

- **`createMesh()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`bounceUp()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`slideRight()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

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
 * repeat: 0, // 重复次数
 * repeatDelay: 0, // 重复之间的延迟时间
 * yoyo: false, // 是否往返动画
 * ease: "none", // 动画缓动函数
 * onStart: null, // 动画开始回调函数
 * onUpdate: null, // 动画更新回调函数
 * onComplete: null, // 动画完成回调函数
 * onRepeat: null, // 动画重复回调函数
 * reversed: false, // 是否反向播放动画
 * overwrite: false, // 是否覆盖同一目标的其他动画
 * startAt: { x: 0, y: 0, z: 0, opacity: 1 }, // 动画开始时的属性值
 * 属性同名方法基本是 获取或者设置动画属性值
 * gsap.killTweensOf(mesh6.position) // 终止 mesh6 上的所有动画
 */

let tween = gsap.to(
    mesh.position, { z: 30, delay: 0.5 }
).repeat(1) // 重复一次 等同于设置 repeat: 1
// .timeScale(0.5) // 设置动画的时间缩放，值为 0.5 时动画将以正常速度的一半播放
// .then(() => console.log('动画完成')) // tween 就会变成Promise 对象

// tween.progress(0.3) // 将动画的进度设置为 0.3 会待过 delay 的时间
tween.pause() // 停止
// tween.paused(true) // 也可以这样停止 获取或设置动画的暂停状态

const gui = new GUI()

const folder = gui.addFolder('动画类型')
folder.add({ fn: () => gsap.from(mesh.position, { y: 30, duration: 2 }) }, 'fn').name('from从指定值到当前值')
folder.add({ fn: () => gsap.fromTo(mesh.position, { y: 25 }, { y: 15, duration: 2 }) }, 'fn').name('fromTo从指定值到指定值')

const folder1 = gui.addFolder('基础动画控制')
// folder1.open()

folder1.add({ play: () => tween.play() }, 'play').name('播放动画')
folder1.add({ pause: () => tween.pause() }, 'pause').name('停止动画')

folder1.add({ restart: () => tween.restart() }, 'restart').name('重新开始动画')
folder1.add({ reverse: () => tween.reverse() }, 'reverse').name('反向播放动画')

folder1.add({ resume: () => tween.resume() }, 'resume').name('继续动画') // 仅在动画暂停（pause）时使用
folder1.add({ revert: () => tween.revert() }, 'revert').name('回退并终止动画') // 回退动画并终止它，将目标恢复到动画之前的状态
folder1.add({ kill: () => tween.kill() }, 'kill').name('终止动画') // 终止动画并将其从内存中移除，无法再对其进行控制

// 不会终止 tween 的播放，但会将其时间跳转设置为 value 的值
folder1.add({ seek: 0 }, 'seek').step(0.01).onChange(value => tween.seek(value, false)).name('跳转到指定时间') // 第二个参数表示是否跳过 delay 的时间

folder1.add({
    fn: () => {

        // 由于gsap3 本身就是全局时间线, 所以可以接受第三个参数 => 位置参数  
        gsap.to(mesh.position, {
            y: 30,
            duration: 0.5,
            repeat: 1
        }, 2) //此处位置参数表示2秒后开始动画

    }
}, 'fn').name('第三个参数')

const mesh2 = createMesh(0xff0000, [5, 0, 0])
const mesh3 = createMesh(0x00ff00, [10, 0, 0])

folder1.add({
    fn: () => {
        gsap.to([mesh.position, mesh2.position, mesh3.position], {
            y: 30,
            duration: 0.5,
            repeat: 1,
            stagger: 0.2 // 每个动画之间的延迟时间
        })
    }
}, 'fn').name('多个目标-间隔错开')

const mesh4 = createMesh(0x0000ff, [5, 0, 5])
folder1.add({
    fn: () =>
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=animation&id=gsapBasic) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [动画效果目录](/examples/three/animation/)

> 动画效果 · Three.js
