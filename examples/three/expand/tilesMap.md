---
title: "瓦片地图 - Three.js 案例讲解"
description: "Three.js 接第三方库或扩展能力。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,瓦片地图,扩展功能"
outline: deep
---

# 瓦片地图

*Tiles Map*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=tilesMap)


![瓦片地图](https://z2586300277.github.io/three-cesium-examples/threeExamples/expand/tilesMap.jpg)


## 效果说明

Three.js 接第三方库或扩展能力。主流程在 `animate`。

> 扩展功能 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as tt from 'three-tile'
import * as plugin from "three-tile/plugin"

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(0, 10000, 0)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AmbientLight(0xffffff, 5))

animate()

function animate() {

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

}

const map = new tt.TileMap({
    imgSource: [new plugin.ArcGisSource(), new plugin.GDSource()],
    minLevel: 2,
    maxLevel: 18,
    lon0: 90
})
map.scale.multiplyScalar(0.001)
map.rotateX(-Math.PI / 2)
scene.add(map)

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}
```

