---
title: "生成模型底座 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,生成模型底座"
outline: deep
---
# 生成模型底座

*Model Base*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=application&id=model_base)

![生成模型底座](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/model_base.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 相机交互控制器
- 天空盒与环境贴图
- requestAnimationFrame 渲染循环

## 效果说明

Three.js 业务向场景组合。

> 应用场景 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. rAF 循环中 update 并 render

## 代码要点

- **`animationLoop()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`add_model_base()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
const DOM = document.getElementById('box')

var scene = new THREE.Scene();
scene.background = new THREE.Color('gainsboro');

var camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight);
camera.position.set(0, 4, 4);
camera.lookAt(scene.position);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setAnimationLoop(animationLoop);

function animationLoop() {
    renderer.render(scene, camera);
}
DOM.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});

var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;

var light = new THREE.DirectionalLight('white', 3);
light.position.set(1, 1, 1);
scene.add(light);

let group

const loader = new GLTFLoader()

loader.setDRACOLoader(new DRACOLoader().setDecoderPath(FILE_HOST + 'js/three/draco/'))

loader.load(

    HOST + '/files/model/car.glb',

    function (gltf) {

        group = gltf.scene

        scene.add(group)
        add_model_base()
    }

)

// 模型底座
function add_model_base(){
    const box = new THREE.Box3()
    box.setFromObject(group)
    // const helper = new THREE.Box3Helper(box)
    // scene.add(helper)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const shape = new  THREE.Shape()
    shape.moveTo(center.x,center.z)
    // 底座大小在这控制 这里取半径的根号2倍
    let radius = Math.max(size.x,size.z) / 2 * Math.sqrt(2)
    shape.arc(0,0,radius,0,Math.PI * 2)
    let m = new THREE.MeshBasicMaterial({color:'red',side:2})
    const geo = new THREE.ShapeGeometry(shape,32)
    const mesh = new THREE.Mesh(geo,m)
    geo.center()
    mesh.rotateX(-Math.PI / 2)
    scene.add(mesh)
}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=application&id=model_base) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
