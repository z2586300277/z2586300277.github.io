---
title: "科技风地面 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,科技风地面"
outline: deep
---
# 科技风地面

*TachnologyFloor*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=tachnologyFloor)

![科技风地面](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/tachnologyFloor.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 点云 / 粒子 / 实例化渲染
- GSAP / anime.js 属性动画
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **Points** 大量顶点用点精灵渲染；**InstancedMesh** 相同几何体批量绘制，降低 draw call。

- 时间线库驱动 position/rotation/uniform，与 rAF 渲染循环配合。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import gsap from 'gsap'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(13, 12, 40)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

renderer.setClearColor(0x102736, 1) // 设置背景色

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true // 启用阻尼

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

scene.fog = new THREE.Fog(0x102736, 1, 50)

const opt = {
    gridSize: 50,
    gridDivision: 20,
    gridColor: 0x1b4b70, // 深蓝
    shapeSize: 0.5,
    shapeColor: 0x2a5f8a, // 深蓝
    // shapeColor: 0xf44336, // 红色
    pointSize: 0.1,
    pointColor: 0x154d7d, // 深蓝
    diffuse: true,
    diffuseSpeed: 10,
    diffuseWidth: 10,
    pointLayout: { row: 200, col: 200 },
    diffuseColor: 0x2e8bd9, // 蓝色
    pointBlending: THREE.NormalBlending,
    // diffuseDir: 1, // 扩散方向：0-圆形扩散，1-横向扩散
}

const oceanTexture = new THREE.TextureLoader().load(FILE_HOST + "/images/bluebg.png")
const floorGeometry = new THREE.PlaneGeometry(20, 20)
oceanTexture.colorSpace = THREE.SRGBColorSpace // 设置颜色空间
oceanTexture.wrapS = THREE.RepeatWrapping // 水平方向重复纹理
oceanTexture.wrapT = THREE.RepeatWrapping // 垂直方向重复纹理
oceanTexture.repeat.set(1, 1) // 设置纹理重复次数
const floorMaterial = new THREE.MeshBasicMaterial({
    map: oceanTexture,
    opacity: 1,
})
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotateX(-Math.PI / 2)
floor.position.set(0, -0.7, 0)
scene.add(floor)

// grid
const gridGroup = new THREE.Group()
gridGroup.name = 'Grid'

const gridHelper = new THREE.GridHelper(opt.gridSize, opt.gridDivision, opt.gridColor, opt.gridColor)

const cellSize = opt.gridSize / opt.gridDivision // 每个网格的大小
const halfGridSize = opt.gridSize / 2 // 网格的一半大小
const shapeMaterial = new THREE.MeshBasicMaterial({
    color: opt.shapeColor,
    side: THREE.DoubleSide,
})
// 创建加号几何体数组
const geometries = []

for (let row = 0; row < opt.gridDivision + 1; row++) {
    for (let col = 0; col < opt.gridDivision + 1; col++) {
        const lineWidth = opt.shapeSize / 6 / 3 // 宽
        const armLength = opt.shapeSize / 3 // 长

        // 加号形状的顶点
        const vertices = [
            new THREE.Vector2(-armLength, -lineWidth), // 外左下
            new THREE.Vector2(-lineWidth, -lineWidth), // 内左下
            new THREE.Vector2(-lineWidth, -armLength),
            new THREE.Vector2(lineWidth, -armLength),
            new THREE.Vector2(lineWidth, -lineWidth),
            new THREE.Vector2(armLength, -lineWidth),
            new THREE.Vector2(armLength, lineWidth),
            new THREE.Vector2(lineWidth, lineWidth),
            new THREE.Vector2(lineWidth, armLength),
            new THREE.Vector2(-lineWidth, armLength),
            new THREE.Vector2(-lineWidth, lineWidth),
            new THREE.Vector2(-armLength, lineWidth),
        ]
        const shape = new THREE.Shape(vertices)
        const plusGeometry = new THREE.ShapeGeometry(shape, 24)
        plusGeometry.translate(
            -halfGridSize + row * cellSize,
            -halfGridSize + col * cellSize,
            0,
        )
        geometries.push(plusGeometry)
    }
}
const mergedGeometry = mergeGeometries(geometries)
const shapeMesh = new THREE.Mesh(mergedGeometry, shapeMaterial)

shapeMesh.renderOrder = -1
shapeMesh.rotateX(-Math.PI / 2)
shapeMesh.position.y += 0.01
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=tachnologyFloor) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
