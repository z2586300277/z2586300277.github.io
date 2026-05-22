---
title: "场景剪切-后处理 - Three.js 案例讲解"
description: "原场景 + 后期 Pass 叠加。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,basic,场景剪切-后处理"
outline: deep
---
# 场景剪切-后处理

*Scene Scissor*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=sceneScissor)

![场景剪切-后处理](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/sceneScissor.jpg)

## 你将学到什么

- EffectComposer 后期处理管线
- 相机交互控制器
- 轮廓高亮 OutlinePass
- requestAnimationFrame 渲染循环

## 效果说明

原场景 + 后期 Pass 叠加。

> 基础案例 · Three.js

## 核心概念

- **EffectComposer** 多 Pass 链式渲染：RenderPass → 特效 Pass → 输出屏幕。`composer.render()` 替代 `renderer.render()`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- 选中物体外轮廓发光，常用于编辑器选中态。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. EffectComposer 组装 Pass 链并 render

## 代码要点

- **`createSlider()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 10, 10)
const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true , logarithmicDepthBuffer: true})
renderer.setSize(box.clientWidth, box.clientHeight)
renderer.setAnimationLoop(animate)
box.appendChild(renderer.domElement)
new OrbitControls(camera, renderer.domElement)

const renderPass = new RenderPass(scene, camera);

// 无辉光渲染
const composer_original = new EffectComposer(renderer);
composer_original.addPass(renderPass);

// 辉光渲染
const composer_bloom = new EffectComposer(renderer);
composer_bloom.addPass(renderPass);
composer_bloom.addPass( new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0, 0));

// 设置分割线位置
let initialWidth = 350
createSlider(document.body, initialWidth, (left) => initialWidth = left)

function animate() {

    renderer.setScissorTest( true )

    renderer.setScissor( 0, 0, initialWidth, box.offsetHeight );
    composer_original.render()

    renderer.setScissor( initialWidth, 0, box.clientWidth - initialWidth, box.offsetHeight );
    composer_bloom.render();

    renderer.setScissorTest( false )

}

// 物体
for (let i = 0; i < 100; i++) {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5)
    scene.add(cube)
}

/* 分割滑块方法 */
function createSlider(box, initialWidth, callback) {

    const minLeftWidth = 50;
    const minRightWidth = 100;
    const slider_dom = document.createElement('div')
    box.prepend(slider_dom)

    const color = 'rgba(255, 255, 255, 0.5)'
    Object.assign(slider_dom.style, {
        position: 'absolute',
        left: initialWidth + 'px',
        height: box.clientHeight + 'px',
        transition: 'background 0.5s',
        backgroundColor: color,
        width: '2px',
        cursor: 'ew-resize',
    })

    const move = () => {
        slider_dom.style.backgroundColor = '#277CD5'
        document.body.style.cursor = 'ew-resize'
    }
    const leave = () => {
        slider_dom.style.backgroundColor = color
        document.body.style.cursor = 'default'
    }

    slider_dom.onmousemove = move
    slider_dom.onmouseleave = leave

    slider_dom.ondblclick = function () {
        slider_dom.style.left = initialWidth + 'px'
        callback?.(initialWidth)
    }

    slider_dom.onmousedown = function (e) {

        e.preventDefault()
        let old_left = slider_dom.getBoundingClientRect().left - box.getBoundingClientRect().left

        document.onmousemove = function (e) {

            move()

            if (old_left + e.movementX < minLeftWidth) return
            if (old_left + e.movementX > box.clientWidth - minRightWidth) return

            old_left += e.movementX;
            slider_dom.style.left = old_left + 'px';
            callback?.(old_left)
        }

        document.onmouseup = function () {
            document.onmousemove = null;
            leave()
        }
    }
}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=sceneScissor) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础案例目录](/examples/three/basic/)

> 基础案例 · Three.js
