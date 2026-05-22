---
title: "音乐舞动 - Three.js 案例讲解"
description: "音乐舞动：相机交互控制器、ShaderMaterial / RawShaderMaterial 自定义 GLSL、GUI 参数调试面板（着色器）"
head:
  - - meta
    - name: keywords
      content: "three.js,shader,audioDance,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 音乐舞动

*Audio Dance*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=audioDance)

![音乐舞动](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/audioDance.jpg)

## 你将学到什么

- 相机交互控制器
- ShaderMaterial / RawShaderMaterial 自定义 GLSL
- GUI 参数调试面板

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- **ShaderMaterial** 自定义 uniforms + vertex/fragment；**RawShaderMaterial** 需手写全部 shader 声明。
- dat.GUI / lil-gui 绑定 uniform 或配置对象实时调参。

## 实现步骤

1. 创建 OrbitControls 并处理 resize
2. 定义 uniforms，在 rAF 中更新并 render
3. gui.add 绑定可调参数

## 代码要点

```js
OrthographicCamera,
  ShaderMaterial,
  Scene,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "dat.gui";

function initOrthographicCamera(initialPosition) {
  const s = 15;


const vertexShader = /*glsl*/ `
    varying vec4 vPosition;
    void main() {
      vPosition = modelMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;



const fragmentShader = /*glsl*/ `
    varying vec4 vPosition;
    uniform float uScale;
    uniform vec3 colors[6];
    void main() {
      float intensity = clamp((vPosition.y + 13.0) * uScale / 255.0, 0.0, 1.0);
  
      float segment = intensity * 5.0;
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/shader/audioDance.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=audioDance) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[城市光影](/examples/three/shader/cityLight)
- 下一篇：[着色器天空](/examples/three/shader/shaderSky)

> 着色器 · Three.js · 22/89
