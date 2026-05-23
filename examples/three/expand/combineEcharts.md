---
title: "Echarts结合 - Three.js 案例讲解"
description: "Three.js 接第三方库或扩展能力。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,expand,Echarts结合"
outline: deep
---
# Echarts结合

*Combine Echarts*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=expand&id=combineEcharts)

![Echarts结合](https://z2586300277.github.io/three-cesium-examples/threeExamples/expand/combineEcharts.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 相机交互控制器
- CSS2D/3D 标签渲染
- ECharts 与三维融合
- requestAnimationFrame 渲染循环

## 效果说明

Three.js 接第三方库或扩展能力。

> 扩展功能 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- DOM 元素叠加在 3D 坐标上，适合信息面板（注意与 WebGL 深度关系）。

- 二维图表/飞线与 Cesium/Three 场景叠加或纹理映射。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. rAF 循环中 update 并 render

## 代码要点

- **`setCss3DRenderer()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as echarts from 'echarts'

const DOM = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, DOM.clientWidth / DOM.clientHeight, 0.1, 10000)

camera.position.set(50, 90, 300)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(DOM.clientWidth, DOM.clientHeight)

DOM.appendChild(renderer.domElement)

scene.add(new THREE.AmbientLight(0xffffff, 3))

new OrbitControls(camera, renderer.domElement)

const css3DRender = setCss3DRenderer(DOM)

new GLTFLoader().load(FILE_HOST + "files/model/Fox.glb", gltf => scene.add(gltf.scene))

animate()

function animate() {

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

    css3DRender.render(scene, camera)
}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

    css3DRender.resize()

}

/* css3d 渲染 */
function setCss3DRenderer(DOM) {

    const css3DRender = new CSS3DRenderer()

    css3DRender.resize = () => {

        css3DRender.setSize(DOM.clientWidth, DOM.clientHeight)

        css3DRender.domElement.style.zIndex = 0

        css3DRender.domElement.style.position = 'relative'

        css3DRender.domElement.style.top = -DOM.clientHeight + 'px'

        css3DRender.domElement.style.height = DOM.clientHeight + 'px'

        css3DRender.domElement.style.width = DOM.clientWidth + 'px'

        css3DRender.domElement.style.pointerEvents = 'none'

    }

    css3DRender.resize()

    DOM.appendChild(css3DRender.domElement)

    return css3DRender

}

/* 图表 ---------------------------------------------------------------------- */

const container = document.createElement("div")
container.style.width = "300px"
container.style.height = "200px"
const myChart = echarts.init(container)

myChart.setOption({
    graphic: {
      elements: [
        {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: 'Echarts',
            fontSize: 80,
            fontWeight: 'bold',
            lineDash: [0, 200],
            lineDashOffset: 0,
            fill: 'transparent',
            stroke: '#fff',
            lineWidth: 1
          },
          keyframeAnimation: {
            duration: 3000,
            loop: true,
            keyframes: [
              {
                percent: 0.7,
                style: {
                  fill: 'transparent',
                  lineDashOffset: 200,
                  lineDash: [200, 0]
                }
              },
              {
                // Stop for a while.
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=expand&id=combineEcharts) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [扩展功能目录](/examples/three/expand/)

> 扩展功能 · Three.js
