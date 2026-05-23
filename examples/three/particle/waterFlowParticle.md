---
title: "喷泉水流 - Three.js 案例讲解"
description: "喷泉水流：Scene / Camera / Renderer 渲染管线、相机交互控制器、ShaderMaterial / RawShaderMaterial 自定义 GLSL（粒子）"
head:
  - - meta
    - name: keywords
      content: "three.js,particle,waterFlowParticle,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 喷泉水流

*Water Flow*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=particle&id=waterFlowParticle)

![喷泉水流](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/waterFlowParticle.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- ShaderMaterial / RawShaderMaterial 自定义 GLSL
- 粒子 / 点云 / 实例化渲染
- GUI 参数调试面板

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，粒子或点云特效，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- **ShaderMaterial** 自定义 uniforms + vertex/fragment；**RawShaderMaterial** 需手写全部 shader 声明。
- 大量点用 **BufferGeometry + Points** 或 **InstancedMesh** 合批，避免逐 Entity 创建。
- dat.GUI / lil-gui 绑定 uniform 或配置对象实时调参。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. 定义 uniforms，在 rAF 中更新并 render
4. 构建几何 attribute 或 instanceMatrix 并 add 到 scene
5. gui.add 绑定可调参数

## 代码要点

```js
const box = document.getElementById('box')
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1a1a2e)

const camera = new THREE.PerspectiveCamera(60, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 5, 12)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(box.clientWidth, box.clientHeight)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1a1a2e)

const camera = new THREE.PerspectiveCamera(60, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 5, 12)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/particle/waterFlowParticle.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=particle&id=waterFlowParticle) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[水流粒子](/examples/three/particle/waterLeakage)
- 下一篇：[蒸汽粒子](/examples/three/particle/steamParticle)

> 粒子 · Three.js · 26/27
