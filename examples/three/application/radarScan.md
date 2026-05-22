---
title: "雷达扫描 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `createRadarMarkers`、`animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,雷达扫描,应用场景"
outline: deep
---

# 雷达扫描

*Radar Scan*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=radarScan)


![雷达扫描](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/radarScan.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `createRadarMarkers`、`animate`。

> 应用场景 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 点精灵/粒子：`Points` + `PointsMaterial`，或自定义 shader 控 size/颜色。

## 独立函数

- `createRadarMarkers()` — 材质 / GLSL
- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 配置与常量
const CONFIG = {
  grid: { size: 1000, divisions: 20, color1: 0x345678, color2: 0x123456 },
  radar: {
    position: { x: 0, y: 20, z: 0 },
    radius: 240,
    color: '#2288ff',      // 更改为好看的蓝色
    scanColor: '#00ffaa',  // 更改为青绿色
    opacity: 0.5,
    speed: 300,
    followWidth: 220,
    rings: 3
  },
  markers: {
    ringColor: 0x3399aa,   // 更改为蓝绿色
    lineColor: 0x3399aa,   // 保持一致性
    opacity: 0.3,
    angleCount: 12
  }
}

// 初始化场景
const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 10000)
camera.position.set(0, 800, 1000)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// 辅助网格
const gridHelper = new THREE.GridHelper(
  CONFIG.grid.size, 
  CONFIG.grid.divisions, 
  CONFIG.grid.color1, 
  CONFIG.grid.color2
);
scene.add(gridHelper);

// 颜色转换工具函数
const hexToRgb = hex => {
  hex = hex.replace('#', '');
  return {
    r: parseInt(hex.substring(0, 2), 16) / 255,
 
```

