---
title: "官方选择辉光简化版 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,effectComposer,官方选择辉光简化版"
outline: deep
---
# 官方选择辉光简化版

*Three Bloom*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=threeSelectBloom)

![官方选择辉光简化版](https://z2586300277.github.io/three-cesium-examples/threeExamples/effectComposer/threeSelectBloom.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 自定义 ShaderMaterial / 修改内置 shader
- EffectComposer 后期处理管线
- 相机交互控制器
- 轮廓高亮 OutlinePass

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 后期处理 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **EffectComposer** 多 Pass 链式渲染：RenderPass → 特效 Pass → 输出屏幕。`composer.render()` 替代 `renderer.render()`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. 定义材质/shader 与 uniforms，rAF 中更新
4. EffectComposer 组装 Pass 链并 render

## 代码要点

- **`onClick()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js"
import { RenderPass } from "three/addons/postprocessing/RenderPass.js"
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js"
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js"

const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true, })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100000)
camera.position.set(200, 200, 200)
new OrbitControls(camera, renderer.domElement)

const light = new THREE.DirectionalLight(0xffffff, 3)
light.position.set(100, 100, 100)
scene.add(light)

// 物体
new GLTFLoader().load(FILE_HOST + "files/model/Fox.glb", (gltf) => scene.add(gltf.scene))
const mesh = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshStandardMaterial({ color: 0x00ff00 }))
mesh.position.set(50, 0, 0)
scene.add(mesh)

// 后期处理
const renderScene = new RenderPass(scene, camera)
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.8, 0.4, 0.0)
const bloomComposer = new EffectComposer(renderer)
bloomComposer.renderToScreen = false
bloomComposer.addPass(renderScene)
bloomComposer.addPass(bloomPass)

const finalPass = new ShaderPass(
    new THREE.ShaderMaterial({
        uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: bloomComposer.renderTarget2.texture },
        },
        vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
        `,
        fragmentShader: `
        uniform sampler2D baseTexture;
        uniform sampler2D bloomTexture;
        varying vec2 vUv;
        void main() {
            gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
        }
        `,
        defines: {},
    }),
    "baseTexture"
)
finalPass.needsSwap = true
const finalComposer = new EffectComposer(renderer)
finalComposer.addPass(renderScene)
finalComposer.addPass(finalPass)

// 点击切换辉光
window.addEventListener("click", onClick)
function onClick(event) {
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2(
        (event.offsetX / event.target.clientWidth) * 2 - 1,
        -(event.offsetY / event.target.clientHeight) * 2 + 1
    )
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(scene.children)
    if (intersects.length > 0)  intersects[0].object.layers.toggle(1) // 切换图层
}

// 窗口大小变化
window.onresize = function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    bloomComposer.setSize(window.innerWidth, window.innerHeight)
    finalComposer.setSize(window.innerWidth, window.innerHeight)
}

// 辉光图层
const bloomLayer = new THREE.Layers()
bloomLayer.set(1)

const darkMaterial = new THREE.MeshBasicMaterial({ color: "black" })
const materials = {}

render()
function render() {
    requestAnimationFrame(render)
    scene.traverse(obj => {
        if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
            materials[obj.uuid] = obj.material // 保存原材质
            obj.material = darkMaterial	// 替换材质
        }
    })
    bloomComposer.render() // 渲染到bloomComposer
    scene.traverse(obj => {
        if (materials[obj.uuid]) {
            obj.material = materials[obj.uuid] // 恢复原材质
            delete materials[obj.uuid] // 删除原材质
        }
    })
    finalComposer.render()
}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=threeSelectBloom) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [后期处理目录](/examples/three/effectComposer/)

> 后期处理 · Three.js
