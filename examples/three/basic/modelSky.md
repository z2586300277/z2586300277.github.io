---
title: "模型天空 - Three.js 案例讲解"
description: "glTF 天空穹顶模型加载，setAnimationLoop 驱动天空缓慢旋转"
head:
  - - meta
    - name: keywords
      content: "three.js,模型天空,glTF,天空穹顶,gltfSky"
outline: deep
---

# 模型天空

*Model Sky*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=basic&id=modelSky)

![模型天空](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/modelSky.jpg)

## 你将学到什么

- 用 **glTF 天空穹顶模型** 代替 CubeTexture 六面贴图
- 天空模型与 [天空盒](/examples/three/basic/skyAndEnv) 方案的对比
- `renderer.setAnimationLoop` 与 `requestAnimationFrame` 的配合

## 效果说明

加载 `gltfSky/scene.gltf` —— 一个 **半球/穹顶状** 的天空模型，整体 **缓慢绕 Y 轴旋转**，产生云卷云舒的动态天景。地面有 GridHelper 辅助定位，相机 OrbitControls 环绕观察。

## 核心概念

### 两种天空实现方式

| 方式 | 本案例 | [天空盒 skyAndEnv](/examples/three/basic/skyAndEnv) |
|------|--------|-----------------------------------------------------|
| 实现 | glTF 穹顶 mesh | CubeTexture 六面 PNG |
| 背景 | 真实几何体在场景中 | `scene.background` 无穷远 |
| 动画 | 可旋转整个天空模型 | 背景随相机转，本身不转 |
| 优点 | 可带复杂几何/动画 | 实现简单、性能稳定 |
| 缺点 | 占 draw call，需够大 | 仅静态贴图 |

模型天空适合：**动态云层、 stylized 天空、需要与场景光照统一** 的项目。

### glTF 天空模型注意事项

1. **尺度**：天空模型要足够大（或相机在模型内部），否则能看到穹顶边缘
2. **位置**：通常与场景中心对齐，相机在穹顶内部
3. **深度**：常配合 `material.depthWrite = false` 或渲染顺序，避免遮挡问题（本 glTF 资源已处理）
4. **旋转**：本案例 `gltf.scene.rotation.y += 0.005` 制造天空流动感

### setAnimationLoop 与 rAF

```js
// 主循环：OrbitControls + 渲染
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// 加载完成后：额外注册 setAnimationLoop 只负责转天空
renderer.setAnimationLoop(() => {
  gltf.scene.rotation.y += 0.005;
});
```

本案例 **同时存在** 两个循环：

- `animate()` 的 rAF → 负责 **controls + render**
- `setAnimationLoop` → 每帧 **只改天空 rotation**

::: tip 更清晰的写法
合并为一个循环更规范：

```js
function animate() {
  if (sky) sky.rotation.y += 0.005;
  controls.update();
  renderer.render(scene, camera);
}
```
:::

## 实现步骤

1. Scene / Camera / Renderer / OrbitControls + rAF
2. GridHelper + AxesHelper
3. `GLTFLoader` 加载 `gltfSky/scene.gltf` → `scene.add(gltf.scene)`
4. `setAnimationLoop` 或合并进 animate 旋转天空

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 100)
camera.position.set(0, 5, 20)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setClearColor(0xffffff, 1)
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

scene.add(new THREE.GridHelper(100, 20))
scene.add(new THREE.AxesHelper(1000))

new GLTFLoader().load(FILE_HOST + "models/glb/gltfSky/scene.gltf", (gltf) => {
    scene.add(gltf.scene)
    renderer.setAnimationLoop(() => gltf.scene.rotation.y += 0.005)
})

animate()

function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
}

window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()
}
```

## 小结

- 模型天空 = **大尺度 glTF 穹顶** + 可选旋转动画
- 静态 HDR/PNG 天空优先 [天空盒](/examples/three/basic/skyAndEnv)；复杂动态天用本方案
- 上一篇：[创建场景](/examples/three/basic/createScene) · 下一篇：[场景雾化](/examples/three/basic/sceneFog)

> 基础案例 · Three.js · 7/35
