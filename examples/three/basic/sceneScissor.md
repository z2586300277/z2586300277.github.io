---
title: "场景剪切-后处理 - Three.js 案例讲解"
description: "原场景 + 后期 Pass 叠加。主流程在 `animate`、`createSlider`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,场景剪切-后处理,基础案例"
outline: deep
---

# 场景剪切-后处理

*Scene Scissor*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=sceneScissor)


![场景剪切-后处理](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/sceneScissor.jpg)


## 效果说明

原场景 + 后期 Pass 叠加。主流程在 `animate`、`createSlider`。

> 基础案例 · Three.js

## 实现思路

- 后期：`EffectComposer` 串 Pass，先 `RenderPass` 出场景，再 bloom/SSAO 等屏幕 Pass。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

## 代码结构

- 分割滑块方法

## 独立函数

- `animate()` — rAF：update controls + render

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

    renderer.setScissorTest( tru
```

### 分割滑块方法

```js
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
            if (old_left + e.movementX > box.clientWidth - minRightWidth)
```

