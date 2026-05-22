---
title: "Cesium Three切换 - Cesium.js 案例讲解"
description: "Cesium 接第三方库或扩展能力。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,webgl,expand,Cesium Three切换"
outline: deep
---
# Cesium Three切换

*Cesium Switch*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=expand&id=cesiumSwitch)

![Cesium Three切换](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/expand/cesiumSwitch.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 相机交互控制器
- GSAP / anime.js 属性动画
- Cesium Viewer 初始化
- Cesium Entity 高层 API

## 效果说明

Cesium 接第三方库或扩展能力。

> 扩展功能 · Cesium.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- 时间线库驱动 position/rotation/uniform，与 rAF 渲染循环配合。

- **Viewer** 封装地球、相机、图层；可关闭 animation/timeline 等 UI 精简界面。

## 实现步骤

1. 初始化 `Cesium.Viewer` 与底图图层
2. 添加 Entity / Primitive / DataSource 等业务对象
3. 配置 ScreenSpaceEventHandler 交互
4. 按需 `camera.flyTo` 定位视角

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as Cesium from 'cesium'
import * as dat from 'dat.gui'
import gsap from 'gsap'

const box = document.getElementById('box')

/* ------Cesium 操作-------- */
const cesiumBox = document.createElement('div')
Object.assign(cesiumBox.style, {
    height: '100%',
    width: '100%',
})
box.appendChild(cesiumBox)

const viewer = new Cesium.Viewer(cesiumBox, {
    animation: false,//是否创建动画小器件，左下角仪表    
    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')),
    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮
    timeline: false,//是否显示时间轴    
    infoBox: false,//是否显示信息框   
})

const entity = viewer.entities.add({
    name: '房子',
    position: Cesium.Cartesian3.fromDegrees(116.3975, 39.9085, 0), // 北京的经纬度和高度
    model: {
        uri: FILE_HOST + 'models/glb/build2.glb',
        minimumPixelSize: 100, // 最小像素大小
        maximumScale: 20000, // 最大缩放比例
    }
})
viewer.zoomTo(entity, new Cesium.HeadingPitchRange(0, -Math.PI / 4, 200)) // 设置相机位置和角度

viewer.screenSpaceEventHandler.setInputAction(async (movement) => {
    const pickedObject = viewer.scene.pick(movement.position);
    if (Cesium.defined(pickedObject) && pickedObject.id === entity) {
        if (pickedObject.id.name === '房子') {
            viewer.flyTo(entity)
            setTimeout(() => {
                threeBox.style.display = 'block'
                cesiumBox.style.display = 'none'
                const oldPosition = camera.position.clone()
                camera.position.set(0, 40, 40) // 设置新的相机位置
                gsap.to(camera.position, { ...oldPosition, duration: 2 })
            }, 1800)
        }
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
/* ------Cesium 操作-------- */

/* ---------Three 操作--------- */
const threeBox = document.createElement('div')
threeBox.style.height = '100%'
threeBox.style.width = '100%'
threeBox.style.position = 'absolute'
threeBox.style.top = '0'
threeBox.style.left = '0'
box.appendChild(threeBox)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, threeBox.clientWidth / threeBox.clientHeight, 0.1, 1000000)
camera.position.set(0, 1, 3)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(threeBox.clientWidth, threeBox.clientHeight)
threeBox.appendChild(renderer.domElement)
scene.add(new THREE.AmbientLight(0xffffff, 3), new THREE.AxesHelper(1000))
renderer.setAnimationLoop(() => renderer.render(scene, camera))
new OrbitControls(camera, renderer.domElement)
new GLTFLoader().load(FILE_HOST + 'models/glb/build2.glb', (gltf) => {
    scene.add(gltf.scene)
    gltf.scene.position.set(-5, 0, 5)
})
threeBox.style.display = 'none' // 默认隐藏 Three.js 视图
/* ---------Three 操作--------- */

const gui = new dat.GUI()
const options = { cesium: true, three: false }

gui.add(options, 'cesium').name('Cesium').onChange((value) => cesiumBox.style.display = value ? 'block' : 'none')
gui.add(options, 'three').name('Three.js').onChange((value) => threeBox.style.display = value ? 'block' : 'none')

gui.add({ switch: () => {
    
     gsap.to(camera.position, { x: 0, y: 40, z: 40, duration: 1.5, onComplete: () => { 
        threeBox.style.display = 'none'
        cesiumBox.style.display = 'block'
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(116.3975, 39.9085, 200), // 北京的经纬度和高度
            duration: 1.5,
        })
     }})

} }, 'switch').name('切换回Cesium')

GLOBAL_CONFIG.ElMessage('点击模型切换到 Three.js场景')
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=expand&id=cesiumSwitch) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [扩展功能目录](/examples/cesium/expand/)

> 扩展功能 · Cesium.js
