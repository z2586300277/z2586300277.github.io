---
title: "终末地-登录入口 - Three.js 案例讲解"
description: "终末地-登录入口：Scene / Camera / Renderer 渲染管线、相机交互控制器、外部模型 / 3D Tiles 加载（游戏复刻）"
head:
  - - meta
    - name: keywords
      content: "three.js,game,zmdIndex,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 终末地-登录入口

*EndField Index*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=game&id=zmdIndex)

![终末地-登录入口](https://z2586300277.github.io/three-cesium-examples/threeExamples/game/zmdIndex.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- 外部模型 / 3D Tiles 加载
- ShaderMaterial / RawShaderMaterial 自定义 GLSL
- EffectComposer 后处理管线
- 粒子 / 点云 / 实例化渲染

## 效果说明

Three.js WebGL 场景，加载外部模型，以自定义 shader 呈现核心视觉效果，粒子或点云特效，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- 异步 Loader 返回 scene 或 tileset；注意 scale、坐标系与 `modelMatrix` 贴地。
- **ShaderMaterial** 自定义 uniforms + vertex/fragment；**RawShaderMaterial** 需手写全部 shader 声明。
- **EffectComposer** 多 Pass 链式渲染：RenderPass → 特效 Pass → 输出屏幕。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. Loader 加载资源并加入 scene / entities / primitives
4. 定义 uniforms，在 rAF 中更新并 render
5. composer.addPass 串联后处理

## 代码要点

```js
const rt_model = new THREE.RenderTarget();
rt_model.depthTexture = new THREE.DepthTexture();
const rt_scene = new THREE.RenderTarget();
rt_scene.depthTexture = new THREE.DepthTexture();

// 模型材质，渲染深度用做遮罩图
// 骨骼绑定具体参考 Three.js 着色器 skin
const model_mat = new THREE.ShaderMaterial({

const rt_model = new THREE.RenderTarget();
rt_model.depthTexture = new THREE.DepthTexture();
const rt_scene = new THREE.RenderTarget();
rt_scene.depthTexture = new THREE.DepthTexture();

// 模型材质，渲染深度用做遮罩图
// 骨骼绑定具体参考 Three.js 着色器 skin
const model_mat = new THREE.ShaderMaterial({
  vertexShader: /* glsl */ `

rt_model.depthTexture = new THREE.DepthTexture();
const rt_scene = new THREE.RenderTarget();
rt_scene.depthTexture = new THREE.DepthTexture();

// 模型材质，渲染深度用做遮罩图
// 骨骼绑定具体参考 Three.js 着色器 skin
const model_mat = new THREE.ShaderMaterial({
  vertexShader: /* glsl */ `
    uniform mat4 bindMatrix;
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/game/zmdIndex.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=game&id=zmdIndex) 运行，再对照源码修改 uniform / 参数加深理解


- 下一篇：[人物虚化](/examples/three/game/characterBlur)

> 游戏复刻 · Three.js · 1/3
