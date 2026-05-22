---
title: "感谢来自BiBi的支持 - Three.js 案例讲解"
description: "原场景 + 后期 Pass 叠加。主流程在 `animate`、`createText`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,感谢来自BiBi的支持,首页导航"
outline: deep
---

# 感谢来自BiBi的支持

*Thanks BiBi*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=friendStation&id=thanksBibi)


![感谢来自BiBi的支持](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/thanksBibi.jpg)


## 效果说明

原场景 + 后期 Pass 叠加。主流程在 `animate`、`createText`。

> 首页导航 · Three.js

## 实现思路

- 后期：`EffectComposer` 串 Pass，先 `RenderPass` 出场景，再 bloom/SSAO 等屏幕 Pass。

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
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

const DOM = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, DOM.clientWidth / DOM.clientHeight, 0.1, 10000)

camera.position.set(0, 0, 1200)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true , logarithmicDepthBuffer: true})

renderer.setSize(DOM.clientWidth, DOM.clientHeight)

renderer.setPixelRatio( window.devicePixelRatio * 2)

DOM.appendChild(renderer.domElement)

scene.add(new THREE.AmbientLight(0xffffff, 2))

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

const renderPass = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(DOM.clientWidth, DOM.clientHeight), 0.5, 0.4, 0.1);

const composer 
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

