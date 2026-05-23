---
title: "图片粒子 - Three.js 案例讲解"
description: "图片粒子：Scene / Camera / Renderer 渲染管线、相机交互控制器、ShaderMaterial / RawShaderMaterial 自定义 GLSL（粒子）"
head:
  - - meta
    - name: keywords
      content: "three.js,particle,imgParticle,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 图片粒子

*Image Particle*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=particle&id=imgParticle)

![图片粒子](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/imgParticle.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- ShaderMaterial / RawShaderMaterial 自定义 GLSL
- 粒子 / 点云 / 实例化渲染

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，粒子或点云特效，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- **ShaderMaterial** 自定义 uniforms + vertex/fragment；**RawShaderMaterial** 需手写全部 shader 声明。
- 大量点用 **BufferGeometry + Points** 或 **InstancedMesh** 合批，避免逐 Entity 创建。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. 定义 uniforms，在 rAF 中更新并 render
4. 构建几何 attribute 或 instanceMatrix 并 add 到 scene

## 代码要点

```js
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })



const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)



const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/particle/imgParticle.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=particle&id=imgParticle) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[雪花](/examples/three/particle/snowParticle)
- 下一篇：[粒子火焰](/examples/three/particle/fireParticles)

> 粒子 · Three.js · 20/27
