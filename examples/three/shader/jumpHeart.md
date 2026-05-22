---
title: "跳动的心 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,跳动的心"
outline: deep
---
# 跳动的心

*Jump Heart*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=jumpHeart)

![跳动的心](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/jumpHeart.jpg)

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
camera.position.set(0, 0, 10)
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
        uniform float iTime; 
		uniform vec2 iResolution;  
		varying vec2 vUv;  
         
        void main(void) {
            vec2 p = (vUv - 0.5 ) * 2.0;
            // vec2 p = (2.0*fragCoord-iResolution.xy)/min(iResolution.y,iResolution.x);
	
            // background color
            vec3 bcol = vec3(1.0,0.8,0.7-0.07*p.y)*(1.0-0.25*length(p));
        
            // animate
            float tt = mod(iTime,1.5)/1.5;
            float ss = pow(tt,.2)*0.5 + 0.5;
            ss = 1.0 + ss*0.5*sin(tt*6.2831*3.0 + p.y*0.5)*exp(-tt*4.0);
            p *= vec2(0.5,1.5) + ss*vec2(0.5,-0.5);
        
            // shape
        #if 0
            p *= 0.8;
            p.y = -0.1 - p.y*1.2 + abs(p.x)*(1.0-abs(p.x));
            float r = length(p);
            float d = 0.5;
        #else
            p.y -= 0.25;
            float a = atan(p.x,p.y)/3.141593;
            float r = length(p);
            float h = abs(a);
            float d = (13.0*h - 22.0*h*h + 10.0*h*h*h)/(6.0-5.0*h);
        #endif
            
            // color
            float s = 0.75 + 0.75*p.x;
            s *= 1.0-0.4*r;
            s = 0.3 + 0.7*s;
            s *= 0.5+0.5*pow( 1.0-clamp(r/d, 0.0, 1.0 ), 0.1 );
            vec3 hcol = vec3(1.0,0.4*r,0.3)*s;
            
            vec3 col = mix( bcol, hcol, smoothstep( -0.01, 0.01, d-r) );
        
            gl_FragColor = vec4(col,1.0);
	        // gl_FragColor = vec4(col*1.3, 1.0);
        }
        `
    })
    const mesh = new THREE.Mesh(geometry, material);

    return {
        mesh,
        uniforms
    }
}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=jumpHeart) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
