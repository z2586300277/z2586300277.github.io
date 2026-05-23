---
title: "天空云 - Three.js 案例讲解"
description: "天空云：ShaderMaterial / RawShaderMaterial 自定义 GLSL、粒子 / 点云 / 实例化渲染、GUI 参数调试面板（着色器）"
head:
  - - meta
    - name: keywords
      content: "three.js,shader,cloudShader,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 天空云

*Cloud Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=shader&id=cloudShader)

![天空云](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/cloudShader.jpg)

## 你将学到什么

- ShaderMaterial / RawShaderMaterial 自定义 GLSL
- 粒子 / 点云 / 实例化渲染
- GUI 参数调试面板

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **ShaderMaterial** 自定义 uniforms + vertex/fragment；**RawShaderMaterial** 需手写全部 shader 声明。
- 大量点用 **BufferGeometry + Points** 或 **InstancedMesh** 合批，避免逐 Entity 创建。
- dat.GUI / lil-gui 绑定 uniform 或配置对象实时调参。

## 实现步骤

1. 定义 uniforms，在 rAF 中更新并 render
2. 构建几何 attribute 或 instanceMatrix 并 add 到 scene
3. gui.add 绑定可调参数

## 代码要点

```js
PlaneGeometry,
    ShaderMaterial,
    InstancedMesh,
    Object3D,
    Vector2,
    InstancedBufferAttribute,
    PerspectiveCamera,
    WebGLRenderer,
    PCFSoftShadowMap,

    const geometry = new PlaneGeometry(64, 64);
    const material = new ShaderMaterial({
        uniforms: {
            map: {
                value: cloudTexture,
            },
            fogColor: {
                value: new Color(params.fogColor),
            },

        },
        vertexShader: vs,
        fragmentShader: fs,
        depthWrite: false,
        depthTest: false,
        transparent: true,
    });

    const mesh = new InstancedMesh(geometry, material, params.count);
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/shader/cloudShader.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=shader&id=cloudShader) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[水天一色](/examples/three/shader/waterSky)
- 下一篇：[乌云](/examples/three/shader/darkClouds)

> 着色器 · Three.js · 65/89
