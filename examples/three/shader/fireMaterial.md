---
title: "火焰材质 - Three.js 案例讲解"
description: "火焰材质：Scene / Camera / Renderer 渲染管线、相机交互控制器、ShaderMaterial / RawShaderMaterial 自定义 GLSL（着色器）"
head:
  - - meta
    - name: keywords
      content: "three.js,shader,fireMaterial,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 火焰材质

*Fire Material*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=fireMaterial)

![火焰材质](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/fireMaterial.jpg)

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
// 保持FireMaterial类不变
class FireMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      defines: { ITERATIONS: '10', OCTIVES: '3' },
      uniforms: {
        fireTex: { type: 't', value: null },
        color: { type: 'c', value: null },
        time: { type: 'f', value: 0.0 },

        scale: { type: 'v3', value: null },
        noiseScale: { type: 'v4', value: new THREE.Vector4(1, 2, 1, 0.3) },
        magnitude: { type: 'f', value: 2.5 },
        lacunarity: { type: 'f', value: 3.0 },
        gain: { type: 'f', value: 0.6 }
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/shader/fireMaterial.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=fireMaterial) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[燃烧烟雾](/examples/three/shader/smoke)
- 下一篇：[WiFi](/examples/three/shader/wifiShader)

> 着色器 · Three.js · 84/89
