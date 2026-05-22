---
title: "模型反射效果 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Reflector`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,模型反射效果,扩展功能"
outline: deep
---

# 模型反射效果

*Model Blend*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=modelBlendReflector)


![模型反射效果](https://z2586300277.github.io/three-cesium-examples/threeExamples/expand/modelBlendReflector.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Reflector`。

> 扩展功能 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- glsl

## 类与方法

### Reflector

- `constructor()` — 参数：geometry, options = {}

## 独立函数

- `animate()` — rAF：update controls + render
- `addReflectorEffect()` — 材质 / GLSL

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

    camera.aspect = box.clientWidth / box.clientHei
```

### glsl

```js
`
		uniform mat4 textureMatrix;
		varying vec4 vUv;

		#include <common>
		#include <logdepthbuf_pars_vertex>

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			#include <logdepthbuf_vertex>

		}`,

    fragmentShader:
```

### glsl

```js
`
		uniform vec3 color;
		uniform float _opacity;
		uniform sampler2D tDiffuse;
		varying vec4 vUv;

		#include <logdepthbuf_pars_fragment>

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			#include <logdepthbuf_fragment>

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( base.rgb , 0.1 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`,
};

/**
 * @description: 为mesh的材质增加反光效果
 * @param {*} mesh
 * @return {*}
 */
function addReflectorEffect(mesh, options = { filter: [] }) {
    const material = mesh.material;

    // material.isReflector = true;

    // material.type = "Reflector";
    const camera = new PerspectiveCamera();

    const textureWidth = options.textureWidth || 512;
    const textureHeight = options.textureHeight || 512;
    const clipBias = options.clipBias || 0;
    const shader = options.shader || Reflector.ReflectorShader;
    const multisample =
        options.multisample !== undefined ? options.multisample : 4;

    const reflectorPlane = new Plane();
    const 
```

