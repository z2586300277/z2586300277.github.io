---
title: "文字采集成粒子 - Three.js 案例讲解"
description: "Three.js 大量点/面片模拟粒子。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,particle,文字采集成粒子"
outline: deep
---
# 文字采集成粒子

*Text Particle*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=textParticle)

![文字采集成粒子](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/textParticle.jpg)

## 你将学到什么

- 相机交互控制器
- 点云 / 粒子 / 实例化渲染
- requestAnimationFrame 渲染循环

## 效果说明

Three.js 大量点/面片模拟粒子。

> 粒子 · Three.js

## 核心概念

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **Points** 大量顶点用点精灵渲染；**InstancedMesh** 相同几何体批量绘制，降低 draw call。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 0, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const loader = new FontLoader()
loader.load(FILE_HOST + 'files/json/font.json', font => {

    const textGeometry = new TextGeometry(`
        Three.js
        Cesium.js
        Examples
          - star -
    `, {
        font,
        size: 1,
        depth: 0.5,
        curveSegments: 10,
        bevelEnabled: false,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 5
    }).center()

    const mesh = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const sampler = new MeshSurfaceSampler(mesh).build();
    const positions = new Float32Array(30000);
    const colors = new Float32Array(30000);
    const samplePoint = new THREE.Vector3();
    const color = new THREE.Color();
    
    for (let i = 0; i < 10000; i++) {
        sampler.sample(samplePoint);
        positions.set([samplePoint.x, samplePoint.y, samplePoint.z], i * 3);
    
        // 随机生成颜色
        color.setHSL(Math.random(), 1.0, 0.5);
        colors.set([color.r, color.g, color.b], i * 3);
    }
    
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const pointsMaterial = new THREE.PointsMaterial({ size: 0.04, vertexColors: true });
    scene.add(new THREE.Points(pointsGeometry, pointsMaterial));

})

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
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=textParticle) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [粒子目录](/examples/three/particle/)

> 粒子 · Three.js
