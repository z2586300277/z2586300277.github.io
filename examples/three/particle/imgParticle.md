---
title: "图片粒子 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`、`createParticles`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,图片粒子,粒子"
outline: deep
---

# 图片粒子

*Image Particle*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=imgParticle)


![图片粒子](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/imgParticle.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`、`createParticles`。

> 粒子 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
attribute vec3 color_list;
                varying vec3 vColor;
                uniform float zPos;
                void main() {
                    vColor = color_list;
                    vec4 mvPosition = modelViewMatrix * vec4(position.xy, position.z * zPos, 1.0);
                    gl_PointSize = ${config.pointSize * config.sizeScale} * (1.0 - mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
```

### 片元

- 片元输出 gl_FragColor

```glsl
varying vec3 vColor;
                uniform bool useCustomColor;
                uniform vec3 customColor;
                uniform float opacity;
                void main() {
                    vec3 color = useCustomColor ? customColor : vColor;
                    gl_FragColor = vec4(color * vec3(${config.intensity}), opacity);
                }
```

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

animate()

function animate() {

  requestAnimationFrame(animate)

  controls.update()

  renderer.render(scene, camera)

}

window.onresize = () => {

  renderer.setSize(box.clientWidth, box.clientHeight)

  camera.aspect = box.clientWidth / box.clientHeight

  camera.updateProjectionMatrix()

}

// 粒子系统配置
const config = {
    imageUrl: HOST + 'files/author/z2586300277.png',
    targetSize: 2,      // 缩放目标大小
    depth: 0.3,           // 深度范围
    pointSize: 0.001,   // 粒子基础大小
    sizeScale: 0.5,       // 粒子大小缩放系数
    color: 0xff0000,    // 自定义颜色
    useCustomColor: false,
    intensity: 1.1,
    particleGap: 6,     // 粒子间隔(1-10, 值越大粒子越少)
    particleOpacity: 0.8  // 粒子透明度
};

createParticles(config, particles => {
    particles.
```

