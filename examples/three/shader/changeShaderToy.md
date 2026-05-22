---
title: "切换ShaderToy - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,切换ShaderToy"
outline: deep
---
# 切换ShaderToy

*shaderToy*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=changeShaderToy)

![切换ShaderToy](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/changeShaderToy.jpg)

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

## 代码要点

- **`changeShader()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const DOM = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, DOM.clientWidth / DOM.clientHeight, 0.1, 1000)

camera.position.set(0, 10, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(DOM.clientWidth, DOM.clientHeight)

DOM.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

window.onresize = () => {

    renderer.setSize(DOM.clientWidth, DOM.clientHeight)

    camera.aspect = DOM.clientWidth / DOM.clientHeight

    camera.updateProjectionMatrix()

}

scene.add(new THREE.AmbientLight(0xffffff, 8))

const mesh = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), new THREE.MeshBasicMaterial({ color: 0xffffff }));

scene.add(mesh);

// GUI 对象
const GUI = new dat.GUI()

const fileList = new Array(6).fill().map((_, i) => FILE_HOST + `files/glsl/${i}.frag`)

GUI.add({ url: fileList[0] }, 'url', fileList).onChange((url) => changeShader(url))

changeShader(fileList[5])

let shader = null

animate()

// 渲染 
function animate() {

    shader && (shader.uniforms.u_time.value += 0.02)

    renderer.render(scene, camera)

    requestAnimationFrame(animate)

}

async function changeShader(url) {

    const str = await fetch(url).then(res => res.text())

    shader = {

        uniforms: THREE.UniformsUtils.merge([

            THREE.ShaderLib['phong'].uniforms,

            {
                u_resolution: {
                    type: 'v2',
                    value: new THREE.Vector2(DOM.clientWidth, DOM.clientHeight)
                },

                u_time: {
                    type: 'f',
                    value: 0.0
                },

                u_mouse: {
                    type: 'v2',
                    value: new THREE.Vector2(0, 0)
                }

            }

        ]),

        side: THREE.DoubleSide,

        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                gl_Position = projectionMatrix * mvPosition;
            }
        `,

        fragmentShader: str,

    }

    shader.fragmentShader = shader.fragmentShader.replace(/gl_FragCoord/, 'vUv * u_resolution.xy')

    shader.fragmentShader = shader.fragmentShader.replace(/uniform float u_time;/, `
        uniform float u_time;
        varying vec2 vUv;
    `)

    const material = new THREE.ShaderMaterial(shader);

    mesh.material.dispose()

    mesh.material = material

}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=changeShaderToy) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
