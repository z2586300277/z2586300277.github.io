---
title: "点云第一人称漫游,碰撞检测 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。入口在 `OctreeCollisionField`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,点云第一人称漫游,碰撞检测,应用场景"
outline: deep
---

# 点云第一人称漫游,碰撞检测

*Point Cloud FPS Octree*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=pointCloudFpsOctree)


![点云第一人称漫游,碰撞检测](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/pointCloudFpsOctree.png)


## 效果说明

Three.js 业务向场景组合。入口在 `OctreeCollisionField`。

> 应用场景 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 点击选中：`Raycaster` + 鼠标 NDC 坐标，`intersectObjects` 取交点。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 点精灵/粒子：`Points` + `PointsMaterial`，或自定义 shader 控 size/颜色。

## 类与方法

### OctreeCollisionField

- `constructor()` — 参数：positions, maxDepth = 10, minNodeSize = 0.03
- `buildNode()`
- `getApproxNearestDistance()`
- `queryNode()`
- `distanceSqToBox()`

## 独立函数

- `addAnchors()` — 移除 Entity / 解绑监听
- `updateWallVisualization()` — 移除 Entity / 解绑监听
- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'

const box = document.getElementById('box')
box.style.position = 'relative'

const style = document.createElement('style')
style.textContent = `
    .pc-info { position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.7); color: #fff; padding: 10px 20px; border-radius: 8px; pointer-events: none; z-index: 100; font-size: 14px; border-left: 4px solid #ffaa00; }
    .pc-status { position: absolute; bottom: 30px; left: 20px; background: rgba(0,0,0,0.6); color: #0ff; padding: 8px 16px; border-radius: 20px; font-size: 14px; pointer-events: none; z-index: 100; backdrop-filter: blur(5px); border: 1px solid #00ccff; }
    .pc-instruction { position: absolute; bottom: 30px; right: 30px; background: rgba(30,30,30,0.85); color: #ccc; padding: 15px 25px; border-radius: 8px; font-size: 14px; line-height: 1.8; border: 1px solid #555; pointer-events: none; z-index: 100; box-shadow: 0 4px 15px rgba(0,0,0,0.5); backdrop-filter: blur(5px); }
    .pc-instruction kbd { background: #333; border-radius: 4px; padding: 2px 8px; color: #ffaa00; border: 1px solid #666; }
    .pc-warning { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: red; font-size: 24px; font-weight: b
```

