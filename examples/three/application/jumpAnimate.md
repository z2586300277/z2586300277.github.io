---
title: "跳跃动画 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `randomizeTargets`、`animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,跳跃动画,应用场景"
outline: deep
---

# 跳跃动画

*Jump Animate*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=jumpAnimate)


![跳跃动画](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/jumpAnimate.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `randomizeTargets`、`animate`。

> 应用场景 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 2000)

camera.position.set(10, 10, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.GridHelper(10, 10))

// uniforms
const uniforms = {
    points: {
        value: [
            new THREE.Vector3(-30, 2.0, 0),
            new THREE.Vector3(0, 5.0, 0),
            new THREE.Vector3(30, 10.0, 0)
        ]
    },
    // 目标点（用于插值过渡）
    targetPoints: {
        value: [
            new THREE.Vector3(-30, 2.0, 0),
            new THREE.Vector3(0, 5.0, 0),
            new THREE.Vector3(30, 10.0, 0)
        ]
    },
    baseInfluenceRadius: { value: 5.0 },
    heightToRadiusRatio: { value: 2.0 },
    falloffPower: { value: 2.0 },
    baseHeight: { value: 0.0 },
    maxHeight: { value: 10.0 },
    color1: { value: new THREE.Color(0x0066ff) },
    color2: { value: new THREE.Color(0xff3300) },
}

// 顶点着色器
const vertexShader 
```

