---
title: "细胞 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,细胞"
outline: deep
---
# 细胞

*Cell Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=cellShader)

![细胞](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/cellShader.jpg)

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
        fragmentShader: `
        uniform float iTime;
		uniform sampler2D iChannel0;
		uniform vec2 iResolution; 
		varying vec2 iMouse;
		varying vec2 vUv;  
        
        #define NUM_RAYS 13.

    #define VOLUMETRIC_STEPS 19

    #define MAX_ITER 35
    #define FAR 6.

    #define time iTime*1.1

    mat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,-s,s,c);}
    float noise( in float x ){return texture2D(iChannel0, vec2(x*.01,1.),0.0).x;}

    float hash( float n ){return fract(sin(n)*43758.5453);}

    float noise(in vec3 p)
    {
        vec3 ip = floor(p);
        vec3 fp = fract(p);
        fp = fp*fp*(3.0-2.0*fp);
        
        vec2 tap = (ip.xy+vec2(37.0,17.0)*ip.z) + fp.xy;
        vec2 rg = texture2D( iChannel0, (tap + 0.5)/256.0, 0.0 ).yx;
        return mix(rg.x, rg.y, fp.z);
    }

    mat3 m3 = mat3( 0.00,  0.80,  0.60,
                -0.80,  0.36, -0.48,
                -0.60, -0.48,  0.64 );

    //See: https://www.shadertoy.com/view/XdfXRj
    float flow(in vec3 p, in float t)
    {
        float z=2.;
        float rz = 0.;
        vec3 bp = p;
        for (float i= 1.;i < 5.;i++ )
        {
            p += time*.1;
            rz+= (sin(noise(p+t*0.8)*6.)*0.5+0.5) /z;
            p = mix(bp,p,0.6);
            z *= 2.;
            p *= 2.01;
            p*= m3;
        }
        return rz;	
    }

    //could be improved
    float sins(in float x)
    {
        float rz = 0.;
        float z = 2.;
        for (float i= 0.;i < 3.;i++ )
        {
            rz += abs(fract(x*1.4)-0.5)/z;
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=cellShader) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
