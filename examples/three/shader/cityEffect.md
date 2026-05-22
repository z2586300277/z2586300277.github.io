---
title: "城市光效 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,城市光效"
outline: deep
---
# 城市光效

*City Effect*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=cityEffect)

![城市光效](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/cityEffect.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 天空盒与环境贴图
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

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

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(0, 400, 1000)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setPixelRatio(window.devicePixelRatio * 1.3)

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

// 文件地址
const urls = [0, 1, 2, 3, 4, 5].map(k => (FILE_HOST + 'files/sky/skyBox0/' + (k + 1) + '.png'));

const textureCube = new THREE.CubeTextureLoader().load(urls);

scene.background = textureCube;

const renderList = []

const light = new THREE.AmbientLight(0xadadad)

scene.add(light)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)

directionalLight.position.set(600, 600, 0)

scene.add(directionalLight)

/**
 * 对于shader内容的修改，需要根据具体内容进行处理
 * shader中会存在#include <begin_vertex>等语句，这些事three定义的glsl，具体脚本内容查看three源码中renderer/shaders/shaderChunk下对应脚本文件
 * 而修改shader就是在对应的脚本语句后修改脚本或增加语句
 */
const applyGrowShader = (shader) => {
    shader.uniforms.uProgress = { value: 0 }
    shader.vertexShader = `
    uniform float uProgress;
    ${shader.vertexShader}
  `
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
      #include <begin_vertex>
      transformed.z = position.z * min(uProgress, 1.0);
    `
    )
    renderList.push((progress) => {
        shader.uniforms.uProgress.value = progress
    })
}
// 建筑表面流动上升效果
const applyRiseShader = (shader) => {
    shader.uniforms.uRiseTime = { value: 0 }
    shader.uniforms.uRiseColor = { value: new THREE.Color('#87CEEB') }

    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
      #include <common>
      varying vec3 vTransformedNormal;
      varying float vHeight;
    `
    )
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
      #include <begin_vertex>
      vTransformedNormal = normalize(normal);
      vHeight = transformed.z;
    `
    )

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `
      #include <common>
      uniform vec3 uRiseColor;
      uniform float uRiseTime;
      varying float vHeight;
      varying vec3 vTransformedNormal;
      
      vec3 riseLine() {
        float smoothness = 1.8;
        float speed = uRiseTime;
        bool isTopBottom = (vTransformedNormal.z > 0.0 || vTransformedNormal.z < 0.0) && vTransformedNormal.x == 0.0 && vTransformedNormal.y == 0.0;
        float ratio = isTopBottom ? 0.0 : smoothstep(speed, speed + smoothness, vHeight) - smoothstep(speed + smoothness, speed + smoothness * 2.0, vHeight);
        return uRiseColor * ratio;
      }
    `
    )
    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `
      #include <dithering_fragment>
      gl_FragColor = gl_FragColor + vec4(riseLine(), 1.0);
    `
    )
    renderList.push((time) => {
        shader.uniforms.uRiseTime.value = time * 30.0
    })
}

// 扩散波效果
const applySpreadShader = (shader) => {
    shader.uniforms.uSpreadTime = { value: 0 }
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=cityEffect) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
