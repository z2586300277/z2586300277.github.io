---
title: "内发光 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,内发光,着色器"
outline: deep
---

# 内发光

*Inner Glow*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=innerGlow)


![内发光](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/innerGlow.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(5, 5, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

scene.add(new THREE.AxesHelper(50))

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

animate()

function animate() {

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}

const vertexShader = `
varying vec3 vNormal;
varying vec3 vPositionNormal;

void main() {
  // 视图空间下的单位法线向量
  vNormal = normalize(normalMatrix * normal);
  // 视图空间下的单位坐标向量
  vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0) ).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

/**
* 需要注意法线向量值，菲涅尔反射对于法线向量差别比较大的模型效果明显，即不规则物体
* 模型表面平整的话效果较差，不过可以使用法线贴图更改物体法线向量
*/
const fragmentShader = `
uniform vec3 uColor;
uniform float uBias;
uniform float uPower;
uniform float uScale;

varying vec3 vNormal;
varying vec3 vPositi
```

