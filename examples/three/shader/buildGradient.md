---
title: "建筑渐变 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,建筑渐变"
outline: deep
---
# 建筑渐变

*Building Gradient*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=buildGradient)

![建筑渐变](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/buildGradient.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环
- GUI 面板调试参数

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. 定义材质/shader 与 uniforms，rAF 中更新
4. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)
camera.position.set(1, 1, 1)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true , logarithmicDepthBuffer: true })
renderer.setSize(box.clientWidth, box.clientHeight)
renderer.setPixelRatio(window.devicePixelRatio)
box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        uniform vec3 uColorBottom;
        uniform vec3 uColorTop;
        uniform float uMinY;
        uniform float uMaxY;
        uniform float uTime;
        
        varying vec3 vColor;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
            // 设置UV坐标，类似原始着色器中的缩放方式
            vUv = vec2(position.x / 80.0, position.y / 250.0);
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            
            // 基础渐变效果
            float factor = smoothstep(uMinY, uMaxY, position.y);
            vColor = mix(uColorBottom, uColorTop, factor);
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
    fragmentShader: `
        uniform vec3 uColorBottom;
        uniform vec3 uColorTop;
        uniform vec3 uSweepColor;
        uniform float uTime;
        uniform vec3 uLightDir;
        uniform float uScanWidth;
        uniform float uScanSoftness;
        
        varying vec3 vColor;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        // 随机函数，与原始着色器相同
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        // 叠加混合函数 - 让扫描颜色与基础渐变叠加
        vec3 blendOverlay(vec3 base, vec3 blend) {
            vec3 result;
            result.r = (base.r < 0.5) ? (2.0 * base.r * blend.r) : (1.0 - 2.0 * (1.0 - base.r) * (1.0 - blend.r));
            result.g = (base.g < 0.5) ? (2.0 * base.g * blend.g) : (1.0 - 2.0 * (1.0 - base.g) * (1.0 - blend.g));
            result.b = (base.b < 0.5) ? (2.0 * base.b * blend.b) : (1.0 - 2.0 * (1.0 - base.b) * (1.0 - blend.b));
            return result;
        }
        
        void main() {
            // 基础颜色混合，基于Y坐标
            vec3 originColor = mix(uColorBottom, uColorTop, vUv.y);
            
            // 平滑的扫描波动效果
            float scanPos = fract(uTime * 0.2); // 扫描位置 (0-1循环)
            float scanLine = 1.0 - abs(vUv.y - scanPos) / uScanWidth;
            scanLine = smoothstep(0.0, uScanSoftness, scanLine);
            
            // 计算扫描颜色 - 简化处理，移除彩虹选项
            vec3 finalSweepColor = uSweepColor;
            
            // 添加轻微的噪声获得更自然的效果
            float noise = random(vUv * 10.0 + uTime * 0.1) * 0.03 + 0.97;
            
            // 计算最终扫描颜色
            vec3 sweepColor = finalSweepColor * noise;
            
            // 简化的光照效果
            float diffuse = dot(normalize(uLightDir), vNormal);
            diffuse = clamp(-diffuse, 0.0, 0.45);
            
            // 应用最终效果 - 使用叠加混合而非简单混合
            vec3 color = originColor;
            
            // 叠加混合扫描效果 - 根据扫描线强度
            vec3 overlayColor = blendOverlay(originColor, sweepColor);
            color = mix(color, overlayColor, scanLine * 0.8);
            
            // 添加额外的扫描光亮效果
            color += sweepColor * scanLine * 0.2;
            
            // 添加轻微边缘发光 - 也使用叠加效果
            float edge = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
            vec3 edgeColor = blendOverlay(originColor, sweepColor * edge);
            color = mix(color, edgeColor, edge * 0.3);
            
            // 添加发光效果
            vec3 emissive = vec3(diffuse) * 0.5;
            color += emissive;
            
            gl_FragColor = vec4(color, 1.0);
        }`,
    uniforms: {
        uColorBottom: { value: new THREE.Color(0x6373b6) },
        uColorTop: { value: new THREE.Color(0xffffff) },
        uSweepColor: { value: new THREE.Color(0xb1ddec) },
        uMinY: { value: 0.0 }, uMaxY: { value: 1.0 }, uTime: { value: 0.0 },
        uLightDir: { value: new THREE.Vector3(0.5, 0.5, 0.5).normalize() },
        uScanWidth: { value: 0.1 }, uScanSoftness: { value: 0.8 }
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=buildGradient) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
