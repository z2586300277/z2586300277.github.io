---
title: "终末地-据点围栏 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,game,终末地-据点围栏"
outline: deep
---
# 终末地-据点围栏

*EndField Fence*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=game&id=zmdFence)

![终末地-据点围栏](https://z2586300277.github.io/three-cesium-examples/threeExamples/game/zmdFence.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时
- GUI 面板调试参数

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 游戏复刻 · Three.js

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
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "dat.gui";

/** <typedef> Fence_Constructor_Opts
 * @typedef {Object} Fence_Constructor_Opts
 * @property {THREE.Vector3Like}          range      围栏范围
 * @property {number}                     [segment]  单位长度内围栏分段数
 * @property {number}                     [width]    单个栅栏的宽度比例
 * @property {THREE.ColorRepresentation}  [color]    围栏颜色
 * @property {boolean}                    [useSimp]  是否启用远处栅栏简化
 */

/** ## 终末地据点风格围栏
 * @author ylfq
 *
 * ### tips
 * - 使用时需保证边长与分段数的比值为整数，否则边缘会出现偏差
 */
class Fence extends THREE.Group {
  /** ### 创建围栏
   * @param {Fence_Constructor_Opts} opts
   */
  constructor(opts) {
    super();

    // 复制参数并创建参数中对象的副本
    /** @type {Required<Fence_Constructor_Opts>} */
    const params = {
      range: new THREE.Vector3().copy(opts.range),
      segment: opts.segment ?? 1,
      width: opts.width ?? 0.7,
      color: new THREE.Color(opts.color ?? 0xffff00),
      useSimp: opts.useSimp ?? true,
    };
    this.params = params;

    // 通用 uniform 访问器，统一控制参数
    const commonUniforms = {
      U_range: {
        get value() {
          return params.range;
        },
      },
      U_segment: {
        get value() {
          return params.segment;
        },
      },
      U_color: {
        get value() {
          return params.color;
        },
      },
      U_width: {
        get value() {
          return params.width;
        },
      },
      U_useSimp: {
        get value() {
          return params.useSimp;
        },
      },
      U_time: {
        value: 0,
      },
    };

    // 通用材质设置
    const commonMaterialSettings = {
      side: THREE.DoubleSide,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    };

    // part_0 竖向围栏，四面包围无顶无底
    // 竖向围栏为四个平面，仅需访问此平面内的分段数，所以使用一套着色器， segment 参数在 uniform 中设置
    // X轴向分段材质
    const part_0_mat_x = new THREE.ShaderMaterial({
      uniforms: {
        ...commonUniforms,
        U_segment: {
          get value() {
            return params.segment * params.range.x;
          },
        },
      },
      vertexShader: Fence.part_0_mat_vs,
      fragmentShader: Fence.part_0_mat_fs,
      ...commonMaterialSettings,
    });
    // Z轴向分段材质
    const part_0_mat_z = new THREE.ShaderMaterial({
      uniforms: {
        ...commonUniforms,
        U_segment: {
          get value() {
            return params.segment * params.range.z;
          },
        },
      },
      vertexShader: Fence.part_0_mat_vs,
      fragmentShader: Fence.part_0_mat_fs,
      ...commonMaterialSettings,
    });
    this.part_0 = new THREE.Mesh(Fence.part_0_geo, [part_0_mat_z, part_0_mat_x]);

    // part_1 底部条带
    const part_1_mat = new THREE.ShaderMaterial({
      uniforms: {
        ...commonUniforms,
      },
      vertexShader: Fence.part_1_mat_vs,
      fragmentShader: Fence.part_1_mat_fs,
      ...commonMaterialSettings,
    });
    this.part_1 = new THREE.Mesh(Fence.part_1_geo, part_1_mat);

// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=game&id=zmdFence) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [游戏复刻目录](/examples/three/game/)

> 游戏复刻 · Three.js
