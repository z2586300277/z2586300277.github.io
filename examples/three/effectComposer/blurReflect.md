---
title: "模糊反射(drei转原生) - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `MeshReflectorMaterial`。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,effectComposer,模糊反射(drei转原生)"
outline: deep
---
# 模糊反射(drei转原生)

*Blur Reflect*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=blurReflect)

![模糊反射(drei转原生)](https://z2586300277.github.io/three-cesium-examples/threeExamples/expand/blurReflect.jpg)

## 你将学到什么

- 案例交互与参数可在在线编辑器中查看

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `MeshReflectorMaterial`。

> 后期处理 · Three.js

## 核心概念

- **Scene / Camera / Renderer** 是 Three.js 渲染三件套；Mesh = Geometry + Material。
- 开发时先确认坐标系、材质是否受光、以及是否需要 rAF 循环。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 渲染场景并处理 resize

## 源码

完整源码见 [在线案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=blurReflect)。

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=blurReflect) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [后期处理目录](/examples/three/effectComposer/)

> 后期处理 · Three.js
