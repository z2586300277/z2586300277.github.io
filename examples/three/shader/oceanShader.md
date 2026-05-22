---
title: "海面 - Three.js 案例讲解"
description: "Three.js 片元/顶点着色器改颜色与形变。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,海面"
outline: deep
---
# 海面

*Ocean Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=oceanShader)

![海面](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/oceanShader.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 相机交互控制器
- 天空盒与环境贴图
- 水面 / 反射面效果
- requestAnimationFrame 渲染循环

## 效果说明

Three.js 片元/顶点着色器改颜色与形变。

> 着色器 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

- **Reflector/Water** 基于 renderTarget 的平面反射或动态水面法线。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Water } from 'three/examples/jsm/objects/Water.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000000)

camera.position.set(6, 3, 15)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

const water = new Water(
    waterGeometry,
    {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load(  FILE_HOST +  '/images/texture/waternormals.jpg', function (texture) {
          
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

        }),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined
    }
);

water.rotation.x = - Math.PI / 2;

scene.add(water);

// 文件地址
const urls = [0, 1, 2, 3, 4, 5].map(k => (FILE_HOST + 'files/sky/skyBox0/' + (k + 1) + '.png'));

const textureCube = new THREE.CubeTextureLoader().load(urls);

scene.background = textureCube;

new GLTFLoader().load('https://z2586300277.github.io/3d-file-server/models/glb/wajueji.glb',

    gltf => {

        gltf.scene.traverse(child => {

            if (child.isMesh) {

                child.material.envMap = textureCube

            }

        })

        scene.add(gltf.scene)

    }

)

const gui = new GUI();

gui.addColor(water.material.uniforms['waterColor'], 'value').name('waterColor');

gui.addColor(water.material.uniforms['sunColor'], 'value').name('sunColor');

gui.add(water.material.uniforms['sunDirection'].value, 'x', - 1, 1).name('sunX');

animate()

function animate() {

    water.material.uniforms['time'].value += 1.0 / 60.0;

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=oceanShader) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
