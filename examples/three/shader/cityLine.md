---
title: "城市线条 - Three.js 案例讲解"
description: "城市线条：Scene / Camera / Renderer 渲染管线、相机交互控制器、外部模型 / 3D Tiles 加载（着色器）"
head:
  - - meta
    - name: keywords
      content: "three.js,shader,cityLine,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 城市线条

*City Line*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=cityLine)

![城市线条](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/cityLine.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- 外部模型 / 3D Tiles 加载
- ShaderMaterial / RawShaderMaterial 自定义 GLSL

## 效果说明

Three.js WebGL 场景，加载外部模型，以自定义 shader 呈现核心视觉效果，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- 异步 Loader 返回 scene 或 tileset；注意 scale、坐标系与 `modelMatrix` 贴地。
- **ShaderMaterial** 自定义 uniforms + vertex/fragment；**RawShaderMaterial** 需手写全部 shader 声明。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. Loader 加载资源并加入 scene / entities / primitives
4. 定义 uniforms，在 rAF 中更新并 render

## 代码要点

```js
this.fbxLoader = new FBXLoader();
        this.group = new THREE.Group();
        this.clock = new THREE.Clock()
        this.surroundLineMaterial = null;// 定义包围线材质属性
        this.time = { value: 0 };
        this.startTime = { value: 0 };
        this.startLength = { value: 2 }
        this.isStart = false;


        this.group = new THREE.Group();
        this.clock = new THREE.Clock()
        this.surroundLineMaterial = null;// 定义包围线材质属性
        this.time = { value: 0 };
        this.startTime = { value: 0 };
        this.startLength = { value: 2 }
        this.isStart = false;

        this.fbxLoader.load(FILE_HOST + 'models/fbx/shanghai.FBX', (group) => {
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/shader/cityLine.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=cityLine) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[平面扫描](/examples/three/shader/planeScan)
- 下一篇：[扩散圆墙](/examples/three/shader/wallShader)

> 着色器 · Three.js · 26/89
