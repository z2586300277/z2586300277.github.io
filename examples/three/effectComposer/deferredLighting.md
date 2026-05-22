---
title: "延迟光照 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,effectComposer,延迟光照"
outline: deep
---
# 延迟光照

*Deferred Lighting*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=deferredLighting)

![延迟光照](https://z2586300277.github.io/three-cesium-examples/threeExamples/effectComposer/deferredLighting.webp)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 自定义 ShaderMaterial / 修改内置 shader
- EffectComposer 后期处理管线
- 相机交互控制器
- 离屏渲染 RenderTarget

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

- **`updateBloom()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`initPostprocessing()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`addLight()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`updateLights()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`onWindowResize()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GUI } from "three/addons/libs/lil-gui.module.min.js"
const gui=new GUI()
const bloomParams = {
    exposure: 1,
    bloomStrength: 0.01,
    bloomThreshold: 0,
    bloomRadius: 0.5
};
console.log('Three.js 版本:', THREE.REVISION);
// 初始化场景、相机、渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(400, 400, 400);
scene.add(camera);
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    logarithmicDepthBuffer: true
});
renderer.outputColorSpace = 'srgb'
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight('#fff', 2);
scene.add(ambientLight);
// 添加性能监控
const stats = new Stats();
document.body.appendChild(stats.dom);
// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const lightGroup = new THREE.Group();
const geometry = new THREE.PlaneGeometry( 10000, 10000);
const material = new THREE.MeshBasicMaterial( {color: 0xcccccc} );
const plane = new THREE.Mesh( geometry, material );
plane.rotation.x = -Math.PI/2;
scene.add(plane);
// 加载模型 fbx  未使用预览图模型 使用仓库已有的模型,最终效果与外部预览图不一致
new FBXLoader().load(HOST + '/files/model/city.FBX', (object3d) => {
    object3d.scale.multiplyScalar(0.1)
    object3d.position.set(0, -1, 0)
    scene.add(object3d)
})

//后处理管理对象
const postprocessing = {}
const numLights = 1000;
const width = numLights; // 每行存储 numLights 个光源信息
const height = 2; // 两行
// 创建一个 Float32Array 来存储数据
const data = new Float32Array(width * height * 4); // 4 通道 (RGBA)
let effectComposer,renderPass,bloomPass
const lightTexture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat, THREE.FloatType);

function updateBloom() {
    bloomPass.strength = bloomParams.bloomStrength;
    bloomPass.radius = bloomParams.bloomRadius;
    bloomPass.threshold = bloomParams.bloomThreshold;
}

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
initPostprocessing(WIDTH,HEIGHT)
addLight()
updateLights()
// 动画渲染
function animate() {
    requestAnimationFrame(animate)
    updateLights()
    scene.overrideMaterial = null
    //写入原场景渲染图
    renderer.setRenderTarget(postprocessing.texture1)
    renderer.render(scene, camera)
    //将定点数据 法相数据存入通道
    scene.overrideMaterial = postprocessing.gBufferPass
    renderer.setRenderTarget(postprocessing.gBuffer)
    renderer.render(scene, camera)
    renderer.setRenderTarget(null)
    renderer.render(postprocessing.scene, postprocessing.camera);
    effectComposer.render()
    stats.update()
    controls.update();
}

animate();

function initPostprocessing(renderTargetWidth, renderTargetHeight) {
    postprocessing.scene = new THREE.Scene();
    postprocessing.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    postprocessing.scene.add(postprocessing.camera);
    postprocessing.texture1 = new THREE.WebGLRenderTarget(renderTargetWidth, renderTargetHeight, {
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        colorSpace: THREE.SRGBColorSpace,
        depthBuffer: true,
        stencilBuffer: false
    })
    postprocessing.gBuffer = new THREE.WebGLRenderTarget(renderTargetWidth, renderTargetHeight, {
        format: THREE.RGBAFormat, // 使用 RGBAFormat 确保有 alpha 通道
        type: THREE.FloatType, // 使用 FloatType 以确保存储精度
        depthBuffer: true, // 确保有深度缓冲
        count: 2
    })

    // G-BUFFER 管线
    postprocessing.gBufferPass = new THREE.ShaderMaterial({
        vertexShader: `
        out vec3 vNormal;
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=deferredLighting) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [后期处理目录](/examples/three/effectComposer/)

> 后期处理 · Three.js
