---
title: "发散着色器 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,发散着色器"
outline: deep
---
# 发散着色器

*Emit Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=emitShader)

![发散着色器](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/emitShader.jpg)

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

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 10, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

const boxGeometry = new THREE.BoxGeometry(6, 6, 6);

const vertexShader = `
void main() {
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}
`
const fragmentShader = `
uniform vec2 u_resolution;
uniform float iTime;
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.283185*(c*t+d) );
}
void main() {
      vec3 finalcol = vec3(0.0);
    vec2 uv = (gl_FragCoord.xy * 2. - u_resolution.xy) / u_resolution.y;
    vec2 uv0 = uv;
    for (float i = 0.0; i < 3.0; i++) {
       
        uv = fract(uv*5.5)-0.5;
        vec3 col = palette(length(uv0)+iTime,vec3(0.768, 0.648, 1.0), vec3(-0.252, -0.082, 0.0), vec3(0.5, 0.5, 0.0), vec3(0.5, 0.0, 0.0));
        
        float d = length(uv) * exp(-length(uv0));

        d = sin(d*8. + iTime)/8.;
        d = abs(d);

        d = pow(0.01 / d, 1.2);
        
        finalcol += col * d;
    }
    gl_FragColor = vec4(finalcol, 1.0);
}
`

const boxMaterial = new THREE.ShaderMaterial({
    uniforms: {
        u_resolution: { value: new THREE.Vector2(box.clientWidth, box.clientHeight) },
        iTime: { value: 0 }
    },
    vertexShader,
    fragmentShader
});

const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

scene.add(boxMesh);

animate()

function animate() {

    boxMaterial.uniforms.iTime.value += 0.01

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

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=emitShader) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
