---
title: "智慧城市扫光 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,智慧城市扫光"
outline: deep
---
# 智慧城市扫光

*City Move*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=cityMoveLight)

![智慧城市扫光](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/cityMoveLight.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. 定义材质/shader 与 uniforms，rAF 中更新
4. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(10, 10, 10)

const renderer = new THREE.WebGLRenderer()

renderer.setPixelRatio(window.devicePixelRatio * 1.5)

renderer.setSize(box.clientWidth, box.clientHeight)

new OrbitControls(camera, renderer.domElement)

window.onresize = () => {

  renderer.setSize(box.clientWidth, box.clientHeight)

  camera.aspect = box.clientWidth / box.clientHeight

  camera.updateProjectionMatrix()
  
}

box.appendChild(renderer.domElement)

// 坐标轴
scene.add(new THREE.AxesHelper(100000))

// 着色器
const uniforms = {

    innerCircleWidth: { value: 0 },

    circleWidth: { value: 300 },

    diff: { value: new THREE.Color(1., 1., 1.) },

    color: { value: new THREE.Color('#8f95ff') },

    opacity: { value: 0.6 },

    center: { value: new THREE.Vector3(0, 0, 0) }

}

const material = new THREE.ShaderMaterial({

    uniforms,

    transparent: true,

    vertexShader: `
        varying vec2 vUv;
        varying vec3 v_position;
        void main() {
            vUv = uv;
            v_position = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader: `
        varying vec2 vUv;
        varying vec3 v_position;

        uniform float innerCircleWidth;
        uniform float circleWidth;
        uniform float opacity;
        uniform vec3 center;
        
        uniform vec3 color;
        uniform vec3 diff;

        void main() {
            float dis = length(v_position - center);
            if(dis < (innerCircleWidth + circleWidth) && dis > innerCircleWidth) {
                float r = (dis - innerCircleWidth) / circleWidth;
            
                gl_FragColor = mix(vec4(diff, opacity), vec4(color, opacity), r);
            }else {
                gl_FragColor = vec4(diff, opacity);
            }
        }
    `

})

// 加载模型
new FBXLoader().load(HOST + '/files/model/city.FBX', (object3d) => {

    scene.add(object3d)

    object3d.scale.set(0.001, 0.001, 0.001)

    object3d.traverse((child) => {

        if (child.isMesh) child.material = material

    })

})

// 渲染
animate()

function animate() {

    if (uniforms.innerCircleWidth.value < 1000) uniforms.innerCircleWidth.value += 3
    
    else uniforms.innerCircleWidth.value = 0

    renderer.render(scene, camera)

// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=cityMoveLight) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
