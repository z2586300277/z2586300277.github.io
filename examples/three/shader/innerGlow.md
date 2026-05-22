---
title: "内发光 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,内发光"
outline: deep
---
# 内发光

*Inner Glow*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=innerGlow)

![内发光](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/innerGlow.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环

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
varying vec3 vPositionNormal;

// 菲涅尔反射
float fresnelReflex() {
    return pow(uBias + uScale * abs(dot(vNormal, vPositionNormal)), uPower);
}

void main() {
    float opacity = fresnelReflex();
    gl_FragColor = vec4(uColor, opacity);
}`

const material = new THREE.ShaderMaterial({
    uniforms: {
        uColor: { value: new THREE.Color(0x00ffff) },
        uBias: { value: 1.0 },
        uScale: { value: -1.0 },
        uPower: { value: 2.0 }
    },
    vertexShader,
    fragmentShader,
    transparent: true
})

const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), material)

scene.add(sphere)

const vertexShader1 = `
  varying vec2 vUV;

  void main() {
  vUV = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `
const fragmentShader1 = `
  uniform vec3 uColor;

  varying vec2 vUV;

  float glow(vec2 coord, float radius, float intensity) {
    return pow(radius / length(coord), intensity);
  }

  void main() {
    float ratio = glow(vUV - vec2(0.5), 0.1, 3.0);
    gl_FragColor = vec4(uColor * ratio, ratio);
  }

  `
const material1 = new THREE.ShaderMaterial({
  uniforms: {
    uColor: { value: new THREE.Color(0x00ffff) }
  },
  vertexShader: vertexShader1,
  fragmentShader: fragmentShader1,
  depthWrite: false,
  transparent: true
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=innerGlow) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
