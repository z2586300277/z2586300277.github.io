---
title: "热力图 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`、`getFragmentShader`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,热力图,扩展功能"
outline: deep
---

# 热力图

*Heatmap Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=heatmapShader)


![热力图](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/heatmapShader.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`、`getFragmentShader`。

> 扩展功能 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- 热力图实现

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 20)

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

scene.add(new THREE.AmbientLight(0xffffff, 2), new THREE.AxesHelper(1000))
```

### 热力图实现

```js
const arr = [[0., 0., 10.], [.2, .6, 5.], [.25, .7, 8.], [.33, .9, 5.], [.35, .8, 6.], [0.017, 5.311, 6.000], [-.45, .8, 4.], [-.2, -.6, 5.], [-.25, -.7, 8.], [-.33, -.9, 8.], [.35, -.45, 10.], [-.1, -.8, 10.], [.33, -.3, 5.], [-.35, .75, 6.], [.6, .4, 10.], [-.4, -.8, 4.], [.7, -.3, 6.], [.3, -.8, 8.]].map(i => new THREE.Vector3(...i))

const uniforms1 = {

    HEAT_MAX: { value: 10, type: 'number', unit: 'float' },

    PointRadius: { value: 0.42, type: 'number', unit: 'float' },

    PointsCount: { value: arr.length, type: 'number-array', unit: 'int' }, // 数量

    c1: { value: new THREE.Color(0x000000), type: 'color', unit: 'vec3' },

    c2: { value: new THREE.Color(0x000000), type: 'color', unit: 'vec3' },

    uvY: { value: 1, type: 'number', unit: 'float' },

    uvX: { value: 1, type: 'number', unit: 'float' },

    opacity: { value: 1, type: 'number', unit: 'float' }

}

const gui = new GUI()

gui.add(uniforms1.HEAT_MAX, 'value', 0, 10).name('HEAT_MAX')

gui.add(uniforms1.PointRadius, 'value', 0, 1).name('PointRadius')

gui.add(uniforms1.uvY, 'value', 0, 1).name('uvY')

gui.add(uniforms1.uvX, 'value', 0, 1).name('uvX')

gui.add(uniforms1.opacity, 'value', 0, 1).name('opacity')

gui.addColor(uniforms1.c1, 'value').name('c1')

gui.addColor(uniforms1.c2, 'value').name('c2')

const uniforms2 = {

    Points: { value: arr, type: 'vec3
```

### 循环

```js
setInterval(() => {

    arr.pop()

    arr.unshift(new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 10))

    uniforms.PointsCount.value = arr.length

    shaderMaterial.fragmentShader = getFragmentShader()

    shaderMaterial.needsUpdate = true

}, 200)
```

