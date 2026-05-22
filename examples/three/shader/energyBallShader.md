---
title: "能量球 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,能量球"
outline: deep
---
# 能量球

*Energy Ball*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=energyBallShader)

![能量球](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/energyBallShader.jpg)

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
const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// 创建城市建筑物
const createBuildings = () => {
  const buildings = new THREE.Group()
  const buildingCount = 50
  
  for(let i = 0; i < buildingCount; i++) {
    const height = Math.random() * 5 + 1
    const geometry = new THREE.BoxGeometry(1, height, 1)
    const material = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff })
    
    const building = new THREE.Mesh(geometry, material)
    building.position.set((Math.random() - 0.5) * 20, height / 2, (Math.random() - 0.5) * 20)
    buildings.add(building)
  }
  
  scene.add(buildings)
}

// 创建能量球着色器
const energyBallShader = new THREE.ShaderMaterial({
  uniforms: { time: { value: 0.0 }, color: { value: new THREE.Color(1.0, 0.5, 0.0) } },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    void main() {
      vec2 center = vec2(0.5, 0.5);
      float dist = length(vUv - center);
      float pulse = sin(time * 2.0) * 0.5 + 0.5;
      float alpha = smoothstep(0.5, 0.0, dist) * pulse;
      vec3 finalColor = mix(color, vec3(1.0), 1.0 - dist);
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
  transparent: true,
  side: THREE.DoubleSide
})

// 创建能量球
const energyBall = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), energyBallShader)
energyBall.rotation.x = -Math.PI / 2
energyBall.position.y = 0.1
scene.add(energyBall)

// 添加环境光和点光源
scene.add(new THREE.AmbientLight(0x333333))
const pointLight = new THREE.PointLight(0xff9900, 2, 20)
pointLight.position.set(0, 5, 0)
scene.add(pointLight)

// 创建建筑物
createBuildings()

// 调整相机位置
camera.position.set(0, 5, 5)
camera.lookAt(0, 2, 0)

animate()

function animate() {
  requestAnimationFrame(animate)
  controls.update()
  energyBallShader.uniforms.time.value += 0.016
  renderer.render(scene, camera)
}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=energyBallShader) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
