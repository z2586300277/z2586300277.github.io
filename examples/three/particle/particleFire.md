---
title: "粒子烟花 - Three.js 案例讲解"
description: "粒子烟花：Scene / Camera / Renderer 渲染管线、相机交互控制器、ShaderMaterial / RawShaderMaterial 自定义 GLSL（粒子）"
head:
  - - meta
    - name: keywords
      content: "three.js,particle,particleFire,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 粒子烟花

*Fire*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=particleFire)

![粒子烟花](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/particleFire.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- ShaderMaterial / RawShaderMaterial 自定义 GLSL
- 粒子 / 点云 / 实例化渲染
- 动画与时间线

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，粒子或点云特效，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- **ShaderMaterial** 自定义 uniforms + vertex/fragment；**RawShaderMaterial** 需手写全部 shader 声明。
- 大量点用 **BufferGeometry + Points** 或 **InstancedMesh** 合批，避免逐 Entity 创建。
- **AnimationMixer** 播 glTF 动画；**GSAP** 补间任意属性。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. 定义 uniforms，在 rAF 中更新并 render
4. 构建几何 attribute 或 instanceMatrix 并 add 到 scene
5. mixer.update(delta) 或 gsap.to 驱动属性

## 代码要点

```js
const scene = new THREE.Scene();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: null,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};

};
sizes.resolution = new THREE.Vector2(
  window.innerWidth * sizes.pixelRatio,
  window.innerHeight * sizes.pixelRatio
);


const textureLoader = new THREE.TextureLoader();



const textureLoader = new THREE.TextureLoader();

const textures = [
  textureLoader.load(FILE_HOST + "threeExamples/particle/particleFire/1.png"),
  textureLoader.load(FILE_HOST + "threeExamples/particle/particleFire/10.png"),
  textureLoader.load(FILE_HOST + "threeExamples/particle/particleFire/3.png"),
  textureLoader.load(FILE_HOST + "threeExamples/particle/particleFire/4.png"),
  textureLoader.load(FILE_HOST + "threeExamples/particle/particleFire/5.png"),
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/particle/particleFire.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=particleFire) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[粒子线](/examples/three/particle/particleWire)
- 下一篇：[粒子星空](/examples/three/particle/starrySky)

> 粒子 · Three.js · 14/27
