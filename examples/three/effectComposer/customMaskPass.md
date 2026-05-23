---
title: "自定义遮罩通道 - Three.js 案例讲解"
description: "自定义遮罩通道：Scene / Camera / Renderer 渲染管线、相机交互控制器、EffectComposer 后处理管线（后期处理）"
head:
  - - meta
    - name: keywords
      content: "three.js,effectComposer,customMaskPass,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 自定义遮罩通道

*Custom Mask*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=effectComposer&id=customMaskPass)

![自定义遮罩通道](https://z2586300277.github.io/three-cesium-examples/threeExamples/effectComposer/customMaskPass.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- EffectComposer 后处理管线

## 效果说明

Three.js WebGL 场景，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- **EffectComposer** 多 Pass 链式渲染：RenderPass → 特效 Pass → 输出屏幕。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. composer.addPass 串联后处理

## 代码要点

```js
intensity: { value: 2.0 },
                maskColor: { value: new THREE.Color(1, 1, 1) },
                R: { value: 0.1 },
                sr: { value: 1.2 }
            },

            vertexShader: `
                varying vec2 vUv;
                void main() {


            vertexShader: `
                varying vec2 vUv;
                void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }
            `,



            fragmentShader: `
                uniform float opacity;
                uniform float intensity;
                uniform sampler2D tDiffuse;
                uniform vec3 maskColor;
                uniform float R;
                uniform float sr;
                varying vec2 vUv;
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/effectComposer/customMaskPass.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=effectComposer&id=customMaskPass) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[辉光-postprocessing](/examples/three/effectComposer/selectBloomPass)
- 下一篇：[UV图像变换](/examples/three/effectComposer/uvTransformation)

> 后期处理 · Three.js · 2/10
