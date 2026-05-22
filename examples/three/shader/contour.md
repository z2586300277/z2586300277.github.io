---
title: "魔幻山体 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,魔幻山体"
outline: deep
---
# 魔幻山体

*Contour*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=contour)

![魔幻山体](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/contour.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 天空盒与环境贴图
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 魔幻山体-等高线示意
const box = document.getElementById("box");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0.5, 1, 0.875);
scene.fog = new THREE.Fog(scene.background, 20, 45);
const camera = new THREE.PerspectiveCamera(
    75,
    box.clientWidth / box.clientHeight,
    0.1,
    1000,
);
camera.position.set(0, 10, 10);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(box.clientWidth, box.clientHeight);
box.appendChild(renderer.domElement);
new OrbitControls(camera, renderer.domElement);
window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight);
    camera.aspect = box.clientWidth / box.clientHeight;
    camera.updateProjectionMatrix();
};

animate();
function animate() {
    // uniforms.iTime.value += 0.01
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

//  添加一个plane
import { Clock, DoubleSide, Mesh, PlaneGeometry, ShaderMaterial } from 'three'
const add_plane = () => {
    const clock = new Clock();
    const planeGeometry = new PlaneGeometry(50, 50, 500, 500);
    planeGeometry.rotateX(-Math.PI / 2)
    let uniforms = {
        u_time: {
            value: clock.getDelta()
        }
    }
    // shader material
    const vertexShader = `

        vec3 hash(vec3 p) {
            p = vec3( dot(p, vec3(127.1, 311.7, 74.7)),
            dot(p, vec3(269.5, 183.3, 246.1)),
            dot(p, vec3(113.5, 271.9, 124.6)));
            return fract(sin(p) * 43758.5453123);
        }
            // returns 3D value noise
        float noise( in vec3 x )
        {
            // grid
            vec3 p = floor(x);
            vec3 w = fract(x);
            // quintic interpolant
            vec3 u = w*w*w*(w*(w*6.0-15.0)+10.0);
            // gradients
            vec3 ga = hash( p+vec3(0.0,0.0,0.0) );
            vec3 gb = hash( p+vec3(1.0,0.0,0.0) );
            vec3 gc = hash( p+vec3(0.0,1.0,0.0) );
            vec3 gd = hash( p+vec3(1.0,1.0,0.0) );
            vec3 ge = hash( p+vec3(0.0,0.0,1.0) );
            vec3 gf = hash( p+vec3(1.0,0.0,1.0) );
            vec3 gg = hash( p+vec3(0.0,1.0,1.0) );
            vec3 gh = hash( p+vec3(1.0,1.0,1.0) );
            // projections
            float va = dot( ga, w-vec3(0.0,0.0,0.0) );
            float vb = dot( gb, w-vec3(1.0,0.0,0.0) );
            float vc = dot( gc, w-vec3(0.0,1.0,0.0) );
            float vd = dot( gd, w-vec3(1.0,1.0,0.0) );
            float ve = dot( ge, w-vec3(0.0,0.0,1.0) );
            float vf = dot( gf, w-vec3(1.0,0.0,1.0) );
            float vg = dot( gg, w-vec3(0.0,1.0,1.0) );
            float vh = dot( gh, w-vec3(1.0,1.0,1.0) );
            // interpolation
            return va +
            u.x*(vb-va) +
            u.y*(vc-va) +
            u.z*(ve-va) +
            u.x*u.y*(va-vb-vc+vd) +
            u.y*u.z*(va-vc-ve+vg) +
            u.z*u.x*(va-vb-ve+vf) +
            u.x*u.y*u.z*(-va+vb+vc-vd+ve-vf-vg+vh);
        }
        varying vec2 v_uv;
        varying float v_y;
        void main(){
            v_uv = uv;
            float noise_value = noise(position);
            float y = noise_value;
            y = pow(y,3.);
            vec3 in_position = position;
            in_position.y = v_y = min(y*35.,15.)*2.;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( in_position, 1.0 );
        }
    `
    const fragmentShader = `
        uniform float u_time;
        varying float v_y;
        varying vec2 v_uv;
        void main(){
            gl_FragColor = vec4(v_uv.x,sin(v_y*100.*u_time),0.5,1.);
        }
    `
    const shaderMaterial = new ShaderMaterial({
        vertexShader, fragmentShader, side: DoubleSide, uniforms
    })
    function animate() {
        uniforms.u_time.value = clock.getElapsedTime()*0.01;
        requestAnimationFrame(animate)
    }
    animate()

    const mesh = new Mesh(planeGeometry, shaderMaterial)
    scene.add(mesh)
    return mesh;
}
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=contour) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
