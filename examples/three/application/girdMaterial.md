---
title: "网格材质 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,网格材质,应用场景"
outline: deep
---

# 网格材质

*Gird Material*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=girdMaterial)


![网格材质](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/girdMaterial.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。

> 应用场景 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
```

### 片元

- 片元输出 gl_FragColor

```glsl
uniform vec3 color;
        uniform float gridX;
        uniform float gridY;
        uniform float lineWidth;
        varying vec2 vUv;
        
        void main() {
            vec2 grid = vec2(gridX, gridY);
            vec2 f = fract(vUv * grid);
            vec2 df = fwidth(vUv * grid);
            vec2 line = smoothstep(df * lineWidth, df * lineWidth * 2.0, f) * 
                        smoothstep(df * lineWidth, df * lineWidth * 2.0, 1.0 - f);
            float alpha = 1.0 - min(line.x, line.y);
            if (alpha < 0.1) discard;
            gl_FragColor = vec4(color, 
```

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(50, 50, 50)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AxesHelper(100), new THREE.GridHelper(100, 10))

// 通用网格材质
const gridMaterial = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
        color: { value: new THREE.Color(0x00caea) },
        gridX: { value: 40.0 },
        gridY: { value: 20.0 },
        lineWidth: { value: 0.6 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 color;
        uniform float gridX;
        uniform float gridY;
        uniform float lineWidth;
        varying vec2 vUv;
        
        void main() {
            vec2 grid
```

