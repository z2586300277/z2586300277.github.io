---
title: "蛛网箱子 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,蛛网箱子"
outline: deep
---

# 蛛网箱子

*Cobweb Box*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=cobwebBox)


![蛛网箱子](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/cobwebBox.jpg)


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

camera.position.set(0, 0, 5)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(box.clientWidth, box.clientHeight)

new OrbitControls(camera, renderer.domElement)
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
  uv-=.5;
  float r=length(uv);// 极径
  float a=atan(uv.x,uv.y);// 极角
  // a += u_time; // 旋转
  vec2 puv=vec2(a,r);// 转换为极坐标 puv.x 范围是 -pi ~ pi
  puv=vec2(puv.x/6.2831+.5,puv.y);// puv.x 范围是 0 ~ 1
  
  vec3 color=vec3(.0);
  // 圆圈
  float circular=fract(puv.y*12.);
  circular=smoothstep(.09,0.,circular);
  // 线
  float line=fract(puv.x*8.);
  line*=1.-line;
  line=line*3.;
  line=smoothstep(.05,0.,line);
  
  line+=circular;
  // line *= step(puv.y,0.5);
  line*=smoothstep(.0,.1,abs(puv.y ));
  color+=line;
  color-=smoothstep(.3,.5,abs(uv.y))+smoothstep(.3,.5,abs(uv.x));

  color *=vec3(0.08, 0.93, 0.11);
  gl_FragColor=vec4(color,1.);
}`

// 自定义材质
const material = new THREE.ShaderMaterial({
  fragmentShader: fragmentShader,
  vertexShader: vertexShader,
  uniforms: {
    uTime: { value: 0 },
  },
  // side: THREE.DoubleSide,
})

const geometry = new THREE.BoxGeometry(2, 2, 2)
const mesh = new THREE.Mesh(geometry, material) //网格模型对象Mesh

scene.add(mesh)

function animate() {
    requestAnimationFrame(animate)
    mesh.rotation.x += 0.02
    mesh.rotation.y += 0.02
    material.uniforms.uTime.value += 0.03
    renderer.render(scene, camera)
}
animate()
```

