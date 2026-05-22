---
title: "地球扫描 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,地球扫描"
outline: deep
---
# 地球扫描

*Earth Scan*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=earthScan)

![地球扫描](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/earthScan.jpg)

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
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 8, 8)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

window.onresize = () => {

  renderer.setSize(box.clientWidth, box.clientHeight)

  camera.aspect = box.clientWidth / box.clientHeight

  camera.updateProjectionMatrix()

}

const earthGeometry = new THREE.SphereGeometry(2.5, 32, 16)

const earthMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(FILE_HOST + 'threeExamples/shader/earth1.jpg') })

const earth = new THREE.Mesh(earthGeometry, earthMaterial)

scene.add(earth)

const geometry = new THREE.SphereGeometry(3, 32, 16)

const material = new THREE.ShaderMaterial({

  uniforms: {

    iTime: { value: 0.0 },

    pointNum: { value: new THREE.Vector2(64, 32) },

    uColor: { value: new THREE.Color('#bbd9ec') }

  },

  transparent: true,

  vertexShader: `
    varying vec2 vUv;
    void main(){
    vUv=uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`,

  fragmentShader: `
    float PI = acos(-1.0);
    uniform vec3 uColor;
    uniform vec2 pointNum;
    uniform float iTime;                        
    varying vec2 vUv;
    void main(){
    vec2 uv = vUv+ vec2(0.0, iTime);
      float current = abs(sin(uv.y * PI) );             
    if(current < 0.99) {      
      current=current*0.5;
    }
    float d = distance(fract(uv * pointNum), vec2(0.5, 0.5));
    if(d > current*0.2 ) {
       discard;
    } else {
       gl_FragColor =vec4(uColor,current);
    }
  }`

})

const folder = new GUI()

folder.addColor(material.uniforms.uColor, 'value')

folder.add(material.uniforms.pointNum.value, 'x', 1, 128).name('pointNumX')

folder.add(material.uniforms.pointNum.value, 'y', 1, 128).name('pointNumY')

const sphere = new THREE.Mesh(geometry, material)

scene.add(sphere)

animate()

function animate() {

  earth.rotation.y += 0.002

  material.uniforms.iTime.value += 0.002

  requestAnimationFrame(animate)

  controls.update()

  renderer.render(scene, camera)

}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=earthScan) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
