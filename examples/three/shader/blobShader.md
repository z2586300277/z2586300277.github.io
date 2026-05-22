---
title: "一团揉动 - Three.js 案例讲解"
description: "一团揉动：Scene / Camera / Renderer 渲染管线、相机交互控制器、ShaderMaterial / RawShaderMaterial 自定义 GLSL（着色器）"
head:
  - - meta
    - name: keywords
      content: "three.js,shader,blobShader,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 一团揉动

*Blob Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=blobShader)

![一团揉动](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/blobShader.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- ShaderMaterial / RawShaderMaterial 自定义 GLSL
- 粒子 / 点云 / 实例化渲染
- Cesium Primitive 层海量渲染
- 动画与时间线

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，粒子或点云特效，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- **ShaderMaterial** 自定义 uniforms + vertex/fragment；**RawShaderMaterial** 需手写全部 shader 声明。
- 大量点用 **BufferGeometry + Points** 或 **InstancedMesh** 合批，避免逐 Entity 创建。
- **BillboardCollection / Primitive** 合批渲染，适合万级点面。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. 定义 uniforms，在 rAF 中更新并 render
4. 构建几何 attribute 或 instanceMatrix 并 add 到 scene
5. scene.primitives.add(collection)

## 代码要点

```js
var _primitive;
var shapeGroup = new THREE.Group();
var start = Date.now();

function createWorld() {
  _width = window.innerWidth;
  _height= window.innerHeight;
  
  scene = new THREE.Scene();

  
  scene = new THREE.Scene();
  scene.background = new THREE.Color(Theme.secundary);
  
  camera = new THREE.PerspectiveCamera(35, _width/_height, 1, 1000);
  camera.position.set(0,10,26);
  
  renderer = new THREE.WebGLRenderer({antialias:false, alpha:false});
  renderer.setSize(_width, _height);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(Theme.secundary);
  
  camera = new THREE.PerspectiveCamera(35, _width/_height, 1, 1000);
  camera.position.set(0,10,26);
  
  renderer = new THREE.WebGLRenderer({antialias:false, alpha:false});
  renderer.setSize(_width, _height);
  renderer.shadowMap.enabled = true;
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/shader/blobShader.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=blobShader) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[火球效果](/examples/three/shader/fireball)
- 下一篇：[旋转的圆](/examples/three/shader/circleRotate)

> 着色器 · Three.js · 60/89
