---
title: "终末地-据点围栏 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `tick`、`render`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,终末地-据点围栏,游戏复刻"
outline: deep
---

# 终末地-据点围栏

*EndField Fence*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=game&id=zmdFence)


![终末地-据点围栏](https://z2586300277.github.io/three-cesium-examples/threeExamples/game/zmdFence.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `tick`、`render`。

> 游戏复刻 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- glsl

## 独立函数

- `render()` — renderer.render(scene, camera)

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
```

### glsl

```js
`
  uniform  vec3  U_range   ;

  varying  vec3  V_mvpos   ;
  varying  vec2  V_uv      ;
  varying  vec3  V_normal  ;

  void main() {
    vec3 pos = position * U_range;
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    vec3 norm = normalMatrix * normal;

    V_mvpos   =  mvPos.xyz  ;
    V_uv      =  uv         ;
    V_normal  =  norm       ;

    gl_Position = projectionMatrix * mvPos;
  }
`;
Fence.part_0_mat_fs =
```

### glsl

```js
`
  uniform  vec3   U_color    ;
  uniform  float  U_segment  ;
  uniform  float  U_width    ;
  uniform  bool   U_useSimp  ;

  varying  vec3   V_mvpos    ;
  varying  vec2   V_uv       ;
  varying  vec3   V_normal   ;

  vec4 getColor_fence() {
    // 在较远处或法线与视角夹角较大的地方使用纯色带避免摩尔纹
    float s = 400.0 / length(V_mvpos) * abs(dot(normalize(V_normal), normalize(-V_mvpos)));
    float v = U_useSimp ? smoothstep(0.0, 1.0, (s - 0.9) * 0.7) : 1.0;

    // Y轴上从下往上衰减
    float vy = 1.0 - pow(V_uv.y, 1.5);

    vec4 c_0 = vec4(U_color, pow(U_width, 2.0) * vy * 0.8);

    if (v == 0.0) return c_0;

    // 按照分段划分区块，计算区块内坐标
    float f = fract(V_uv.x * U_segment);
    // X轴上以 0.5 为中心，向左右两侧衰减，且宽度从下往上衰减，边界值为 0.5 +- 0.5 * U_width * vy
    float vx = max(1.0 - pow(abs((0.5 - f) / (U_width * vy)) * 2.0, 1.5), 0.0);

    vec4 c_1 = vec4(U_color, vx * vy * 0.8);

    return mix(c_0, c_1, v);
  }

  void main() {
    vec4 c_out = getColor_fence();

    if (c_out.a == 0.0) discard;

    gl_FragColor = c_out;
  }
`;
Fence.part_1_mat_vs =
```

