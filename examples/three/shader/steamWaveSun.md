---
title: "蒸汽波太阳 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,蒸汽波太阳"
outline: deep
---

# 蒸汽波太阳

*Steam Sun*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=steamWaveSun)


![蒸汽波太阳](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/steamWaveSun.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- 顶点着色器
- 片元着色器

## 独立函数

- `animate()` — rAF：update controls + render

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
```

### 顶点着色器

```js
const vertexShader = `
varying vec2 vUv;
void main(){
	vec4 mPosition=modelMatrix*vec4(position,1.);
	gl_Position=projectionMatrix*viewMatrix*mPosition;
	vUv = uv;
}`
```

### 片元着色器

```js
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

