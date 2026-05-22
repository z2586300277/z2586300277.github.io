---
title: "灯罩 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `DeskLamp`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,灯罩,应用场景"
outline: deep
---

# 灯罩

*Lampshade*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=lampshade)


![灯罩](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/lampshade.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `DeskLamp`。

> 应用场景 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 类与方法

### DeskLamp

- `constructor()` — 初始化成员

## 独立函数

- `animate()` — rAF：update controls + render

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
```

### 片元

- 片元输出 gl_FragColor

```glsl
uniform vec3 color;
      varying vec2 vUv;
      void main() {
        gl_FragColor = vec4(color, vUv.y);
      }
```

## 源码

```js
import {
  Color,
  CylinderGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const size = { width: window.innerWidth, height: window.innerHeight }
const scene = new Scene()
scene.background = new Color('#070630')

const camera = new PerspectiveCamera(45, size.width / size.height, 0.1, 1000)
camera.position.set(30, 30, 30)

const renderer = new WebGLRenderer({ antialias: true })
renderer.setSize(size.width, size.height)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

class DeskLamp extends Group {
  constructor() {
    super()
    this.#createWick()
    this.#createLampshade()
  }

  /**灯芯*/
  #createWick() {
    const geometry = new SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2)
    const material = new MeshBasicMaterial({ color: 0xffffff })
    const sphere = new Mesh(geometry, material)
    sphere.position.set(0, 3, 0)
    this.#createLight(sphere)
    this.add(sphere)
  }

  /**灯罩*/
  #createLampshade() {
    const cylinderGeometry = new CylinderGeometry(1, 5, 3, 32)
    const c
```

