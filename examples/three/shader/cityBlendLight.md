---
title: "城市混合扫光 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,城市混合扫光"
outline: deep
---
# 城市混合扫光

*City Blend*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=cityBlendLight)

![城市混合扫光](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/cityBlendLight.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. 定义材质/shader 与 uniforms，rAF 中更新
4. rAF 循环中 update 并 render

## 代码要点

- **`modelBlendShader()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(157, 545, -987)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

renderer.setClearColor(0x000000, 0)

renderer.setPixelRatio(window.devicePixelRatio * 2)

new OrbitControls(camera, renderer.domElement)

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

box.appendChild(renderer.domElement)

const dirLight = new THREE.DirectionalLight(0xffffff, 3.8)

dirLight.position.set(83, 61, -183)

dirLight.target.position.set(10, -11, -194)

scene.add(dirLight)

const pointLight = new THREE.PointLight(0xffffff, 2)

pointLight.position.set(-60, 182, -98)

scene.add(pointLight)

let model = null

// 加载模型
new FBXLoader().load(HOST + '/files/model/city.FBX', (object3d) => {

    scene.add(object3d)

    object3d.scale.set(0.04, 0.04, 0.04)

    object3d.position.set(224, -9, -49)

    model = object3d

    modelBlendShader(object3d, box)

})

// 渲染
animate()

function animate() {

    model && model.render?.()

    renderer.render(scene, camera)

    requestAnimationFrame(animate)

}

/* 混合着色 */
function modelBlendShader(model) {

    let materials = []

    model.traverse(c => c.isMesh && materials.push(c.material))

    materials = [... new Set(materials)]

    const uniforms = {

        innerCircleWidth: { value: 480, type: 'number', unit: 'float' },

        circleWidth: { value: 160, type: 'number', unit: 'float' },

        circleMax: { value: 940, type: 'number', unit: 'float' },

        circleSpeed: { value: 1.5, type: 'number', unit: 'float' },

        diff: { value: new THREE.Color(0x6edbe8), type: 'color', unit: 'vec3' },

        color3: { value: new THREE.Color(0x1919f9), type: 'color', unit: 'vec3' },

        center: { value: new THREE.Vector3(-1, 0, 0), type: 'position', unit: 'vec3' },

        intensity: { value: 4, type: 'number', unit: 'float' },

        isDisCard: { value: false, type: 'bool', unit: 'bool' },

    }

    const glslProps = {

        vertexHeader: `
            varying vec2 vUv;
            varying vec3 v_position;
            void main() {
                vUv = uv;
                v_position = position;
        `,

        fragHeader: Object.keys(uniforms).map(i => 'uniform ' + uniforms[i].unit + ' ' + i + ';').join('\n') + '\n' + 'varying vec3 v_position; varying vec2 vUv;\n',
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=cityBlendLight) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
