---
title: "场景雪 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,effectComposer,场景雪"
outline: deep
---
# 场景雪

*sceneSnowEffect*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=sceneSnowEffect)

![场景雪](https://z2586300277.github.io/three-cesium-examples/threeExamples/effectComposer/sceneSnowEffect.webp)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 点云 / 粒子 / 实例化渲染
- 离屏渲染 RenderTarget

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 后期处理 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **Points** 大量顶点用点精灵渲染；**InstancedMesh** 相同几何体批量绘制，降低 draw call。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. 定义材质/shader 与 uniforms，rAF 中更新
4. rAF 循环中 update 并 render

## 代码要点

- **`updatePoints()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`initPostprocessing()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`onWindowResize()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader.js";
import {GUI} from "three/addons/libs/lil-gui.module.min.js"
console.log('Three.js 版本:', THREE.REVISION);
const gui = new GUI()
const size = { width: window.innerWidth, height: window.innerHeight, maxX: 20, minX: -20, maxY: 20, minY: 0, maxZ: 20, minZ: -20 }
const vertices = []
const offset = []
let particleCount=1000
const geometry = new THREE.BufferGeometry()
for (let i = 0; i < particleCount; i++) {
    const x = 1000 * (Math.random() - 0.5)
    const y = 600 * Math.random()
    const z = 1000 * (Math.random() - 0.5)

    vertices.push(x, y, z)
    offset.push(Math.random() - 0.5, 0, Math.random() - 0.5)
}
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
/**纹理*/
const texture = new THREE.TextureLoader().load(HOST + 'files/images/snow.png')
const pointMesh = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
        size: 5,
        depthTest: true,
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.8,
        sizeAttenuation: true
    })
)
// 创建一个控制对象
const params = {
    snowEnabled: true,  // 默认值为true
    snowAmount: 0.7
};

//后处理管理对象
const postprocessing = {}

// 添加GUI控制
const folder = gui.addFolder('调节参数');
// 添加checkbox
folder.add(params, 'snowEnabled').name('启用雪效果').onChange((value) => {
    params.snowEnabled = value;
});
folder.add(params, "snowAmount", 0, 1, 0.01).name('雪量').onChange((value) => {
    postprocessing.finalMaterial.uniforms.snowAmount.value = value;
});

// 初始化场景、相机、渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(0, 100, 300); // 明确设置相机初始位置
camera.lookAt(0, 0, 0); // 看向场景中心
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
scene.add(pointMesh);
// 添加性能监控
const stats = new Stats();
document.body.appendChild(stats.dom);
// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath(FILE_HOST + 'js/three/draco/')
gltfLoader.setDRACOLoader(dracoLoader)
//加载模型 使用私有对象存储带宽较低耐心等待一下
// "http://app.foxicle.xyz:9000/public-bucket/model/city/index.gltf"
gltfLoader.load(FILE_HOST + 'models/modern_city.glb', (gltf) => {
    gltf.scene.scale.set(0.01, 0.01, 0.01);
    scene.add(gltf.scene)
}, (event) => {
    const percentComplete = (event.loaded / event.total * 100).toFixed(2);
    console.log(`模型加载进度: ${percentComplete}%`);
});

initPostprocessing(window.innerWidth, window.innerHeight)

function updatePoints(){
    for (let i = 1; i < vertices.length; i += 3) {
        vertices[i] -= 0.5
        vertices[i - 1] -= offset[i - 1]
        vertices[i + 1] -= offset[i + 1]
        if (vertices[i] < 0) {
            vertices[i] = 600
        }

        if (vertices[i - 1] < size.minX || vertices[i - 1] > size.maxX) {
            offset[i - 1] = -offset[i - 1]
        }

        if (vertices[i + 1] < size.minZ || vertices[i + 1] > size.maxZ) {
            offset[i + 1] = -offset[i + 1]
        }
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=sceneSnowEffect) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [后期处理目录](/examples/three/effectComposer/)

> 后期处理 · Three.js
