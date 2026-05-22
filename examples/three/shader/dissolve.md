---
title: "溶解 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,溶解"
outline: deep
---
# 溶解

*Dissolve*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=dissolve)

![溶解](https://z2586300277.github.io/3d-file-server/images/dissolve/dissolve.png)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时
- GUI 面板调试参数

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
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from 'dat.gui'

/* GUI */

const gui = new dat.GUI()

// Container
const box = document.getElementById("box")

// Scene
const scene = new THREE.Scene()

/**
 * Loader
 */
const textureLoader = new THREE.TextureLoader()

/* Tex */
const dissolveTex = textureLoader.load(FILE_HOST + 'images/dissolve/dissolveTex.png')
dissolveTex.colorSpace = THREE.SRGBColorSpace
const dissolveRampTex = textureLoader.load(FILE_HOST + 'images/dissolve/dissolveRamp.png')
dissolveRampTex.colorSpace = THREE.SRGBColorSpace
const diffuseTex = textureLoader.load(FILE_HOST + 'images/dissolve/diffuse.png')
diffuseTex.colorSpace = THREE.SRGBColorSpace

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(4, 3, 32, 32)

// Material
const shaderMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  vertexShader:/* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec4 modelPosition = modelMatrix * vec4(position, 1.);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      gl_Position = projectedPosition;
    }
    `,
  fragmentShader:/* glsl */`
    uniform sampler2D uDissloveTex;
    uniform sampler2D uRamTex;
    uniform sampler2D uDiffuseTex;
    uniform float uClip;
    varying vec2 vUv;
    
    float customSmoothstep(float min, float max, float x) {
      return (x - min) / (max - min);
    }

    vec4 map(in vec4 value, in vec4 inMin, in vec4 inMax, in vec4 outMin, in vec4 outMax) {
      return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
    }
    
    void main() {
  
      vec4 DissloveTex = texture2D(uDissloveTex, vUv);
      DissloveTex = map(DissloveTex, vec4(0.), vec4(1.), vec4(0.1), vec4(1.));

      if((DissloveTex.r - uClip) < 0.) {
        discard;
      }
     
      float dissloveValue = clamp(customSmoothstep(uClip, uClip+.1, DissloveTex.r), 0., 1.);
      vec4 RamTex = texture2D(uRamTex, vec2(dissloveValue));
      vec4 diffuse = texture2D(uDiffuseTex, vUv);

      vec3 color = vec3(clamp( diffuse.rgb  + RamTex.rgb, 0., 1.));

      gl_FragColor = vec4(color, 1.0);

      #include <tonemapping_fragment>
	    #include <colorspace_fragment>
    }
    `,
  uniforms: {
    uDissloveTex: new THREE.Uniform(dissolveTex),
    uRamTex: new THREE.Uniform(dissolveRampTex),
    uDiffuseTex: new THREE.Uniform(diffuseTex),
    uClip: new THREE.Uniform(0)
  }
})

gui.add(shaderMaterial.uniforms.uClip, 'value').min(0).max(1).step(0.01).name('Clip')

// Mesh
const mesh = new THREE.Mesh(geometry, shaderMaterial)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=dissolve) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
