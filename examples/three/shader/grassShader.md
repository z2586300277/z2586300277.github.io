---
title: "草地着色器 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`、`interpolate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,草地着色器"
outline: deep
---

# 草地着色器

*Grass Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=grassShader)


![草地着色器](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/grassShader.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`、`interpolate`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
uniform float uTime;
      uniform float offsetX;
      uniform float offsetY;
    
      varying vec3 vPosition;
      varying vec2 vUv;
      varying vec3 vNormal;
    
      float wave(float waveSize, float tipDistance, float centerDistance) {
        // Tip is the fifth vertex drawn per blade
        bool isTip = (gl_VertexID + 1) % 5 == 0;
    
        float waveDistance = isTip ? tipDistance : centerDistance;
        return sin((uTime / 500.0) + waveSize) * waveDistance;
      }
    
      void main() {
        vPosition = position;
        vUv = uv;
        
        
```

### 片元

- 片元输出 gl_FragColor
- `time` uniform 驱动动画

```glsl
uniform sampler2D uCloud;
      uniform float uTime;
      varying vec3 vPosition;
      varying vec2 vUv;
      varying vec3 vNormal;
    
      vec3 green = vec3(0.2, 0.6, 0.3);
    
      void main() {
        vec3 color = mix(green * 0.7, green, vPosition.y);
        color = mix(color, texture2D(uCloud, vUv).rgb, 0.4);
        float lighting = normalize(dot(vNormal, vec3(10)));
        gl_FragColor = vec4(color + lighting * 0.03, 1.0);
      }
```

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 10, 10)
const renderer = new THREE.WebGLRenderer({ antialias: true , alpha: true, logarithmicDepthBuffer: true})
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)
new OrbitControls(camera, renderer.domElement)
window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()
}
scene.background = new THREE.CubeTextureLoader().load([0, 1, 2, 3, 4, 5].map(k => (FILE_HOST + 'files/sky/skyBox0/' + (k + 1) + '.png')));

let grass = null
animate()
function animate(time) {
   if(grass) grass.update(time);
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

const BLADE_WIDTH = 0.1
const BLADE_HEIGHT = 0.8
const BLADE_HEIGHT_VARIATION = 0.6
const BLADE_VERTEX_COUNT = 5
const BLADE_TIP_OFFSET = 0.1

function interpolate(val, oldMin, oldMax, newMin, newMax) {
  return ((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin
}

class GrassGeometry extends THREE.BufferGeometry {
  constr
```

