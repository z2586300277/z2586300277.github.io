---
title: "雷达扫描 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,雷达扫描"
outline: deep
---
# 雷达扫描

*Radar Scan*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=radarScan)

![雷达扫描](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/radarScan.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 应用场景 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`createRadarMarkers()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`update()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

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
    g: parseInt(hex.substring(2, 4), 16) / 255,
    b: parseInt(hex.substring(4, 6), 16) / 255
  };
}

// 添加圆形雷达范围标记 - 简化后的函数
function createRadarMarkers(radius, count) {
  const { ringColor, lineColor, opacity, angleCount } = CONFIG.markers;
  const markers = new THREE.Group();
  
  // 创建同心圆
  const ringMaterial = new THREE.LineBasicMaterial({ 
    color: ringColor, 
    opacity, 
    transparent: true 
  });
  
  for (let i = 1; i <= count; i++) {
    const circle = new THREE.RingGeometry(
      radius * i / count, 
      radius * i / count + 1, 
      100
    );
    const line = new THREE.LineSegments(
      new THREE.EdgesGeometry(circle), 
      ringMaterial
    );
    line.rotation.x = Math.PI / 2;
    markers.add(line);
  }

  // 添加角度标记线
  const angleMaterial = new THREE.LineBasicMaterial({ 
    color: lineColor, 
    opacity: opacity - 0.1, 
    transparent: true 
  });
  
  for (let i = 0; i < angleCount; i++) {
    const angle = (i * (360 / angleCount)) * Math.PI / 180;
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
    ]);
    markers.add(new THREE.Line(lineGeometry, angleMaterial));
  }

  return markers;
}

// 创建并添加雷达标记
const radarMarkers = createRadarMarkers(CONFIG.radar.radius, CONFIG.radar.rings);
scene.add(radarMarkers);

// 雷达扫描区域
const { position, radius, opacity } = CONFIG.radar;
const radarColor = hexToRgb(CONFIG.radar.color);
const scanColor = hexToRgb(CONFIG.radar.scanColor);

// 创建雷达圆盘
const circleGeometry = new THREE.CircleGeometry(radius, 1000)
circleGeometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI/2))

const material = new THREE.MeshBasicMaterial({ 
  color: new THREE.Color(radarColor.r, radarColor.g, radarColor.b), 
  opacity, 
  transparent: true 
})

// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=radarScan) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
