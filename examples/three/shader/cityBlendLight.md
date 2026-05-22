---
title: "城市混合扫光 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`、`modelBlendShader`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,城市混合扫光,着色器"
outline: deep
---

# 城市混合扫光

*City Blend*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=cityBlendLight)


![城市混合扫光](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/cityBlendLight.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`、`modelBlendShader`。

> 着色器 · Three.js

## 实现思路

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- 混合着色

## 独立函数

- `animate()` — rAF：update controls + render
- `modelBlendShader()` — 材质 / GLSL

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
```

### 混合着色

```js
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

        fragBody: `
            float dis = length(v_position - center);
            vec4 diffuseColor;
  
```

