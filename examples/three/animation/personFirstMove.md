---
title: "第一人称移动 - Three.js 案例讲解"
description: "第一人称移动：Scene / Camera / Renderer 渲染管线、外部模型 / 3D Tiles 加载、ShaderMaterial / RawShaderMaterial 自定义 GLSL（动画效果）"
head:
  - - meta
    - name: keywords
      content: "three.js,animation,personFirstMove,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 第一人称移动

*First Move*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=animation&id=personFirstMove)

![第一人称移动](https://z2586300277.github.io/three-cesium-examples/threeExamples/animation/personFirstMove.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 外部模型 / 3D Tiles 加载
- ShaderMaterial / RawShaderMaterial 自定义 GLSL
- 粒子 / 点云 / 实例化渲染
- 物理引擎集成
- 动画与时间线

## 效果说明

Three.js WebGL 场景，加载外部模型，以自定义 shader 呈现核心视觉效果，粒子或点云特效，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- 异步 Loader 返回 scene 或 tileset；注意 scale、坐标系与 `modelMatrix` 贴地。
- **ShaderMaterial** 自定义 uniforms + vertex/fragment；**RawShaderMaterial** 需手写全部 shader 声明。
- 大量点用 **BufferGeometry + Points** 或 **InstancedMesh** 合批，避免逐 Entity 创建。
- 物理世界步进与 mesh 位置同步。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. Loader 加载资源并加入 scene / entities / primitives
3. 定义 uniforms，在 rAF 中更新并 render
4. 构建几何 attribute 或 instanceMatrix 并 add 到 scene
5. 初始化 physics world 并在 tick 中 step

## 代码要点

```js
// 初始化场景、相机和渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建赛博朋克着色器材质
function createCyberpunkMaterial(originalColor) {

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建赛博朋克着色器材质
function createCyberpunkMaterial(originalColor) {
  const cyberpunkVertexShader = `
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/animation/personFirstMove.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=animation&id=personFirstMove) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[模型拆解动画](/examples/three/animation/modelUnpack)
- 下一篇：[Mesh变换动画](/examples/three/animation/transformAnimate)

> 动画效果 · Three.js · 10/15
