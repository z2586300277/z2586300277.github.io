---
title: "马赛克 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,马赛克"
outline: deep
---
# 马赛克

*Mosaic Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=mosaicShader)

![马赛克](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/mosaicShader.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环
- GUI 面板调试参数

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 1)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

animate()

function animate() {

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

const vertexShader = ` 
    varying vec2 vUv;
    void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform vec2 vScreenSize;
    uniform float fMosaicScale;
    void main() {
    vec2 vUv2 = vUv;
    vUv2.x = floor(vUv2.x * vScreenSize.x / fMosaicScale) / (vScreenSize.x / fMosaicScale) + (fMosaicScale / 2.0) / vScreenSize.x;
    vUv2.y = floor(vUv2.y * vScreenSize.y / fMosaicScale) / (vScreenSize.y / fMosaicScale) + (fMosaicScale / 2.0) / vScreenSize.y;

    vec4 color = texture2D(tDiffuse, vUv2);
    gl_FragColor = color;
}`

const uniforms = {

    tDiffuse: { type: 't', value: new THREE.TextureLoader().load(HOST + 'files/author/z2586300277.png') },

    vScreenSize: { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight) },

    fMosaicScale: { type: "f", value: 20.0 },

}

const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });

const geometry = new THREE.PlaneGeometry();

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

var gui = new dat.GUI();
gui.add(uniforms['fMosaicScale'], 'value', 1.0, 100.0).step(1.0).name('mosaicScale');
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=mosaicShader) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
