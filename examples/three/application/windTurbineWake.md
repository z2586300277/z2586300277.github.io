---
title: "风力涡轮机尾迹 - Three.js 案例讲解"
description: "大量重复物体或粒子，注意 draw call 与 update 频率。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,风力涡轮机尾迹"
outline: deep
---
# 风力涡轮机尾迹

*Wind Turbine Wake*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=windTurbineWake)

![风力涡轮机尾迹](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/windTurbineWake.png)

## 你将学到什么

- 相机交互控制器
- 实时阴影 ShadowMap
- 天空盒与环境贴图
- 点云 / 粒子 / 实例化渲染
- 水面 / 反射面效果

## 效果说明

大量重复物体或粒子，注意 draw call 与 update 频率。

> 应用场景 · Three.js

## 核心概念

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- 阴影四步：`renderer.shadowMap.enabled`、光源 `castShadow`、物体 `castShadow`、地面 `receiveShadow`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

- **Points** 大量顶点用点精灵渲染；**InstancedMesh** 相同几何体批量绘制，降低 draw call。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { Water } from 'three/addons/objects/Water.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x0a1020)
scene.fog = new THREE.Fog(0x0a1020, 80, 1000)

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1600)
camera.position.set(48, 125, 210)
camera.lookAt(0, 100, 0)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)

const stats = new Stats()
stats.showPanel(0)
stats.dom.style.position = 'absolute'
stats.dom.style.top = '20px'
stats.dom.style.right = '20px'
stats.dom.style.left = 'auto'
stats.dom.style.zIndex = '30'
document.body.appendChild(stats.dom)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.target.set(0, 100, 0)
controls.maxPolarAngle = Math.PI / 2.2
controls.enableZoom = true
controls.maxDistance = 900

scene.add(new THREE.AmbientLight(0x40406b))

const dirLight = new THREE.DirectionalLight(0xcceeff, 1.2)
dirLight.position.set(20, 40, 30)
dirLight.castShadow = true
const d = 50
dirLight.shadow.mapSize.width = 1024
dirLight.shadow.mapSize.height = 1024
dirLight.shadow.camera.left = -d
dirLight.shadow.camera.right = d
dirLight.shadow.camera.top = d
dirLight.shadow.camera.bottom = -d
dirLight.shadow.camera.near = 1
dirLight.shadow.camera.far = 80
scene.add(dirLight)

const backLight = new THREE.PointLight(0x446688, 1)
backLight.position.set(-15, 20, -20)
scene.add(backLight)

const nacelleLight = new THREE.PointLight(0x88aadd, 1.0, 400)
nacelleLight.position.set(0, 22, 10)
scene.add(nacelleLight)

const sunDirection = new THREE.Vector3(0.4, 1.0, 0.2).normalize()
const waterNormals = new THREE.TextureLoader().load(
    'https://threejs.org/examples/textures/waternormals.jpg',
    texture => {
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
    }
)
const waterGeometry = new THREE.PlaneGeometry(1400, 1400)
const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals,
    sunDirection,
    sunColor: 0xffffff,
    waterColor: 0x0a3b5f,
    distortionScale: 3.2,
    fog: scene.fog !== undefined
})
water.rotation.x = -Math.PI / 2
water.position.y = -1.2
scene.add(water)

const windTurbine = new THREE.Group()
windTurbine.rotation.y = Math.PI
scene.add(windTurbine)

let rotorGroup = null
let rotorPivot = null
let nacelleModel = null
let rotorPivotYOffset = 0
let rotorWakeScale = 1.0

const rotorSweepReference = 30
const towerHeight = 120
const towerBaseRadius = 5.5
const towerTopRadius = 3.2
const nacelleLength = 22
const nacelleHeight = 7
const nacelleWidth = 8
const hubRadius = 2.2
const hubLength = 4
const bladeLength = 26
const bladeWidth = 3.2
const bladeThickness = 0.7
const bladeCount = 3
const nacelleCenterY = towerHeight + nacelleHeight * 0.5 - 1
const hubCenterY = nacelleCenterY
const baseRotorPivotPosition = new THREE.Vector3(0, hubCenterY, nacelleLength * 0.55 + hubRadius * 0.6)

const updateRotorPivotFromNacelle = () => {
    if (!rotorPivot) return
    rotorPivot.position.set(
        baseRotorPivotPosition.x,
        baseRotorPivotPosition.y + rotorPivotYOffset,
        baseRotorPivotPosition.z
    )
}

// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=windTurbineWake) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
