---
title: "人物虚化 - Three.js 案例讲解"
description: "人物虚化：Scene / Camera / Renderer 渲染管线、相机交互控制器、外部模型 / 3D Tiles 加载（游戏复刻）"
head:
  - - meta
    - name: keywords
      content: "three.js,game,characterBlur,片元着色器,uniform 驱动"
outline: deep
---

# 人物虚化

*人物虚化*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=game&id=characterBlur)

![人物虚化](https://z2586300277.github.io/three-cesium-examples/threeExamples/game/characterBlur.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- 外部模型 / 3D Tiles 加载
- onBeforeCompile 修改内置材质 shader
- 动画与时间线
- GUI 参数调试面板

## 效果说明

Three.js WebGL 场景，加载外部模型，以自定义 shader 呈现核心视觉效果，技术点：片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- 异步 Loader 返回 scene 或 tileset；注意 scale、坐标系与 `modelMatrix` 贴地。
- 替换 `#include <begin_vertex>` 等 chunk 注入特效，适合 PBR 材质叠加大屏效果。
- **AnimationMixer** 播 glTF 动画；**GSAP** 补间任意属性。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. Loader 加载资源并加入 scene / entities / primitives
4. material.onBeforeCompile 注入 GLSL 与 uniform
5. mixer.update(delta) 或 gsap.to 驱动属性

## 代码要点

```js
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setClearColor(0x333333, 0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

const scene = new THREE.Scene();

const loader_fbx = new FBXLoader();


const scene = new THREE.Scene();

const loader_fbx = new FBXLoader();

const modelMaterialUniforms = {
  blur: 0.85,
  blockSize: 12.0,
};

    const m = obj.material;
    m.onBeforeCompile = (shader) => {
      shader.uniforms.blur = {
        get value() {
          return modelMaterialUniforms.blur;
        },
      };
      shader.uniforms.blockSize = {
        get value() {
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/game/characterBlur.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=game&id=characterBlur) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[终末地-登录入口](/examples/three/game/zmdIndex)
- 下一篇：[终末地-据点围栏](/examples/three/game/zmdFence)

> 游戏复刻 · Three.js · 2/3
