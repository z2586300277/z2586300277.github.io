---
title: "波浪效果 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,波浪效果"
outline: deep
---
# 波浪效果

*Water Effect*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=waterA)

![波浪效果](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/waterA.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环
- GUI 面板调试参数

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
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js' 
import * as dat from 'dat.gui'
const gui = new dat.GUI();

const box = document.getElementById("box");

// 假设typeState已经被定义
const typeState = {
  color: "#0670c1",
  speed: 0.1,
  brightness: 1.5,
  flowSpeed: { x: 0.01, y: 0.01 },
};

let vertexShader = `// Examples of variables passed from vertex to fragment shader
varying vec2 vUv;

void main(){
	// To pass variables to the fragment shader, you assign them here in the
	// main function. Traditionally you name the varying with vAttributeName
	vUv=uv;
	
	// This sets the position of the vertex in 3d space. The correct math is
	// provided below to take into account camera and object data.
	gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}`;
let fragmentShader = `#define TAU 6.28318530718
#define MAX_ITER 5

uniform vec2 resolution;
uniform vec3 backgroundColor;
uniform vec3 color;
uniform float speed;
uniform vec2 flowSpeed;
uniform float brightness;
uniform float time;

varying vec2 vUv;

void main(){
	vec2 uv=(vUv.xy+(time*flowSpeed))*resolution;
	
	vec2 p=mod(uv*TAU,TAU)-250.;
	vec2 i=vec2(p);
	
	float c=1.;
	float inten=.005;
	
	for(int n=0;n<MAX_ITER;n++){
		float t=time*speed*(1.-(3.5/float(n+1)));
		i=p+vec2(cos(t-i.x)+sin(t+i.y),sin(t-i.y)+cos(t+i.x));
		c+=1./length(vec2(p.x/(sin(i.x+t)/inten),p.y/(cos(i.y+t)/inten)));
	}
	
	c/=float(MAX_ITER);
	c=1.17-pow(c,brightness);
	
	vec3 rgb=vec3(pow(abs(c),8.));
	
	gl_FragColor=vec4(rgb*color+backgroundColor,length(rgb)+.1);
}`;

// 创建场景
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
camera.position.set(15, 15, 15);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(box.clientWidth, box.clientHeight);
renderer.setClearColor("#201919"); 
box.appendChild(renderer.domElement);
// 添加环境光
const ambientLight = new THREE.AmbientLight(0x0a0a0a0);
scene.add(ambientLight);

// 创建控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 创建平面几何体
const geometry = new THREE.PlaneGeometry(10, 10);

// 创建着色器材质
const material = new THREE.ShaderMaterial({
  uniforms: {
    resolution: { value: new THREE.Vector2(1, 1) },
    backgroundColor: { value: new THREE.Color("#0670c1") },
    color: { value: new THREE.Color("#fff") },
    speed: { value: 0.1 },
    flowSpeed: { value: new THREE.Vector2(0.01, 0.01) },
    brightness: { value: 1.5 },
    time: { value: 0.1 },
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide,
  transparent: true,
  depthWrite: false,
  depthTest: true,
});

// 创建网格
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
// 设置网格的旋转，注意Three.js中旋转的单位是弧度
mesh.rotation.x = -Math.PI / 2; // 将x轴旋转-90度

// 设置网格的位置，这里设置y坐标为1
mesh.position.y = 1;

// 添加辅助网格
const gridHelper = new THREE.GridHelper(10, 10);
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=waterA) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
