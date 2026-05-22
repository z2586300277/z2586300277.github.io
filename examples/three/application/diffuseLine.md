---
title: "发散飞线 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `InitFly`。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,发散飞线"
outline: deep
---
# 发散飞线

*Diffuse Line*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=diffuseLine)

![发散飞线](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/diffuseLine.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 点云 / 粒子 / 实例化渲染
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `InitFly`。

> 应用场景 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **Points** 大量顶点用点精灵渲染；**InstancedMesh** 相同几何体批量绘制，降低 draw call。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`pad2()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`Initialize()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`onDocumentMouse()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`onWindowResize()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`onDocumentMouseUp()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from 'three/examples/jsm/libs/stats.module.js';

class InitFly {
    constructor({
        texture
    } = opt) {
        this.flyId = 0; //id
        this.flyArr = []; //存储所有飞线
        this.baicSpeed = 1; //基础速度
        this.texture = 0.0;
        if (texture && !texture.isTexture) {
            this.texture = new THREE.TextureLoader().load(texture)
        } else {
            this.texture = texture;
        }
        this.flyShader = {
            vertexshader: ` 
                uniform float size; 
                uniform float time; 
                uniform float u_len; 
                attribute float u_index;
                varying float u_opacitys;
                void main() { 
                    if( u_index < time + u_len && u_index > time){
                        float u_scale = 1.0 - (time + u_len - u_index) /u_len;
                        u_opacitys = u_scale;
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        gl_Position = projectionMatrix * mvPosition;
                        gl_PointSize = size * u_scale * 300.0 / (-mvPosition.z);
                    } 
                }
                `,
            fragmentshader: ` 
                uniform sampler2D u_map;
                uniform float u_opacity;
                uniform vec3 color;
                uniform float isTexture;
                varying float u_opacitys;
                void main() {
                    vec4 u_color = vec4(color,u_opacity * u_opacitys);
                    if( isTexture != 0.0 ){
                        gl_FragColor = u_color * texture2D(u_map, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y));
                    }else{
                        gl_FragColor = u_color;
                    }
                }`
        }
    }
    /**
     * [addFly description]
     *
     * @param   {String}  opt.color  [颜色_透明度]
     * @param   {Array}   opt.curve  [线的节点]
     * @param   {Number}  opt.width  [宽度]
     * @param   {Number}  opt.length [长度]
     * @param   {Number}  opt.speed  [速度]
     * @param   {Number}  opt.repeat [重复次数]
     * @return  {Mesh}               [return 图层]
     */
    addFly({
        color = "rgba(255,255,255,1)",
        curve = [],
        width = 1,
        length = 10,
        speed = 1,
        repeat = 1,
        texture = null,
        callback
    } = opt) {
        let colorArr = this.getColorArr(color);
        let geometry = new THREE.BufferGeometry();
        let material = new THREE.ShaderMaterial({
            uniforms: {
                color: {
                    value: colorArr[0],
                    type: "v3"
                },
                size: {
                    value: width,
                    type: "f"
                },
                u_map: {
                    value: texture ? texture : this.texture,
                    type: "t2"
                },
                u_len: {
                    value: length,
                    type: "f"
                },
                u_opacity: {
                    value: colorArr[1],
                    type: "f"
                },
                time: {
                    value: -length,
                    type: "f"
                },
                isTexture: {
                    value: 1.0,
                    type: "f"
                }
            },
            transparent: true,
            depthTest: false,
            vertexShader: this.flyShader.vertexshader,
            fragmentShader: this.flyShader.fragmentshader
        });
        const [position, u_index] = [
            [],
            []
        ];
        curve.forEach(function (elem, index) {
            position.push(elem.x, elem.y, elem.z);
            u_index.push(index);
        })
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(position, 3));
        geometry.setAttribute("u_index", new THREE.Float32BufferAttribute(u_index, 1));
        let mesh = new THREE.Points(geometry, material);
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=diffuseLine) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
