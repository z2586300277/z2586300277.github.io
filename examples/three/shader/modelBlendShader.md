---
title: "模型混合着色器 - Three.js 案例讲解"
description: "Three.js 片元/顶点着色器改颜色与形变。主流程在 `animate`、`modelBlendShader`。"
head:
  - - meta
    - name: keywords
      content: "three.js,模型混合着色器"
outline: deep
---

# 模型混合着色器

*Model Blend*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=modelBlendShader)


![模型混合着色器](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/modelBlendShader.jpg)


## 效果说明

Three.js 片元/顶点着色器改颜色与形变。主流程在 `animate`、`modelBlendShader`。

> 着色器 · Three.js

## 实现思路

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- 混合着色

## 独立函数

- `animate()` — rAF：update controls + render
- `modelBlendShader()` — 材质 / GLSL

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(3, 3, 3)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

scene.add(new THREE.AmbientLight(0xffffff, 3))

scene.add(new THREE.AxesHelper(1000))

let car = null

const loader = new GLTFLoader()

loader.setDRACOLoader(new DRACOLoader().setDecoderPath(FILE_HOST + 'js/three/draco/'))

loader.load(

    HOST + '/files/model/car.glb',

    gltf => {

        car = gltf.scene

        scene.add(car)

        modelBlendShader(car, box)

    }

)

animate()

function animate() {

    requestAnimationFrame(animate)

    c
```

### 混合着色

```js
function modelBlendShader(model, DOM) {

    let materials = []

    model.traverse(c => c.isMesh && materials.push(c.material))

    materials = [... new Set(materials)]

    const uniforms = {

        iResolution: {
            type: 'v2',
            value: new THREE.Vector2(DOM.clientWidth, DOM.clientHeight)
        },

        iTime: {
            type: 'f',
            value: 1.0
        }

    }

    materials.forEach(material => {

        material.onBeforeCompile = shader => {

            shader.uniforms.iResolution = uniforms.iResolution

            shader.uniforms.iTime = uniforms.iTime

            shader.fragmentShader = shader.fragmentShader.replace(/#include <common>/, `
                uniform vec2 iResolution;
                uniform float iTime;
                #include <common> 
            `)

            shader.fragmentShader = shader.fragmentShader.replace('vec4 diffuseColor = vec4( diffuse, opacity );', `
                vec3 c;
                float l,z=iTime;
                for(int i=0;i<3;i++) {
                    vec2 uv,p=gl_FragCoord.xy/iResolution/2.0;
                    uv=p +  2.0;
                    p-=.5;
                    p.x*=iResolution.x/iResolution.y;
                    z+=.07;
                    l=length(p);
                    uv+=p/l*(sin(z)+1.)*abs(sin(l*9.-z-z));
              
```

