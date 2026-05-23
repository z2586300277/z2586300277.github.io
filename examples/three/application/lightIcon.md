---
title: "亮光标记 - Three.js 案例讲解"
description: "亮光标记：相机交互控制器、动画与时间线（应用场景）"
head:
  - - meta
    - name: keywords
      content: "three.js,application,lightIcon"
outline: deep
---

# 亮光标记

*Light Icon*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=application&id=lightIcon)

![亮光标记](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/lightIcon.jpg)

## 你将学到什么

- 相机交互控制器
- 动画与时间线

## 效果说明

Three.js WebGL 场景。打开在线案例可查看最终画面。

## 核心概念

- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- **AnimationMixer** 播 glTF 动画；**GSAP** 补间任意属性。

## 实现步骤

1. 创建 OrbitControls 并处理 resize
2. mixer.update(delta) 或 gsap.to 驱动属性
3. 搭建灯光与环境（如有）
4. requestAnimationFrame 循环 update + render

## 代码要点

```js
const circlePlane = new PlaneGeometry(6, 6)
const circleTexture = new TextureLoader().load(FILE_HOST + 'images/channels/label.png')
const circleMaterial = new MeshBasicMaterial({
    color: 0xffffff,
    map: circleTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide


const lightPillarTexture = new THREE.TextureLoader().load(FILE_HOST + 'images/channels/light_column.png')
const lightPillarGeometry = new THREE.PlaneGeometry(3, 20)
const lightPillarMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: lightPillarTexture,
    alphaMap: lightPillarTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/application/lightIcon.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=application&id=lightIcon) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[烟雾效果](/examples/three/application/smokeAir)
- 下一篇：[简单3d拓扑图](/examples/three/application/topology)

> 应用场景 · Three.js · 16/68
