---
title: "轨道控制器 - Three.js 案例讲解"
description: "OrbitControls 阻尼、距离/角度限制、autoRotate 与 lil-gui 全参数调试"
head:
  - - meta
    - name: keywords
      content: "three.js,OrbitControls,轨道控制器,damping,autoRotate"
outline: deep
---

# 轨道控制器

*Orbit Controls*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=basic&id=orbControls)

![轨道控制器](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/orbControls.jpg)

## 你将学到什么

- **OrbitControls** 全部常用配置项含义
- **阻尼 enableDamping** 与每帧 `update()` 的关系
- **距离 / 方位角 / 极角** 限制如何约束观察范围
- `controls.target` 轨道中心点的意义

## 效果说明

贴图平面 + 网格/坐标轴辅助。右侧 GUI 列出 OrbitControls **几乎所有公开参数**，拖动滑块即可感受：

- 左键旋转、滚轮缩放、右键平移（可单独开关）
- 自动旋转、阻尼惯性
- 最近/最远距离、水平/垂直角度上下限
- `zoomToCursor` 以鼠标位置为缩放中心

## 核心概念

### OrbitControls 在做什么？

OrbitControls 不改变物体，而是改变 **相机 position** 和 **观察目标 target**，使相机围绕 `target`（默认原点）做 **轨道运动**：

```
         target (观察中心)
            ●
           /│\
          / │ \
    相机 ●  │  轨道球面
            │
      左键拖拽 → 改变方位角/极角
      滚轮     → 改变与 target 距离
      右键     → 平移 target + 相机
```

```js
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);  // 轨道中心，默认 (0,0,0)
```

### 阻尼 autoRotate

| 属性 | 作用 |
|------|------|
| `enableDamping` | 开启惯性，松手后缓慢停止 |
| `dampingFactor` | 阻尼系数，通常 0.05~0.1 |
| `autoRotate` | 自动绕 target 水平旋转 |
| `autoRotateSpeed` | 自动旋转速度 |

```js
controls.enableDamping = true;
controls.dampingFactor = 0.05;

function animate() {
  controls.update();  // 阻尼和 autoRotate 必须每帧调用
  renderer.render(scene, camera);
}
```

::: warning
开 `enableDamping` 或 `autoRotate` 却不在 rAF 里 `controls.update()` → 阻尼无效、自动旋转卡住。
:::

### 距离与角度限制

| 属性 | 限制内容 |
|------|---------|
| `minDistance` / `maxDistance` | 相机到 target 的最小/最大距离（缩放范围） |
| `minAzimuthAngle` / `maxAzimuthAngle` | 水平绕圈角度（弧度） |
| `minPolarAngle` / `maxPolarAngle` | 垂直角度：0=正上方，π/2=水平，π=正下方 |
| `minTargetRadius` / `maxTargetRadius` | target 移动半径限制（较少用） |

**典型用法：** 建筑漫游常设 `maxPolarAngle = Math.PI / 2`，防止相机钻到地底下。

### 交互开关与速度

```js
controls.enableRotate = true;   // 左键旋转
controls.enableZoom = true;     // 滚轮缩放
controls.enablePan = true;      // 右键平移
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.0;
controls.panSpeed = 1.0;
controls.zoomToCursor = true;   // 滚轮以鼠标指向点为缩放中心
```

### 两种渲染策略

**1. 持续 rAF（本案例，配合阻尼/autoRotate）**

```js
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
```

**2. 按需渲染（静态场景省电）**

```js
controls.addEventListener('change', () => renderer.render(scene, camera));
// 无阻尼时可不开 rAF
```

## 实现步骤

1. Scene + Camera + Renderer
2. `new OrbitControls(camera, renderer.domElement)`
3. rAF 中 `controls.update()` + render
4. GUI 绑定全部 controls 属性，`target.x/y/z` 用 `.listen()` 观察 Orbit 变化
5. GridHelper + AxesHelper 辅助理解轨道

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from "three/addons/libs/lil-gui.module.min.js"

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 1, 4)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

const geomerty = new THREE.PlaneGeometry(1, 1)
const map = new THREE.TextureLoader().load(HOST + 'files/author/KallkaGo.jpg')
const material = new THREE.MeshBasicMaterial({ map, color: 0xf2f2f2, side: THREE.DoubleSide })
const mesh = new THREE.Mesh(geomerty, material)
scene.add(mesh)

scene.add(new THREE.AxesHelper(10), new THREE.GridHelper(10, 10))

const folder = new GUI()
folder.add(controls, 'autoRotate').name('自动旋转')
folder.add(controls, 'autoRotateSpeed').name('自动旋转速度')
folder.add(controls, 'enableDamping').name('阻尼')
folder.add(controls, 'dampingFactor').name('阻尼系数').min(0).max(1)
folder.add(controls, 'minDistance').name('最小距离')
folder.add(controls, 'maxDistance').name('最大距离')
folder.add(controls, 'maxAzimuthAngle', -2 * Math.PI, Math.PI * 2).name('水平旋转上限')
folder.add(controls, 'minAzimuthAngle', -2 * Math.PI, Math.PI * 2).name('水平旋转下限')
folder.add(controls, 'maxPolarAngle', 0, Math.PI).name('垂直旋转上限')
folder.add(controls, 'minPolarAngle', 0, Math.PI).name('垂直旋转下限')
folder.add(controls, 'maxTargetRadius').name('目标移动上限')
folder.add(controls, 'minTargetRadius').name('目标移动下限')
folder.add(controls, 'enablePan').name('平移')
folder.add(controls, 'panSpeed').name('平移速度')
folder.add(controls, 'enableRotate').name('旋转')
folder.add(controls, 'rotateSpeed').name('旋转速度')
folder.add(controls, 'enableZoom').name('缩放')
folder.add(controls, 'zoomSpeed').name('缩放速度')
folder.add(controls, 'zoomToCursor').name('光标为缩放中心')
folder.add(controls.target, 'x').name('目标位置x').listen()
folder.add(controls.target, 'y').name('目标位置y').listen()
folder.add(controls.target, 'z').name('目标位置z').listen()
folder.add({ '重置': () => folder.reset() }, '重置')

animate()

function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}
```

## 小结

- OrbitControls = 绕 **target** 轨道 + 三键交互；生产项目几乎必用
- **阻尼 / 自动旋转** 必须 rAF + `update()`
- 角度/距离限制可防止用户把相机翻到地底或拉得太远
- 上一篇：[相机属性](/examples/three/basic/cameraAttribute) · 下一篇：[创建场景](/examples/three/basic/createScene)

> 基础案例 · Three.js · 6/35
