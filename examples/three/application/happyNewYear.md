---
title: "新年快乐 - Three.js 案例讲解"
description: "新年快乐：Scene / Camera / Renderer 渲染管线、相机交互控制器、ShaderMaterial / RawShaderMaterial 自定义 GLSL（应用场景）"
head:
  - - meta
    - name: keywords
      content: "three.js,application,happyNewYear,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 新年快乐

*Happy Year*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=happyNewYear)

![新年快乐](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/happyNewYear.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- ShaderMaterial / RawShaderMaterial 自定义 GLSL
- onBeforeCompile 修改内置材质 shader
- 粒子 / 点云 / 实例化渲染

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，粒子或点云特效，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- **ShaderMaterial** 自定义 uniforms + vertex/fragment；**RawShaderMaterial** 需手写全部 shader 声明。
- 替换 `#include <begin_vertex>` 等 chunk 注入特效，适合 PBR 材质叠加大屏效果。
- 大量点用 **BufferGeometry + Points** 或 **InstancedMesh** 合批，避免逐 Entity 创建。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. 定义 uniforms，在 rAF 中更新并 render
4. material.onBeforeCompile 注入 GLSL 与 uniform
5. 构建几何 attribute 或 instanceMatrix 并 add 到 scene

## 代码要点

```js
super(
            new THREE.SphereGeometry(500, 72, 36),
            new THREE.ShaderMaterial({
                side: THREE.BackSide,
                vertexShader: `
          varying vec3 vPos;
          void main(){
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);

            new THREE.SphereGeometry(500, 72, 36),
            new THREE.ShaderMaterial({
                side: THREE.BackSide,
                vertexShader: `
          varying vec3 vPos;
          void main(){
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
          }
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/application/happyNewYear.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=happyNewYear) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[扩散半球](/examples/three/application/3DCircle)
- 下一篇：[风吹动画](/examples/three/application/windMove)

> 应用场景 · Three.js · 34/68
