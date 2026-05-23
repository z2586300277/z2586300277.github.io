---
title: "相机属性 - Three.js 案例讲解"
description: "PerspectiveCamera 的 fov/near/far/zoom、Layers 图层可见性，以及 updateProjectionMatrix"
head:
  - - meta
    - name: keywords
      content: "three.js,相机,PerspectiveCamera,fov,layers,updateProjectionMatrix"
outline: deep
---

# 相机属性

*Camera Attributes*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=basic&id=cameraAttribute)

![相机属性](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/cameraAttribute.jpg)

## 你将学到什么

- **PerspectiveCamera** 各参数对画面的影响（fov、near、far、zoom）
- 修改投影参数后必须调用 **`updateProjectionMatrix()`**
- **Layers 图层系统**：相机与物体分层可见/隐藏
- 用 **lil-gui** 实时调参观察变化

## 效果说明

场景中有一张 **贴图平面**（默认图层 0）和一个 **白色旋转立方体**（图层 1）。右侧 GUI 可实时调节：

- 视角 fov、近/远裁剪面 near/far、zoom
- 相机位置 x/y/z（OrbitControls 拖动时同步变化）
- **切换图层** — 控制相机是否「看见」图层 1 的立方体

配合 GridHelper、AxesHelper 理解相机与物体的空间关系。

## 核心概念

### PerspectiveCamera 构造

```js
new THREE.PerspectiveCamera(fov, aspect, near, far)
```

| 参数 | 含义 | 调大后的效果 |
|------|------|-------------|
| **fov** | 垂直视野角（度） | 广角，透视感强，边缘变形明显 |
| **aspect** | 宽高比 = 画布宽/高 | 通常随 resize 更新，否则画面拉伸 |
| **near** | 近裁剪面 | 过小易 Z-fighting；过大可能裁掉近处物体 |
| **far** | 远裁剪面 | 过小远处消失；过大降低深度缓冲精度 |

```js
camera.fov = 75;
camera.near = 0.1;
camera.far = 1000;
camera.updateProjectionMatrix();  // 必须！否则矩阵不更新
```

::: warning
改 fov / near / far / zoom / aspect 后 **不调用 `updateProjectionMatrix()`**，画面不会变——这是新手最常踩的坑之一。
:::

### zoom 与 film 参数

- **`camera.zoom`**：缩放因子，>1 视野变窄（类似长焦），<1 变广
- **`filmGauge`**：胶片宽度（mm），影响 fov 与 zoom 的换算，一般保持默认
- **`filmOffset`**：胶片水平偏移，模拟 **移轴镜头** 效果（建筑摄影常用）

本案例把以上参数都暴露到 GUI，方便直观感受。

### Layers 图层系统

Three.js 内置 **32 层**（0~31），用于：

- 相机只渲染特定层上的物体
- Raycaster 只拾取特定层
- 后处理 Pass 分层渲染

```js
// 立方体只在图层 1
box1.layers.set(1);   // 等价于：disable 所有层，再 enable(1)

// 相机默认只看图层 0 → 立方体初始不可见
camera.layers.enable(1);   // 或 GUI「切换此图层的状态」
```

**渲染规则：** 物体与相机 **至少共享一层** 才会被绘制。

```
平面 mesh     → layer 0（默认）  → 相机 layer 0 可见 ✅
立方体 box1   → layer 1 only     → 需 camera.layers 含 1 才可见
```

应用场景：UI 3D 标签层、小地图专用层、Bloom 只作用于 layer 1 的物体等。

## 实现步骤

1. 创建 PerspectiveCamera + OrbitControls + rAF
2. 平面（layer 0）+ 立方体（`layers.set(1)`）+ 网格/坐标轴辅助
3. GUI 绑定 camera 投影参数，`onChange → updateProjectionMatrix`
4. GUI 绑定 `camera.layers.toggle(1)` 切换立方体可见性
5. `camera.position` 用 `.listen()` 只读监听（由 OrbitControls 驱动）

## 代码要点

### 投影参数 GUI

```js
const onChange = () => camera.updateProjectionMatrix();

folder.add(camera, 'fov').min(0).name('视角').onChange(onChange);
folder.add(camera, 'near').min(0.001).name('近平面').onChange(onChange);
folder.add(camera, 'far').min(0).name('远平面').onChange(onChange);
folder.add(camera, 'zoom').min(0).name('缩放').onChange(onChange);
```

### 图层切换

```js
box1.layers.set(1);

folder.add({ '切换此图层的状态': () => camera.layers.toggle(1) }, '切换此图层的状态');
```

点击后立方体在 **显示/隐藏** 间切换，平面始终可见。

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
controls.enableDamping = true

const geomerty = new THREE.PlaneGeometry(1, 1)
const map = new THREE.TextureLoader().load(HOST + 'files/author/flowers-10.jpg')
const material = new THREE.MeshBasicMaterial({ map, color: 0x737373, side: THREE.DoubleSide })
const mesh = new THREE.Mesh(geomerty, material)
scene.add(mesh)

const box1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xffffff }))
box1.position.set(1, 1, 0)
box1.layers.set(1)
scene.add(box1)

scene.add(new THREE.AxesHelper(10), new THREE.GridHelper(10, 10))

const folder = new GUI()
const onChange = () => camera.updateProjectionMatrix()

folder.add(camera.layers, 'mask').name('图层').onChange(onChange).listen()
folder.add({ '切换此图层的状态': () => camera.layers.toggle(1) }, '切换此图层的状态')
folder.add(camera, 'fov').min(0).name('视角').onChange(onChange)
folder.add(camera, 'near').min(0.001).name('近平面').onChange(onChange)
folder.add(camera, 'far').min(0).name('远平面').onChange(onChange)
folder.add(camera, 'zoom').min(0).name('缩放').onChange(onChange)
folder.add(camera, 'filmOffset').name('胶片偏移').onChange(onChange)
folder.add(camera, 'filmGauge').name('胶片尺寸').onChange(onChange)
folder.add(camera.position, 'x').name('相机位置x').listen()
folder.add(camera.position, 'y').name('相机位置y').listen()
folder.add(camera.position, 'z').name('相机位置z').listen()
folder.add({ fn: () => folder.reset() }, 'fn').name('重置')

animate()

function animate() {
  requestAnimationFrame(animate)
  box1.rotation.y += 0.01
  controls.update()
  renderer.render(scene, camera)
}
```

## 小结

- 透视相机 = **fov + aspect + near + far** 定义视锥体，改参必 **updateProjectionMatrix**
- **Layers** 让同一 Scene 内物体分组可见，相机与物体都要设对 layer
- 上一篇：[天空盒](/examples/three/basic/skyAndEnv) · 下一篇：[轨道控制器](/examples/three/basic/orbControls)

> 基础案例 · Three.js · 5/35
