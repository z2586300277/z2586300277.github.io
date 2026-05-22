---
title: "模型反射效果 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Reflector`。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,expand,模型反射效果"
outline: deep
---
# 模型反射效果

*Model Blend*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=modelBlendReflector)

![模型反射效果](https://z2586300277.github.io/three-cesium-examples/threeExamples/expand/modelBlendReflector.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 实时阴影 ShadowMap
- 水面 / 反射面效果

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Reflector`。

> 扩展功能 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- 阴影四步：`renderer.shadowMap.enabled`、光源 `castShadow`、物体 `castShadow`、地面 `receiveShadow`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. 定义材质/shader 与 uniforms，rAF 中更新
4. rAF 循环中 update 并 render

## 代码要点

- **`addReflectorEffect()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(2, 1, 3)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

new GLTFLoader().setDRACOLoader(new DRACOLoader().setDecoderPath(FILE_HOST + 'js/three/draco/')).load(HOST + '/files/model/car.glb', gltf => scene.add(gltf.scene))

const pointLight = new THREE.PointLight(0xffffff, 0.5, 0, 0)

pointLight.position.set(0, 10, 0)

scene.add(pointLight)

const AmbientLight = new THREE.AmbientLight(0xffffff, 0.5)

scene.add(AmbientLight)

animate()

function animate() {

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

import {
    Color,
    Matrix4,
    Mesh,
    PerspectiveCamera,
    Plane,
    ShaderMaterial,
    UniformsUtils,
    Vector3,
    Vector4,
    WebGLRenderTarget,
    HalfFloatType,
} from "three";

class Reflector extends Mesh {
    constructor(geometry, options = {}) {
        super(geometry);

        this.isReflector = true;

        this.type = "Reflector";
        this.camera = new PerspectiveCamera();

        const scope = this;

        const color =
            options.color !== undefined
                ? new Color(options.color)
                : new Color(0x7f7f7f);
        const textureWidth = options.textureWidth || 512;
        const textureHeight = options.textureHeight || 512;
        const clipBias = options.clipBias || 0;
        const shader = options.shader || Reflector.ReflectorShader;
        const multisample =
            options.multisample !== undefined ? options.multisample : 4;

        //

        const reflectorPlane = new Plane();
        const normal = new Vector3();
        const reflectorWorldPosition = new Vector3();
        const cameraWorldPosition = new Vector3();
        const rotationMatrix = new Matrix4();
        const lookAtPosition = new Vector3(0, 0, -1);
        const clipPlane = new Vector4();

        const view = new Vector3();
        const target = new Vector3();
        const q = new Vector4();

        const textureMatrix = new Matrix4();
        const virtualCamera = this.camera;

        const renderTarget = new WebGLRenderTarget(
            textureWidth,
            textureHeight,
            { samples: multisample, type: HalfFloatType }
        );

        const material = new ShaderMaterial({
            name: shader.name !== undefined ? shader.name : "unspecified",
            uniforms: UniformsUtils.clone(shader.uniforms),
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            transparent: true,
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=modelBlendReflector) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [扩展功能目录](/examples/three/expand/)

> 扩展功能 · Three.js
