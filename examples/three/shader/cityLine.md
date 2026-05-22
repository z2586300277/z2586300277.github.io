---
title: "城市线条 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `City`。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,城市线条"
outline: deep
---
# 城市线条

*City Line*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=cityLine)

![城市线条](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/cityLine.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `City`。

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
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

class City {

    constructor() {
        this.fbxLoader = new FBXLoader();
        this.group = new THREE.Group();
        this.clock = new THREE.Clock()
        this.surroundLineMaterial = null;// 定义包围线材质属性
        this.time = { value: 0 };
        this.startTime = { value: 0 };
        this.startLength = { value: 2 }
        this.isStart = false;

        this.fbxLoader.load(FILE_HOST + 'models/fbx/shanghai.FBX', (group) => {

            this.group.add(group);
            group.traverse((child) => {
                // 设置城市建筑（mesh物体），材质基本颜色
                if (child.name == 'CITY_UNTRIANGULATED') {
                    const materials = Array.isArray(child.material) ? child.material : [child.material]
                    materials.forEach((material) => {
                        material.transparent = true;
                        material.color.setStyle("#9370DB");
                    })
                }

                // 设置城市地面（mesh物体），材质基本颜色
                if (child.name == 'LANDMASS') {
                    const materials = Array.isArray(child.material) ? child.material : [child.material]
                    materials.forEach((material) => {
                        material.transparent = true;
                        material.color.setStyle("#040912");
                    })
                }
            })

            this.init();
        });
    }

    // 初始化城市类的实例
    init() {
        this.isStart = true; // 城市渲染启动
        this.clock.start()
        this.surroundLine();
    }

    // 创建包围线条效果
    surroundLine() {
        let cityBuildings // 城市建筑群
        this.group.traverse(child => {
            if (child.name !== 'CITY_UNTRIANGULATED') return
            cityBuildings = child
        })

        const geometry = new THREE.EdgesGeometry(cityBuildings.geometry);
        const surroundLineMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uColor: {
                    value: new THREE.Color('#FFF')
                }
            },
            vertexShader: `
         void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
            fragmentShader: ` 
          uniform vec3 uColor;
          void main() {
            gl_FragColor = vec4(uColor, 1);
          }
        `
        });

        const line = new THREE.LineSegments(geometry, surroundLineMaterial);
        line.name = 'surroundLine';
        line.applyMatrix4(cityBuildings.matrix.clone())
        cityBuildings.parent.add(line)
    }

    updateData = () => {
        if (!this.isStart) return false;
        const dt = this.clock.getDelta();
        this.time.value += dt;
        this.startTime.value += dt;
        if (this.startTime.value >= this.startLength.value) {
            this.startTime.value = this.startLength.value;
        }
    }
}

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000000)
camera.position.set(600, 750, -1221)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize(box.clientWidth, box.clientHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(new THREE.Color('#32373E'), 1);

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()
}

box.appendChild(renderer.domElement)

// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=cityLine) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
