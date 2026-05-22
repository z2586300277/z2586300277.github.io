---
title: "扩散圆墙 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,扩散圆墙"
outline: deep
---
# 扩散圆墙

*Wall Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=wallShader)

![扩散圆墙](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/wallShader.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 10, 10)
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.25

window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()
}

const curve = new THREE.LineCurve3(new THREE.Vector3(), new THREE.Vector3().setY(3))
const geometry = new THREE.TubeGeometry(curve, 20, 5, 300, false);

geometry.computeBoundingBox()
const { max, min } = geometry.boundingBox

// 创建材质
const material = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
        uMax: { value: max },
        uMin: { value: min },
        uColor: { value: new THREE.Color('#409eff') }
    },
    vertexShader: `
      varying vec4 vPosition;
      void main() {
        vPosition = modelMatrix * vec4(position,1.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor; // 半径        
      uniform vec3 uMax; 
      uniform vec3 uMin;
      uniform mat4 modelMatrix; // 世界矩阵
      varying vec4 vPosition; // 接收顶点着色传递进来的位置数据
      void main() {
        vec4 uMax_world = modelMatrix * vec4(uMax,1.0);
        vec4 uMin_world = modelMatrix * vec4(uMin,1.0);
        float opacity =1.0 - (vPosition.y - uMin_world.y) / (uMax_world.y -uMin_world.y); 
        gl_FragColor = vec4( uColor, opacity);
      }
    `
})

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

let time = 0
animate()

function animate() {
    if (time >= 1) time = 0
    else {
        time += 0.01
        mesh.scale.set(time, 1, time)
    }

    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=wallShader) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
