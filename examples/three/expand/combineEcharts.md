---
title: "Echarts结合 - Three.js 案例讲解"
description: "Three.js 接第三方库或扩展能力。主流程在 `animate`、`setCss3DRenderer`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,Echarts结合,扩展功能"
outline: deep
---

# Echarts结合

*Combine Echarts*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=combineEcharts)


![Echarts结合](https://z2586300277.github.io/three-cesium-examples/threeExamples/expand/combineEcharts.jpg)


## 效果说明

Three.js 接第三方库或扩展能力。主流程在 `animate`、`setCss3DRenderer`。

> 扩展功能 · Three.js

## 实现思路

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- css3d 渲染

## 独立函数

- `animate()` — rAF：update controls + render

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
```

### css3d 渲染

```js
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
```

### 图表 ----------------------------------------------------------------------

```js
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
                percent: 0.8,
                style: {
                  fill: 'transparent'
                }
              },
              {
                percent: 1,
                style: {
                  fill: 'black'
                }
              }
            ]
          }
        }
      ]
    }
  })

const css3DObject = new CSS3DObject(container)
css3DObject.position.set(0, 130, 0)

```

