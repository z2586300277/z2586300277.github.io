---
title: "雷达着色器 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,雷达着色器"
outline: deep
---
# 雷达着色器

*Radar Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=radarShader)

![雷达着色器](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/radarShader.jpg)

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
        fragmentShader: `
        #define SMOOTH(r,R) (1.0-smoothstep(R-1.0,R+1.0, r))
        #define RANGE(a,b,x) ( step(a,x)*(1.0-step(b,x)) )
        #define RS(a,b,x) ( smoothstep(a-1.0,a+1.0,x)*(1.0-smoothstep(b-1.0,b+1.0,x)) )
        #define M_PI 3.1415926535897932384626433832795

        #define blue1 vec3(0.74,0.95,1.00)
        #define blue2 vec3(0.87,0.98,1.00)
        #define blue3 vec3(0.35,0.76,0.83)
        #define blue4 vec3(0.953,0.969,0.89)
        #define red   vec3(1.00,0.38,0.227)

        #define MOV(a,b,c,d,t) (vec2(a*cos(t)+b*cos(0.1*(t)), c*sin(t)+d*cos(0.1*(t))))

        uniform float ratio;

        float PI = 3.1415926;
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 vUv;
        
        
        float movingLine(vec2 uv, vec2 center, float radius)
        {
            //angle of the line
            float theta0 = 90.0 * iTime;
            vec2 d = uv - center;
            float r = sqrt( dot( d, d ) );
            if(r<radius)
            {
                //compute the distance to the line theta=theta0
                vec2 p = radius*vec2(cos(theta0*M_PI/180.0),
                                    -sin(theta0*M_PI/180.0));
                float l = length( d - p*clamp( dot(d,p)/dot(p,p), 0.0, 1.0) );
                d = normalize(d);
                //compute gradient based on angle difference to theta0
                float theta = mod(180.0*atan(d.y,d.x)/M_PI+theta0,360.0);
                float gradient = clamp(1.0-theta/90.0,0.0,1.0);
                return SMOOTH(l,1.0)+0.5*gradient;
            }
            else return 0.0;
        }

        float circle(vec2 uv, vec2 center, float radius, float width)
        {
            float r = length(uv - center);
            return SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius);
        }

        float circle2(vec2 uv, vec2 center, float radius, float width, float opening)
        {
            vec2 d = uv - center;
            float r = sqrt( dot( d, d ) );
            d = normalize(d);
            if( abs(d.y) > opening )
                return SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius);
            else
                return 0.0;
        }
        float circle3(vec2 uv, vec2 center, float radius, float width)
        {
            vec2 d = uv - center;
            float r = sqrt( dot( d, d ) );
            d = normalize(d);
            float theta = 180.0*(atan(d.y,d.x)/M_PI);
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=radarShader) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
