---
title: "模型热力图 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`、`callModel`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,模型热力图,应用场景"
outline: deep
---

# 模型热力图

*Model Heatmap*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=modelHeatmap)


![模型热力图](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/modelHeatmap.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`、`callModel`。

> 应用场景 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

## 代码结构

- 热力图实现

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(5, 5, 5)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

animate()

function animate() {

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

}

scene.add(new THREE.AmbientLight(0xffffff, 3))

new GLTFLoader().load(

    'https://z2586300277.github.io/three-editor/dist/files/resource/datacenter.glb',

    gltf => {

        scene.add(gltf.scene)

        callModel(gltf.scene)

    }

)

let model = null

function callModel(e) {
    model = e
    const box3 = new THREE.Box3().setFromObject(model)

```

### 热力图实现

```js
const arr = list.map(i => {
        const obj = model.getObjectByName(i)
        const worldPosition = new THREE.Vector3()
        obj.getWorldPosition(worldPosition)
        return [(worldPosition.x - min.x) / w, (worldPosition.z - min.z) / h, Math.random() * 10]
    }).flat()
  
    const uniforms1 = {
        HEAT_MAX: { value: 10, type: 'number', unit: 'float' },
        PointRadius: { value: 0.2, type: 'number', unit: 'float' },
        intensity: { value: 3, type: 'number', unit: 'float' },
        PointsCount: { value: arr.length, type: 'number-array', unit: 'int' },
        c1: { value: new THREE.Color('green'), type: 'color', unit: 'vec3' }, // 蓝色
        c2: { value: new THREE.Color('red'), type: 'color', unit: 'vec3' }, // 红色
        uvY: { value: 1, type: 'number', unit: 'float' },
        uvX: { value: 1, type: 'number', unit: 'float' },
        opacity: { value: 0.6, type: 'number', unit: 'float' }, // 稍微降低整体不透明度
        edgeFalloff: { value: 2.0, type: 'number', unit: 'float' } // 边缘衰减参数
    }

    const gui = new GUI()
    gui.add(uniforms1.HEAT_MAX, 'value', 0, 10).name('HEAT_MAX')
    gui.add(uniforms1.PointRadius, 'value', 0, 1).name('PointRadius')
    gui.add(uniforms1.intensity, 'value', 0, 10).name('intensity')
    gui.add(uniforms1.uvY, 'value', 0, 1).name('uvY')
    gui.add(uniforms1.uvX, 'value', 0, 1).name('uvX')
    gui.add(u
```

