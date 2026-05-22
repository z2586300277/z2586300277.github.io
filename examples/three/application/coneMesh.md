---
title: "圆锥网格 - Three.js 案例讲解"
description: "原场景 + 后期 Pass 叠加。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,圆锥网格"
outline: deep
---
# 圆锥网格

*Cone Mesh*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=coneMesh)

![圆锥网格](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/coneMesh.jpg)

## 你将学到什么

- EffectComposer 后期处理管线
- 相机交互控制器
- 轮廓高亮 OutlinePass
- requestAnimationFrame 渲染循环

## 效果说明

原场景 + 后期 Pass 叠加。

> 应用场景 · Three.js

## 核心概念

- **EffectComposer** 多 Pass 链式渲染：RenderPass → 特效 Pass → 输出屏幕。`composer.render()` 替代 `renderer.render()`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- 选中物体外轮廓发光，常用于编辑器选中态。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. EffectComposer 组装 Pass 链并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(0, 0, 20)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const effectComposer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(box.clientWidth, box.clientHeight), 0.8, 0.4, 0.0);
effectComposer.addPass(bloomPass);

const geometry = new THREE.ConeGeometry(3.5, 5.5, 4);
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("https://g2657.github.io/examples-server/smartCity/demo/image/gradual_change_y_02.png");
const material = new THREE.MeshBasicMaterial({
    map: texture
})

const cone = new THREE.Mesh(geometry, material);
cone.rotation.x = -Math.PI;
scene.add(cone);

let d = 0.03
animate()

function animate() {

    if (cone.position.y > 3 || cone.position.y < 0) d = -d
    cone.position.y += d;
    cone.rotation.y += Math.PI / 100;

    requestAnimationFrame(animate)
    effectComposer.render()

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=coneMesh) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
