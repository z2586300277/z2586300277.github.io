---
title: "几何合并 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,几何合并"
outline: deep
---
# 几何合并

*Geometry Merge*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=application&id=geometryMerge)

![几何合并](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/geometryMerge.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 相机交互控制器
- 实时阴影 ShadowMap
- 天空盒与环境贴图
- requestAnimationFrame 渲染循环

## 效果说明

Three.js 业务向场景组合。

> 应用场景 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- 阴影四步：`renderer.shadowMap.enabled`、光源 `castShadow`、物体 `castShadow`、地面 `receiveShadow`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. rAF 循环中 update 并 render

## 代码要点

- **`mergeModelGeometries()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

// 基础场景设置
const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000000)
camera.position.set(5, 5, 5)

// 渲染器设置
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(box.clientWidth, box.clientHeight)
renderer.setPixelRatio(window.devicePixelRatio * 2)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
box.appendChild(renderer.domElement)

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// 光源
scene.add(new THREE.AmbientLight(0xffffff, 3))

// 响应式调整
window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()
}

// 动画循环
function animate() {
    renderer.render(scene, camera)
    controls.update()
    requestAnimationFrame(animate)
}
animate()

// 几何体合并函数
function mergeModelGeometries(model, options = {}) {
    const { 
        material = new THREE.MeshStandardMaterial({ 
            color: 0x666666, metalness: 0.5, roughness: 0.5,
            polygonOffset: true, polygonOffsetFactor: 1.0, polygonOffsetUnits: 1.0
        }), 
        ignoreHidden = true,
        mergeThreshold = 1e-4
    } = options;
    
    model.updateWorldMatrix(true, true);
    
    // 收集网格
    const meshes = [];
    model.traverse(object => {
        if (object.isMesh && object.geometry && (!ignoreHidden || object.visible)) {
            meshes.push(object);
        }
    });
    
    if (meshes.length === 0) return null;
    
    // 找出共有属性
    const commonAttribs = new Set();
    let refGeom = null;
    
    meshes.forEach(mesh => {
        const geom = mesh.geometry;
        if (!refGeom) {
            refGeom = geom;
            Object.keys(geom.attributes).forEach(name => commonAttribs.add(name));
        } else {
            for (const name of [...commonAttribs]) {
                if (!geom.attributes[name]) commonAttribs.delete(name);
            }
        }
    });
    
    if (!commonAttribs.has('position')) commonAttribs.add('position');
    
    try {
        // 预处理几何体
        const geometries = meshes.map(mesh => {
            const geom = mesh.geometry.clone();
            
            commonAttribs.forEach(name => {
                if (!geom.attributes[name]) {
                    if (name === 'normal') {
                        geom.computeVertexNormals();
                    } else if (name !== 'position') {
                        const itemSize = refGeom.attributes[name].itemSize;
                        geom.setAttribute(name, new THREE.BufferAttribute(
                            new Float32Array(geom.attributes.position.count * itemSize), itemSize
                        ));
                    }
                }
            });
            
            Object.keys(geom.attributes).forEach(name => {
                if (!commonAttribs.has(name)) geom.deleteAttribute(name);
            });
            
            geom.applyMatrix4(mesh.matrixWorld);
            return geom;
        });
        
        const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
        
        if (mergeThreshold > 0 && mergedGeometry.mergeVertices) {
            mergedGeometry.mergeVertices(mergeThreshold);
        }
        
        return new THREE.Mesh(mergedGeometry, material);
        
    } catch (error) {
        console.error('模型合并失败:', error);
        return null;
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=application&id=geometryMerge) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
