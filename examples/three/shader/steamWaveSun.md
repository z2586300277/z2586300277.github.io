---
title: "蒸汽波太阳 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,蒸汽波太阳"
outline: deep
---
# 蒸汽波太阳

*Steam Sun*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=steamWaveSun)

![蒸汽波太阳](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/steamWaveSun.jpg)

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

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 2)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(box.clientWidth, box.clientHeight)

window.onresize = () => {

  renderer.setSize(box.clientWidth, box.clientHeight)

  camera.aspect = box.clientWidth / box.clientHeight

  camera.updateProjectionMatrix()
  
}

box.appendChild(renderer.domElement)

/* 顶点着色器 */
const vertexShader = `
varying vec2 vUv;
void main(){
	vec4 mPosition=modelMatrix*vec4(position,1.);
	gl_Position=projectionMatrix*viewMatrix*mPosition;
	vUv = uv;
}`

/* 片元着色器 */
const fragmentShader = `
varying vec2 vUv;
uniform float uTime;

void main(){
  vec2 uv=vUv;
  float circular=length(uv-vec2(.5));
  circular=smoothstep(.3,.29,circular);
  vec3 color=vec3(0.);
  vec3 sumCol=mix(vec3(4.,0.,.2),vec3(1.,1.1,0.),uv.y);
  // 递减值
  float decreasing=(-uv.y+.3);
  uv.y +=uTime/10.;
  float line=fract(uv.y*20.);
  line=abs(line-.5);
  line-=decreasing;
  line=step(line,.2);
  color+=circular*sumCol*(1.-line);
  gl_FragColor=vec4(color,1.);
}`

// 自定义材质
const material = new THREE.ShaderMaterial({
  fragmentShader: fragmentShader,
  vertexShader: vertexShader,
  uniforms: {
    uTime: { value: 0 },
  },
  side: THREE.DoubleSide,
})

const geometry = new THREE.PlaneGeometry(2, 2)
const mesh = new THREE.Mesh(geometry, material) //网格模型对象Mesh

scene.add(mesh)

function animate() {
    requestAnimationFrame(animate)
    material.uniforms.uTime.value += 0.03
    renderer.render(scene, camera)
}
animate()
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=steamWaveSun) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
