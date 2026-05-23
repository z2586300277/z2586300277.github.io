---
title: "终末地-据点围栏 - Three.js 案例讲解"
description: "终末地-据点围栏：Scene / Camera / Renderer 渲染管线、相机交互控制器、ShaderMaterial / RawShaderMaterial 自定义 GLSL（游戏复刻）"
head:
  - - meta
    - name: keywords
      content: "three.js,game,zmdFence,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 终末地-据点围栏

*EndField Fence*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=game&id=zmdFence)

![终末地-据点围栏](https://z2586300277.github.io/three-cesium-examples/threeExamples/game/zmdFence.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- ShaderMaterial / RawShaderMaterial 自定义 GLSL
- GUI 参数调试面板

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- **ShaderMaterial** 自定义 uniforms + vertex/fragment；**RawShaderMaterial** 需手写全部 shader 声明。
- dat.GUI / lil-gui 绑定 uniform 或配置对象实时调参。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. 定义 uniforms，在 rAF 中更新并 render
4. gui.add 绑定可调参数

## 代码要点

```js
const params = {
      range: new THREE.Vector3().copy(opts.range),
      segment: opts.segment ?? 1,
      width: opts.width ?? 0.7,
      color: new THREE.Color(opts.color ?? 0xffff00),
      useSimp: opts.useSimp ?? true,
    };
    this.params = params;


      width: opts.width ?? 0.7,
      color: new THREE.Color(opts.color ?? 0xffff00),
      useSimp: opts.useSimp ?? true,
    };
    this.params = params;

    // 通用 uniform 访问器，统一控制参数
    const commonUniforms = {
      U_range: {

    // X轴向分段材质
    const part_0_mat_x = new THREE.ShaderMaterial({
      uniforms: {
        ...commonUniforms,
        U_segment: {
          get value() {
            return params.segment * params.range.x;
          },
        },
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/game/zmdFence.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=game&id=zmdFence) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[人物虚化](/examples/three/game/characterBlur)


> 游戏复刻 · Three.js · 3/3
