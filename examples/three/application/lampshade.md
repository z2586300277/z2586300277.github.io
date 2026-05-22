---
title: "灯罩 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `DeskLamp`。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,灯罩"
outline: deep
---
# 灯罩

*Lampshade*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=lampshade)

![灯罩](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/lampshade.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 天空盒与环境贴图
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `DeskLamp`。

> 应用场景 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

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
    const cylinderMaterial = new ShaderMaterial({
      transparent: true,
      uniforms: {
        color: { value: new Color('#CB00E3') }
      },
      vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
      fragmentShader: `
      uniform vec3 color;
      varying vec2 vUv;
      void main() {
        gl_FragColor = vec4(color, vUv.y);
      }
    `
    })
    const cylinder = new Mesh(cylinderGeometry, cylinderMaterial)
    cylinder.position.set(0, 1.7, 0)
    this.add(cylinder)
  }

  /**点光源*/
  #createLight(mesh) {
    const pointLight = new PointLight(0xffffff, 1, 100)
    pointLight.power = 1000
    mesh.add(pointLight)
  }
}

const light1 = new DeskLamp()
light1.position.set(0, 10, 0)
scene.add(light1)

const light2 = new DeskLamp()
light2.position.set(10, 10, 0)
scene.add(light2)

const light3 = new DeskLamp()
light3.position.set(0, 10, 10)
scene.add(light3)

/**
 * 创建地面
 * */
const planeGeometry = new PlaneGeometry(100, 100)
const planeMaterial = new MeshStandardMaterial({
  color: 0x999999,
  side: 2
})
const plane = new Mesh(planeGeometry, planeMaterial)
plane.rotation.x = -Math.PI / 2
scene.add(plane)

animate()
function animate() {

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=lampshade) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
