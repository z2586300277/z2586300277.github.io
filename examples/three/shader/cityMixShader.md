---
title: "城市混合Shader - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,城市混合Shader"
outline: deep
---
# 城市混合Shader

*CityMixShader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=cityMixShader)

![城市混合Shader](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/cityMixShader.jpg)

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

## 代码要点

- **`modelBlendShader()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`setupGUI()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { GUI } from 'dat.gui'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(150, 150, -700)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

renderer.setClearColor(0x000000, 0)

renderer.setPixelRatio(window.devicePixelRatio * 2)

new OrbitControls(camera, renderer.domElement)

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

box.appendChild(renderer.domElement)

const dirLight = new THREE.DirectionalLight(0xffffff, 3.8)

dirLight.position.set(83, 61, -183)

dirLight.target.position.set(10, -11, -194)

scene.add(dirLight, new THREE.AmbientLight(0xffffff, 2))

let model = null

// 加载模型
new FBXLoader().load(HOST + '/files/model/city.FBX', (object3d) => {

    scene.add(object3d)

    object3d.scale.set(0.04, 0.04, 0.04)

    object3d.position.set(224, -9, -49)

    model = object3d

    modelBlendShader(object3d, box)

})

// 渲染
animate()

function animate() {
    const time = performance.now() * 0.001; // 添加时间参数
    
    model && model.render?.(time)

    renderer.render(scene, camera)

    requestAnimationFrame(animate)
}

/* 新光线行进着色器实现 */
function modelBlendShader(model) {
    let materials = []
    
    model.traverse(c => c.isMesh && materials.push(c.material))
    
    materials = [... new Set(materials)]
    
    // 创建控制参数对象
    const params = {
        intensity: 1.2,
        colorScale: 1.5,
        animationSpeed: 0.8,
        baseColor: '#6edbe8',
        useTexture: true,
        textureMix: 0.7
    }
    
    const uniforms = {
        iTime: { value: 0, type: 'number', unit: 'float' },
        intensity: { value: params.intensity, type: 'number', unit: 'float' },
        colorScale: { value: params.colorScale, type: 'number', unit: 'float' },
        baseColor: { value: new THREE.Color(params.baseColor), type: 'color', unit: 'vec3' },
        animSpeed: { value: params.animationSpeed, type: 'number', unit: 'float' },
        useTexture: { value: params.useTexture, type: 'bool', unit: 'bool' },
        textureMix: { value: params.textureMix, type: 'float', unit: 'float' }
    }

    const glslProps = {
        vertexHeader: `
            varying vec2 vUv;
            varying vec3 v_position;
            void main() {
                vUv = uv;
                v_position = position;
        `,

        fragHeader: Object.keys(uniforms).map(i => 'uniform ' + uniforms[i].unit + ' ' + i + ';').join('\n') + '\n' + 'varying vec3 v_position; varying vec2 vUv;\n',

        fragBody: `
            vec4 O = vec4(0.0);
            vec2 I = (vUv - 0.5) * 2.0; // 将UV居中并扩展到[-1,1]范围
            
            //Raymarch iterator, step distance, depth
            float i = 0.0, d, z = 0.0;
            
            //Clear fragcolor and raymarch 100 steps
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=cityMixShader) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
