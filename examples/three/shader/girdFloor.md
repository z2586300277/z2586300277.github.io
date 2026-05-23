---
title: "网格地板 - Three.js 案例讲解"
description: "网格地板：Scene / Camera / Renderer 渲染管线、相机交互控制器、ShaderMaterial / RawShaderMaterial 自定义 GLSL（着色器）"
head:
  - - meta
    - name: keywords
      content: "three.js,shader,girdFloor,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 网格地板

*Gird Floor*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=shader&id=girdFloor)

![网格地板](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/girdFloor.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- ShaderMaterial / RawShaderMaterial 自定义 GLSL

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- **ShaderMaterial** 自定义 uniforms + vertex/fragment；**RawShaderMaterial** 需手写全部 shader 声明。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. 定义 uniforms，在 rAF 中更新并 render

## 代码要点

```js
// Scene
const scene = new THREE.Scene()

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(10, 10, 32, 32)


// Geometry
const geometry = new THREE.PlaneGeometry(10, 10, 32, 32)

// Material
const material = new THREE.ShaderMaterial({
    vertexShader: baseVertexShader,
    fragmentShader: baseFragmentShader,
    side: THREE.DoubleSide,
    transparent: true,

// Material
const material = new THREE.ShaderMaterial({
    vertexShader: baseVertexShader,
    fragmentShader: baseFragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
    uniforms: {
        // Floor
        uFloorColor: { value: new THREE.Color(debugObject.floorColor) },
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/shader/girdFloor.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=shader&id=girdFloor) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[能量球](/examples/three/shader/energyBallShader)
- 下一篇：[全息投影](/examples/three/shader/hologram)

> 着色器 · Three.js · 81/89
