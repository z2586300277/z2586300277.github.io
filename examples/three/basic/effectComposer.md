---
title: "渲染器配置 - Three.js 案例讲解"
description: "原场景 + 后期 Pass 叠加。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,basic,渲染器配置"
outline: deep
---
# 渲染器配置

*Effect Composer*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=effectComposer)

![渲染器配置](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/effectComposer.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- EffectComposer 后期处理管线
- 相机交互控制器
- 天空盒与环境贴图
- 轮廓高亮 OutlinePass

## 效果说明

原场景 + 后期 Pass 叠加。

> 基础案例 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **EffectComposer** 多 Pass 链式渲染：RenderPass → 特效 Pass → 输出屏幕。`composer.render()` 替代 `renderer.render()`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. EffectComposer 组装 Pass 链并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { GUI } from 'dat.gui'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(40, box.clientWidth / box.clientHeight, 0.1, 100000)
camera.position.set(5, 2, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(box.clientWidth, box.clientHeight)
renderer.setClearColor(0xbfe3dd, 1)
box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera)
composer.addPass(renderPass);

const outputPass = new OutputPass()
composer.addPass(outputPass)

const data = { renderType: 'effect' }

const ToneMappingList = {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
    AgX: THREE.AgXToneMapping,
    Neutral: THREE.NeutralToneMapping,
    Custom: THREE.CustomToneMapping
}

const gui = new GUI()
gui.add(renderer, 'outputColorSpace', [THREE.SRGBColorSpace, THREE.LinearSRGBColorSpace])
gui.add(renderer, 'toneMapping', Object.keys(ToneMappingList)).onChange(value => renderer.toneMapping = ToneMappingList[value])
gui.add(renderer, 'toneMappingExposure', 0, 10)
gui.add(data, 'renderType', ['effect', 'normal', 'both'])
gui.add(outputPass, 'enabled').name('OutputPass_enabled')

animate()

function animate() {

    controls.update()
    if (data.renderType === 'effect') composer.render()
    else if (data.renderType === 'normal') renderer.render(scene, camera)
    else {
        renderer.render(scene, camera)
        composer.render()
    }
    requestAnimationFrame(animate)

}

const loader = new GLTFLoader()
loader.setDRACOLoader(new DRACOLoader().setDecoderPath(FILE_HOST + 'js/three/draco/'))
loader.load(
    FILE_HOST + '/files/model/LittlestTokyo.glb',
    gltf => {
        gltf.scene.position.set(1, 1, 0);
        gltf.scene.scale.set(0.01, 0.01, 0.01);
        scene.add(gltf.scene)
    }
)
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=effectComposer) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础案例目录](/examples/three/basic/)

> 基础案例 · Three.js
