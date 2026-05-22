---
title: "城市光影 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,城市光影"
outline: deep
---
# 城市光影

*City Light*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=cityLight)

![城市光影](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/cityLight.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- GSAP / anime.js 属性动画
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- 时间线库驱动 position/rotation/uniform，与 rAF 渲染循环配合。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. 定义材质/shader 与 uniforms，rAF 中更新
4. rAF 循环中 update 并 render

## 代码要点

- **`modifyMaterial()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`addColor()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`addWave()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`addLightLine()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`addToTopLine()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import gsap from 'gsap'

const size = {
    width: window.innerWidth,
    height: window.innerHeight
}
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 1000)
camera.position.set(5, 5, 5)
const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true })
renderer.setSize(size.width, size.height)
renderer.setPixelRatio(window.devicePixelRatio * 1.5)
document.body.appendChild(renderer.domElement)
new OrbitControls(camera, renderer.domElement)
renderer.setAnimationLoop(() =>  renderer.render(scene, camera))

//加载gltf
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath(FILE_HOST + 'js/three/draco/')
dracoLoader.preload()
const loader = new GLTFLoader()
loader.setDRACOLoader(dracoLoader)
loader.load(FILE_HOST + 'models/glb/build.glb', (gltf) => {
    const model = gltf.scene
    model.scale.set(0.01, 0.01, 0.01)
    scene.add(model)
    model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.material.dispose()
            child.material = modifyMaterial()
        }
    })
})

// fbx
new FBXLoader().load(HOST + '/files/model/city.FBX', (object3d) => {
    scene.add(object3d)
    object3d.scale.set(0.001, 0.001, 0.001)
    object3d.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.material.dispose()
            child.material = modifyMaterial()
        }
    })
})

//混合着色
function modifyMaterial() {
    const material = new THREE.MeshBasicMaterial({
        color: '#28A1CC',
        // wireframe: true,
        opacity: 0.2,
        transparent: true,
        side: THREE.DoubleSide
    })
    material.onBeforeCompile = (shader) => {
        shader.fragmentShader = shader.fragmentShader.replace(/#include <dithering_fragment>/, `#include <dithering_fragment> //替换标记`)
        addColor(shader)
        addWave(shader)
        addLightLine(shader)
        addToTopLine(shader)
    }
    return material
}

//  
function addColor(shader) {
    //   获取物体的高度差
    const uHeight = 1200

    shader.uniforms.uTopColor = {
        value: new THREE.Color('#e9eaef')
    }
    shader.uniforms.uHeight = {
        value: uHeight
    }

    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
      #include <common>
      varying vec3 vPosition;
      `
    )

    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
      #include <begin_vertex>
      vPosition = position;
  `
    )

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `
      #include <common>

      uniform vec3 uTopColor;
      uniform float uHeight;
      varying vec3 vPosition;

        `
    )
    shader.fragmentShader = shader.fragmentShader.replace(
        '//替换标记',
        `

      vec4 distGradColor = gl_FragColor;

      // 设置混合的百分比
      float gradMix = vPosition.y/uHeight;
      // 计算出混合颜色
      vec3 gradMixColor = mix(distGradColor.xyz,uTopColor,gradMix);
      gl_FragColor = vec4(gradMixColor,1);
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=cityLight) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
