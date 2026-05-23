---
title: "曲线动画 - Three.js 案例讲解"
description: "曲线动画：Scene / Camera / Renderer 渲染管线、相机交互控制器、外部模型 / 3D Tiles 加载（动画效果）"
head:
  - - meta
    - name: keywords
      content: "three.js,animation,curveAnimate,BufferGeometry"
outline: deep
---

# 曲线动画

*Curve Animate*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=animation&id=curveAnimate)

![曲线动画](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/curveAnimate.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- 外部模型 / 3D Tiles 加载
- 粒子 / 点云 / 实例化渲染

## 效果说明

Three.js WebGL 场景，加载外部模型，粒子或点云特效，技术点：BufferGeometry。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- 异步 Loader 返回 scene 或 tileset；注意 scale、坐标系与 `modelMatrix` 贴地。
- 大量点用 **BufferGeometry + Points** 或 **InstancedMesh** 合批，避免逐 Entity 创建。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. Loader 加载资源并加入 scene / entities / primitives
4. 构建几何 attribute 或 instanceMatrix 并 add 到 scene

## 代码要点

```js
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(30, 30, 30)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })



const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(30, 30, 30)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)



const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/basic/curveAnimate.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=animation&id=curveAnimate) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[Mesh变换动画](/examples/three/animation/transformAnimate)
- 下一篇：[下钻动画](/examples/three/animation/downRotate)

> 动画效果 · Three.js · 12/15
