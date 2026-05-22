---
title: "黑洞 - Three.js 案例讲解"
description: "黑洞：相机交互控制器、ShaderMaterial / RawShaderMaterial 自定义 GLSL、EffectComposer 后处理管线（着色器）"
head:
  - - meta
    - name: keywords
      content: "three.js,shader,blackhole,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 黑洞

*Black Hole*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=blackhole)

![黑洞](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/blackhole.jpg)

## 你将学到什么

- 相机交互控制器
- ShaderMaterial / RawShaderMaterial 自定义 GLSL
- EffectComposer 后处理管线
- GUI 参数调试面板

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- **ShaderMaterial** 自定义 uniforms + vertex/fragment；**RawShaderMaterial** 需手写全部 shader 声明。
- **EffectComposer** 多 Pass 链式渲染：RenderPass → 特效 Pass → 输出屏幕。
- dat.GUI / lil-gui 绑定 uniform 或配置对象实时调参。

## 实现步骤

1. 创建 OrbitControls 并处理 resize
2. 定义 uniforms，在 rAF 中更新并 render
3. composer.addPass 串联后处理
4. gui.add 绑定可调参数

## 代码要点

```js
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });

const camera = new THREE.PerspectiveCamera(90, 1, 0.1, 1000);
camera.position.set(0, 3, 10);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 25;


const camera = new THREE.PerspectiveCamera(90, 1, 0.1, 1000);
camera.position.set(0, 3, 10);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 25;

const material = new THREE.RawShaderMaterial({


const material = new THREE.RawShaderMaterial({
  glslVersion: THREE.GLSL3,
  uniforms: {
    // 黑洞参数
    hole: {
      value: {
        // 位置
        pos: new THREE.Vector3(0, 0, 0),
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/shader/blackhole.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=blackhole) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[冰面](/examples/three/shader/iceFloor)
- 下一篇：[等高线](/examples/three/shader/contourLine)

> 着色器 · Three.js · 88/89
