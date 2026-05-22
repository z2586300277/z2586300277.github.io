---
title: "视频着色器 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,视频着色器"
outline: deep
---
# 视频着色器

*Video Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=videoShader)

![视频着色器](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/videoShader.jpg)

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

camera.position.set(0, 10, 10)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

window.onresize = () => {

  renderer.setSize(box.clientWidth, box.clientHeight)

  camera.aspect = box.clientWidth / box.clientHeight

  camera.updateProjectionMatrix()
  
}

scene.add(new THREE.AxesHelper(50000)) // 坐标轴

const amibientLight = new THREE.AmbientLight(0xffffff, 4) // 环境光

scene.add(amibientLight) // 添加环境光

const geometry = new THREE.BoxGeometry(5, 5, 5) // 立方体

const video = document.createElement('video')

video.crossOrigin = 'anonymous' // 跨域

video.src = 'https://z2586300277.github.io/3d-file-server/video/test.mp4'

video.loop = true // 循环播放

video.muted = true // 静音

video.play()

const texture = await new Promise(r => video.onloadeddata = () => r(new THREE.VideoTexture(video))) // 创建视频纹理

// 使用 shader 库中的phong材质 进行修改
const shader = {
    
    uniforms: THREE.UniformsUtils.merge([

        THREE.ShaderLib['phong'].uniforms,

        {
            r: {
                type: 'v2',
                value: new THREE.Vector2(box.clientWidth, box.clientHeight)
            },
            t: {
                type: 'f',
                value: 0.0
            },
            colorTexture: { value: texture },
            calcType: {
                value: 2
            }
        }

    ]),

    vertexShader: THREE.ShaderLib['phong'].vertexShader,

    fragmentShader: THREE.ShaderLib['phong'].fragmentShader,

}

// GUI 切换混合运算类型
const GUI = new dat.GUI()

GUI.add(shader.uniforms.calcType, 'value', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).name('混合运算类型');

// 动画
animate()

function animate() {

    shader.uniforms.t.value += 0.1

    renderer.render(scene, camera)

    requestAnimationFrame(animate)

}

shader.vertexShader = shader.vertexShader.replace(/#include <common>/, `
    varying vec2 vUv;
    #include <common>    
`)

shader.vertexShader = shader.vertexShader.replace('void main() {', `
    void main() {
    vUv = uv; 
`)

shader.fragmentShader = shader.fragmentShader.replace(/#include <common>/, `
    precision highp float;
    varying vec2 vUv;
    uniform vec2 r;
    uniform float t;
    uniform float calcType;
    uniform sampler2D colorTexture;
    #include <common> 
`)

// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=videoShader) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
