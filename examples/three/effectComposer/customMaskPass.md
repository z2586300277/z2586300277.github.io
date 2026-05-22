---
title: "自定义遮罩通道 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `ScreenMaskPass`。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,effectComposer,自定义遮罩通道"
outline: deep
---
# 自定义遮罩通道

*Custom Mask*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=customMaskPass)

![自定义遮罩通道](https://z2586300277.github.io/three-cesium-examples/threeExamples/effectComposer/customMaskPass.jpg)

## 你将学到什么

- EffectComposer 后期处理管线
- 相机交互控制器
- 天空盒与环境贴图
- 轮廓高亮 OutlinePass
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `ScreenMaskPass`。

> 后期处理 · Three.js

## 核心概念

- **EffectComposer** 多 Pass 链式渲染：RenderPass → 特效 Pass → 输出屏幕。`composer.render()` 替代 `renderer.render()`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

- 选中物体外轮廓发光，常用于编辑器选中态。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. EffectComposer 组装 Pass 链并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'

class ScreenMaskPass extends ShaderPass {

    constructor() {

        super({

            name: 'ScreenMaskShader',

            uniforms: {
                tDiffuse: { value: null },
                opacity: { value: 1.0 },
                intensity: { value: 2.0 },
                maskColor: { value: new THREE.Color(1, 1, 1) },
                R: { value: 0.1 },
                sr: { value: 1.2 }
            },

            vertexShader: `
                varying vec2 vUv;
                void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }
            `,

            fragmentShader: `
                uniform float opacity;
                uniform float intensity;
                uniform sampler2D tDiffuse;
                uniform vec3 maskColor;
                uniform float R;
                uniform float sr;
                varying vec2 vUv;
                void main() {
                // 阴影颜色
                vec4 texel = texture2D( tDiffuse, vUv );
                // 距离中心的距离
                float dist = sqrt((vUv.x-0.5)*(vUv.x-0.5)+(vUv.y-0.5)*(vUv.y-0.5));
                // 渐变, sr 是开始黑色参数
                float rr = (sr - smoothstep(R, R + 0.5, dist));
                // 叠加黑色
                texel *= vec4(maskColor * rr * vec3(intensity,intensity,intensity), 1.0);
                gl_FragColor = opacity * texel;
                }
            `

        })

    }

}

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 2, 8)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const composer = new EffectComposer(renderer)

const renderPass = new RenderPass(scene, camera)

composer.addPass(renderPass)

const screenMaskPass = new ScreenMaskPass()

composer.addPass(screenMaskPass)

scene.add(new THREE.AxesHelper(500), new THREE.GridHelper(500, 50))

animate()

function animate() {

    requestAnimationFrame(animate)

    composer.render()

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

// 文件地址
const urls = [0, 1, 2, 3, 4, 5].map(k => ('https://z2586300277.github.io/three-editor/dist/files/scene/skyBox0/' + (k + 1) + '.png'));

const textureCube = new THREE.CubeTextureLoader().load(urls);

scene.background = textureCube;
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=customMaskPass) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [后期处理目录](/examples/three/effectComposer/)

> 后期处理 · Three.js
