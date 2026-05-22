---
title: "数学公式应用 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `sample`、`buildTube`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,数学公式应用,应用场景"
outline: deep
---

# 数学公式应用

*Math Apply*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=mathApply)


![数学公式应用](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/mathApply.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `sample`、`buildTube`。

> 应用场景 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `buildTube()` — 材质 / GLSL

## 源码

```js
<!DOCTYPE html>
<html lang="zh-CN">

<head>
  <meta charset="UTF-8" />
  <title>Three.js 中高中数学函数三维可视化</title>
  <style>
    * {
      margin: 0;
      padding: 0
    }

    body {
      background: #05050f;
      overflow: hidden;
      font-family: Arial, sans-serif
    }

    #info {
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 10;
      color: #ddd;
      background: rgba(0, 0, 0, .7);
      padding: 10px 16px;
      border-radius: 8px;
      border: 1px solid #4ecdc4;
      line-height: 1.9;
    }

    #name {
      font-size: 16px;
      color: #4ecdc4;
      font-family: monospace;
      font-weight: bold
    }
  </style>
</head>

<body>
  <div id="info">
    <div id="name">一次函数 y = x</div>
    拖动旋转 · 滚轮缩放
  </div>
  <script type="importmap">
    {
      "imports":{
        "three":"https://threejs.org/build/three.module.js",
        "three/addons/":"https://threejs.org/examples/jsm/"
      }
    }</script>
  <script type="module">
    import * as THREE from 'three'
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
    import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1000)
    camera.position.set(0, 6, 18)
    const renderer = n
```

