---
title: "透明渐变 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,透明渐变"
outline: deep
---
# 透明渐变

*Trans Grad*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=transparentGradient)

![透明渐变](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/transparentGradient.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 天空盒与环境贴图
- requestAnimationFrame 渲染循环
- GUI 面板调试参数

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`createStarShape()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createPolygonShape()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 50)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

const uniforms = {
    color: { value: new THREE.Color(0xffffff * Math.random()) },
    uvScale: { value: 0.1 },
    intensity: { value: 3 }
}

const material = new THREE.ShaderMaterial({
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv; 
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    varying vec2 vUv;
    uniform vec3 color;
    uniform float uvScale;
    uniform float intensity;
    void main() {
      vec2 uv = vUv * uvScale;
      float distance = length(uv);
      float alpha = smoothstep(0.0, 1., distance);
      gl_FragColor = vec4(color * intensity, alpha);
    }
  `,
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: uniforms

});

const gui = new GUI()
gui.addColor(material.uniforms.color, 'value').name('color')
gui.add(material.uniforms.intensity, 'value').min(0).max(10).name('intensity')
gui.add(material.uniforms.uvScale, 'value').min(0).max(1).name('uvScale')

// 通过点绘制成一个五角星
function createStarShape(radiusOuter, radiusInner, points) {
    const shape = new THREE.Shape();
    const angleStep = (Math.PI * 2) / points;

    for (let i = 0; i < points; i++) {
        const angleOuter = i * angleStep; // 外点的角度
        const angleInner = angleOuter + angleStep / 2; // 内点的角度

        const xOuter = Math.cos(angleOuter) * radiusOuter;
        const yOuter = Math.sin(angleOuter) * radiusOuter;
        const xInner = Math.cos(angleInner) * radiusInner;
        const yInner = Math.sin(angleInner) * radiusInner;

        if (i === 0) {
            shape.moveTo(xOuter, yOuter); // 第一个点
        } else {
            shape.lineTo(xOuter, yOuter); // 连接到外点
        }
        shape.lineTo(xInner, yInner); // 连接到内点
    }

    shape.closePath(); // 闭合形状

    return shape;
}

const starShape = createStarShape(5, 2, 5);

const starGeometry = new THREE.ShapeGeometry(starShape);

const star = new THREE.Mesh(starGeometry, material);

star.position.y += 10;

scene.add(star)

// 随机绘制成 4，5，6，7，8 边形
function createPolygonShape(radius, points) {

    const shape = new THREE.Shape();

    const angleStep = (Math.PI * 2) / points;

    for (let i = 0; i < points; i++) {

        const angle = i * angleStep;

        const x = Math.cos(angle) * radius;

        const y = Math.sin(angle) * radius;

        if (i === 0) {

            shape.moveTo(x, y);

        } else {

            shape.lineTo(x, y);

        }
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=transparentGradient) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
