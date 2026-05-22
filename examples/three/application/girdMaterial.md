---
title: "网格材质 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,网格材质"
outline: deep
---
# 网格材质

*Gird Material*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=girdMaterial)

![网格材质](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/girdMaterial.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环
- GUI 面板调试参数

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
            vec2 grid = vec2(gridX, gridY);
            vec2 f = fract(vUv * grid);
            vec2 df = fwidth(vUv * grid);
            vec2 line = smoothstep(df * lineWidth, df * lineWidth * 2.0, f) * 
                        smoothstep(df * lineWidth, df * lineWidth * 2.0, 1.0 - f);
            float alpha = 1.0 - min(line.x, line.y);
            if (alpha < 0.1) discard;
            gl_FragColor = vec4(color, alpha);
        }
    `
})

// 几何体列表
const geometries = {
    'TorusKnot': new THREE.TorusKnotGeometry(15, 4, 100, 16),
    'Cylinder': new THREE.CylinderGeometry(15, 15, 40, 64),
    'Sphere': new THREE.SphereGeometry(20, 64, 32),
    'Torus': new THREE.TorusGeometry(15, 5, 32, 64),
    'Box': new THREE.BoxGeometry(30, 30, 30),
    'Cone': new THREE.ConeGeometry(15, 40, 64),
    'Capsule': new THREE.CapsuleGeometry(10, 20, 16, 32)
}

const mesh = new THREE.Mesh(geometries['TorusKnot'], gridMaterial)
scene.add(mesh)

// GUI 控制
const gui = new GUI()
const params = { geometry: 'TorusKnot', color: '#00ffff' }

gui.add(params, 'geometry', Object.keys(geometries)).name('几何体').onChange(v => mesh.geometry = geometries[v])
gui.add(gridMaterial.uniforms.gridX, 'value', 1, 100).name('横向网格')
gui.add(gridMaterial.uniforms.gridY, 'value', 1, 100).name('纵向网格')
gui.add(gridMaterial.uniforms.lineWidth, 'value', 0.1, 5).name('线条粗细')
gui.addColor(params, 'color').name('颜色').onChange(v => gridMaterial.uniforms.color.value.set(v))

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

animate()

window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()
}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=girdMaterial) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
