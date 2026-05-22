---
title: "乌云 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,乌云"
outline: deep
---
# 乌云

*Dark Clouds*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=darkClouds)

![乌云](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/darkClouds.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`getShaderMesh()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 10, 10)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)
new OrbitControls(camera, renderer.domElement)
scene.add(new THREE.AxesHelper(50000))
window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()
}

const { mesh, uniforms } = getShaderMesh()
scene.add(mesh)

animate()
function animate() {
    uniforms.iTime.value += 0.01
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

function getShaderMesh() {
    const uniforms = {
        iTime: {
            value: 0
        },
        iResolution: {
            value: new THREE.Vector2(1900, 1900)
        },
        iChannel0: {
            value: window.iChannel0
        }
    }
    const geometry = new THREE.PlaneGeometry(20, 20);
    const material = new THREE.ShaderMaterial({
        uniforms,
        side: 2,
        depthWrite: false,
        transparent: true,
        vertexShader: `
            varying vec3 vPosition;
            varying vec2 vUv;
            void main() { 
                vUv = uv; 
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `   precision highp float;
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 vUv;

        
vec3 rY(vec3 p, float a) {
    vec3 q = p;
    float c = cos(a);
    float s = sin(a);
    q.x = c * p.x + s * p.z;
    q.z = -s * p.x + c * p.z;
    
    return q;
}

// returns a pair of values for the distances along the ray at which there are sphere intersections, or 0 if none
vec2 sphereIntersectionDistances(vec3 rayOrigin, vec3 rayDirection, vec3 sphereOrigin, float sphereRadius) {
    vec3 toCenter = sphereOrigin - rayOrigin;
    float toCenterAlongRay = dot(toCenter, rayDirection);
    
    float perpendicularDistanceSquared = dot(toCenter, toCenter) - toCenterAlongRay * toCenterAlongRay;
    float radiusSquared = sphereRadius * sphereRadius;
    
    if (perpendicularDistanceSquared > radiusSquared) { // ray doesn’t touch the sphere
        return vec2(0.);
    }
    
    float insideSphereAlongRay = sqrt(radiusSquared - perpendicularDistanceSquared); // half the length of the portion of the ray inside the sphere
    
    float intersection1 = toCenterAlongRay - insideSphereAlongRay;
    float intersection2 = toCenterAlongRay + insideSphereAlongRay;
    if (intersection1 > intersection2) {
        float t = intersection1;
        intersection1 = intersection2;
        intersection2 = t;
    }
    
    if (intersection1 < 0.) { // first intersection is before the start of the ray
        if (intersection2 < 0.) { // ditto second, though that… shouldn’t happen?
            return vec2(0.);
        } else {
            intersection1 = intersection2;
            intersection2 = 0.;
        }
    }
    
    return vec2(intersection1, intersection2);
}

// -----------------

// 3d noise by iq, from https://www.shadertoy.com/view/Xsl3Dl

// The MIT License
// Copyright © 2013 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

vec3 hash( vec3 p )
{
	p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
			  dot(p,vec3(269.5,183.3,246.1)),
			  dot(p,vec3(113.5,271.9,124.6)));

// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=darkClouds) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
