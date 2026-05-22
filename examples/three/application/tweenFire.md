---
title: "精灵火花 - Three.js 案例讲解"
description: "大量重复物体或粒子，注意 draw call 与 update 频率。主流程在 `animate`、`initParticle`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,精灵火花,应用场景"
outline: deep
---

# 精灵火花

*Tween Fire*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=tweenFire)


![精灵火花](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/tweenFire.jpg)


## 效果说明

大量重复物体或粒子，注意 draw call 与 update 频率。主流程在 `animate`、`initParticle`。

> 应用场景 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 补间动画交给 GSAP/anime/Tween，别在 rAF 里手搓 easing。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import TWEEN from "three/addons/libs/tween.module.js";
import { GUI } from 'dat.gui'

// 获取容器并设置场景、相机和渲染器
const box = document.getElementById('box');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000);
camera.position.set(0, 200, 200);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true });
renderer.setSize(box.clientWidth, box.clientHeight);
box.appendChild(renderer.domElement);

// 控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    TWEEN.update();
    renderer.render(scene, camera);
}
animate();

// 颜色配置
const colorArr = [
    { position: 0, color: 'rgba(255,255,255,1)' },
    { position: 0.05, color: 'rgba(255,230,140,0.9)' },
    { position: 0.2, color: 'rgba(255,180,40,0.6)' },
    { position: 1, color: 'rgba(255,100,0,0)' }
];

// 生成纹理
const canvas = document.createElement('canvas');
canvas.width = 256;
canvas.height = 256;
const context = canvas.getContext('2d');
context.clearRect(0, 0, canvas.width, canvas.height);
const gradient = context.createRadialGradient(
```

