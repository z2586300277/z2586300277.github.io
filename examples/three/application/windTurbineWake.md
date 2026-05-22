---
title: "风力涡轮机尾迹 - Three.js 案例讲解"
description: "风力涡轮机尾迹：Scene / Camera / Renderer 渲染管线、相机交互控制器、粒子 / 点云 / 实例化渲染（应用场景）"
head:
  - - meta
    - name: keywords
      content: "three.js,application,windTurbineWake,uniform 驱动,BufferGeometry,Canvas 纹理"
outline: deep
---

# 风力涡轮机尾迹

*Wind Turbine Wake*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=windTurbineWake)

![风力涡轮机尾迹](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/windTurbineWake.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- 粒子 / 点云 / 实例化渲染
- Cesium 环境 / 水体 / 地形

## 效果说明

Three.js WebGL 场景，粒子或点云特效，技术点：uniform 驱动、BufferGeometry、Canvas 纹理。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- 大量点用 **BufferGeometry + Points** 或 **InstancedMesh** 合批，避免逐 Entity 创建。
- SkyBox 六面图换天空；Water 用法线贴图 + time；地形需 depthTestAgainstTerrain。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. 构建几何 attribute 或 instanceMatrix 并 add 到 scene
4. 配置 scene.skyBox / Water / globe 参数

## 代码要点

```js
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x0a1020)
scene.fog = new THREE.Fog(0x0a1020, 80, 1000)

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1600)
camera.position.set(48, 125, 210)
camera.lookAt(0, 100, 0)


const scene = new THREE.Scene()
scene.background = new THREE.Color(0x0a1020)
scene.fog = new THREE.Fog(0x0a1020, 80, 1000)

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1600)
camera.position.set(48, 125, 210)
camera.lookAt(0, 100, 0)

const renderer = new THREE.WebGLRenderer({ antialias: true })
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/application/windTurbineWake.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=windTurbineWake) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[点云第一人称漫游,碰撞检测](/examples/three/application/pointCloudFpsOctree)


> 应用场景 · Three.js · 68/68
