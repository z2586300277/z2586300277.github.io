---
title: "模型热力图 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,模型热力图"
outline: deep
---
# 模型热力图

*Model Heatmap*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=modelHeatmap)

![模型热力图](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/modelHeatmap.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环
- GUI 面板调试参数

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 应用场景 · Three.js

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

- **`callModel()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

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
    const { min, max } = box3
    // 根据模型的包围盒 固定y 生成一个平面
    const p1 = new THREE.Vector3(min.x, 0, min.z)
    const p2 = new THREE.Vector3(min.x, 0, max.z)
    const p3 = new THREE.Vector3(max.x, 0, max.z)
    const p4 = new THREE.Vector3(max.x, 0, min.z)
    const geometry = new THREE.BufferGeometry()
    const vertices = new Float32Array([
        p1.x, p1.y, p1.z,
        p2.x, p2.y, p2.z,
        p3.x, p3.y, p3.z,
        p4.x, p4.y, p4.z,
    ])
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    geometry.setIndex([0, 1, 2, 0, 2, 3])
    geometry.attributes.uv = new THREE.Float32BufferAttribute([
        0, 0,
        0, 1,
        1, 1,
        1, 0
    ], 2)
    geometry.computeVertexNormals()

    let list = []

    model.traverse(i => {
        if (i.isMesh) {
            i.material.transparent = true
            i.material.opacity = 0.5
            i.isMesh && list.push(i.name)
        }
    })

    // list 随机获取 5 - 10 个名字形成新的数组
    const randomNum = Math.floor(Math.random() * (10 - 5 + 1)) + 5
    list = list.sort(() => Math.random() - 0.5).slice(0, randomNum)

    let w = max.x - min.x
    let h = max.z - min.z

    /* 热力图实现 */
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
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=modelHeatmap) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
