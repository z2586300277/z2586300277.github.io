---
title: "平面扫描 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,平面扫描"
outline: deep
---
# 平面扫描

*Plane Scan*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=planeScan)

![平面扫描](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/planeScan.jpg)

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

camera.position.set(0, 2, 2)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.outputColorSpace = THREE.LinearSRGBColorSpace 

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

const plane = new THREE.PlaneGeometry(5,5)

const map = new THREE.TextureLoader().load('https://z2586300277.github.io/three-editor/dist/files/channels/texture.jpg')

const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, map , transparent: true })

const mesh = new THREE.Mesh(plane, material)

const uniforms = {

    innerCircleWidth: { value: 0.59, type: 'number', unit: 'float' },

    circleWidth: { value: 0.2, type: 'number', unit: 'float' },

    circleMax: { value: 0.7, type: 'number', unit: 'float' },

    opacityScale: { value: 0.8, type: 'number', unit: 'float' },

    reverseOpacity: { value: false, type: 'bool', unit: 'bool' },

    circleSpeed: { value: 0.003, type: 'number', unit: 'float' },

    diff: { value: new THREE.Color(0xfff25f), type: 'color', unit: 'vec3' },

    color3: { value: new THREE.Color(0xff), type: 'color', unit: 'vec3' },

    center: { value: new THREE.Vector3(0, 0, 0), type: 'position', unit: 'vec3' },

    intensity: { value: 3, type: 'number', unit: 'float' },

    isDisCard: { value: true, type: 'bool', unit: 'bool' },

}

material.onBeforeCompile = (shader) => {

    Object.keys(uniforms).forEach((key) => shader.uniforms[key] = uniforms[key])

    shader.vertexShader = shader.vertexShader.replace(`void main() {`, 
    `varying vec2 vUv;
    varying vec3 v_position;
    void main() {
        vUv = uv;
        v_position = position;`
    )

    shader.fragmentShader = shader.fragmentShader.replace(

        /#include <common>/,

        Object.keys(uniforms).map(i => 'uniform ' + uniforms[i].unit + ' ' + i + ';').join('\n') + '\n' + 'varying vec3 v_position; varying vec2 vUv;\n'

        + '\n#include <common>\n'

    )

    shader.fragmentShader = shader.fragmentShader.replace('vec4 diffuseColor = vec4( diffuse, opacity );', `
        float dis = length(v_position - center);
        vec4 diffuseColor;
        if(dis < (innerCircleWidth + circleWidth) && dis > innerCircleWidth) {
            float r = (dis - innerCircleWidth) / circleWidth;
            float cOpacity = reverseOpacity ? (innerCircleWidth / circleMax) : 1. - ( innerCircleWidth / circleMax );
            #ifdef USE_MAP
                vec3 textureColor = texture2D(map, vUv).rgb;
                if(isDisCard && textureColor.r < 0.1 && textureColor.g < 0.1  && textureColor.b < 0.1 ) discard;
            #endif
            diffuseColor = vec4( mix(diff, color3, r) * vec3(intensity, intensity, intensity)  , opacity * cOpacity * opacityScale);
        }
        else {
            if(isDisCard)  discard ;
            else diffuseColor = vec4( diffuse, opacity );
        }
    `)

}

material.needsUpdate = true

mesh.rotation.x = Math.PI / 2

scene.add(mesh)

animate()

function animate() {

    uniforms.innerCircleWidth.value < uniforms.circleMax.value ? uniforms.innerCircleWidth.value += uniforms.circleSpeed.value : uniforms.innerCircleWidth.value = 0

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}

window.onresize = () => {
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=planeScan) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
