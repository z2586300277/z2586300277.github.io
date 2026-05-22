---
title: "中国旗帜 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,中国旗帜"
outline: deep
---
# 中国旗帜

*China Flag*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=chinaFlag)

![中国旗帜](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/chinaFlag.jpg)

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

camera.position.set(0.5, -0.5, 3)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

const flagTexture = new THREE.TextureLoader().load(GLOBAL_CONFIG.getFileUrl("images/chinaFlag.jpg"))

const flagMaterial = new THREE.RawShaderMaterial({

    vertexShader: `uniform mat4 projectionMatrix;
        uniform mat4 modelMatrix;
        uniform mat4 viewMatrix;
        uniform vec2 uFrequency;
        uniform float uTime;
        uniform float uStrength;
        attribute vec3 position;
        attribute vec2 uv;
        varying float vDark;
        varying vec2 vUv;
        void main() {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            float xFactor = clamp((modelPosition.x + 1.25) / 2.0, 0.0, 2.0); 
            float vWave = sin(modelPosition.x * uFrequency.x - uTime ) * xFactor * uStrength ;
            vWave += sin(modelPosition.y * uFrequency.y - uTime) * xFactor * uStrength * 0.5;
            modelPosition.y += sin(modelPosition.x * 2.0 + uTime * 0.5) * 0.05 * xFactor;
            modelPosition.z += vWave;
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            gl_Position = projectedPosition;
            vUv = uv;
            vDark = vWave;
        }`,

    fragmentShader: `precision mediump float;
        varying float vDark;
        uniform sampler2D uTexture;
        varying vec2 vUv;
        void main(){
            vec4 textColor = texture2D(uTexture, vUv);
            textColor.rgb *= vDark + 0.85;
            gl_FragColor = textColor;
        }`,

    side: THREE.DoubleSide,

    uniforms: {
        
        uFrequency: { value: new THREE.Vector2(3, 3) },
        
        uTime: { value: 0 },
        
        uTexture: { value: flagTexture },
        
        uStrength: { value: 0.2 }
        
    }

})

const flagGeometry = new THREE.BoxGeometry(3, 2, 0.025, 64, 64)

const flagMesh = new THREE.Mesh(flagGeometry, flagMaterial)

scene.add(flagMesh)

animate()

function animate() {

    flagMaterial.uniforms.uTime.value += 0.06

    renderer.render(scene, camera)

    requestAnimationFrame(animate)

}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=chinaFlag) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
