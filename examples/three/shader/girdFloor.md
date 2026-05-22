---
title: "网格地板 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,网格地板"
outline: deep
---
# 网格地板

*Gird Floor*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=girdFloor)

![网格地板](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/girdFloor.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 天空盒与环境贴图
- Tween 补间动画
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

- 属性插值动画，适合相机动效、UI 过渡。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Pane } from 'tweakpane'

const baseVertexShader = `#include <fog_pars_vertex>

varying vec2 vUv;

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    vUv = uv;

    #include <begin_vertex>
    #include <project_vertex>
    #include <fog_vertex>
}`

const baseFragmentShader = `#include <fog_pars_fragment>

uniform float uGridThickness;
uniform vec3 uGridColor;
uniform float uCrossScale;
uniform float uCrossThickness;
uniform float uCross;
uniform vec3 uCrossColor;
uniform vec3 uFloorColor;

varying vec2 vUv;

float gridFloor(vec2 uv, vec2 lineWidth) {
    //💡 derivatives of original uv
    //   to create anti-aliasing line with smoothstep
    // how much a specific value is changing between one pixel and the next
    // width change depending on angle & distance from camera can be found with space partial derivatives
    // fwidth - approximation of derivatives
    //float lineAA = fwidth(uv.x);
    // vec2 uvDeriv = fwidth(uv);
    vec4 uvDDXY = vec4(dFdx(uv), dFdy(uv));
    vec2 uvDeriv = vec2(length(uvDDXY.xz), length(uvDDXY.yw));

    // 💡 Invert Line Trick
    // since 0.5 clamp was use, to handle line thickness > 0.5
    // draw black lines on white offset by half a grid width
    bool invertLine = lineWidth.x > 0.5;
    vec2 targetWidth = invertLine ? 1.0 - lineWidth : lineWidth;

    // 💡 Phone-wire AA
    // STEP 1: ensure line does not get smaller than one pixel
    // if so, we will clamp it to one pixel
    // vec2 drawWidth = max(uvDeriv, lineWidth);
    // clamp to 0.5 to ensure line fades to grey, not black
    vec2 drawWidth = clamp(targetWidth, uvDeriv, vec2(0.5));

    // 💡 1 pixel wide smoothstep can be too sharp causing aliasing
    // hence using 1.5 pixel wide smoothstep
    // AA - anti-aliasing
    vec2 lineAA = uvDeriv * 1.5;
    
    //💡 prepare uv for lines
    // 0-1(uv) 👉 0-2(multiply) 👉 -1-0-1(shift) 👉 1-0-1(absolute)
    // 👉 0-1-0(shift) make white at center(0,0) position
    // (fract) - make sawtooth wave
    //float lineUV = 1.0 - abs(fract(uv.x) * 2.0 - 1.0);
    vec2 gridUV = abs(fract(uv) * 2.0 - 1.0);
    gridUV = invertLine ? gridUV : 1.0 - gridUV;

    //💡 repeating lines
    // use the derivative to make the lines smooth
    //float line = smoothstep(lineWidth.x + lineAA, lineWidth.x - lineAA,lineUV);
    vec2 grid2 = smoothstep(drawWidth + lineAA, drawWidth - lineAA, gridUV);

    // 💡 Phone-wire AA
    // STEP 2: fades the line out as it gets thinner
    // how thick we want divided by how thick we’re drawing
    grid2 *= clamp(targetWidth / drawWidth, 0.0, 1.0);

    // 💡 Moire Suppresion
    // grid cells < a pixel(when derivative > 1.0), moire pattern can appear
    // note: after the 0.5 clamp, moire would be more pronounced, but in my case, i do not see any moire
    // fade to solid color when 0.5 > derivative > 1.0 
    // anti-aliased lines start to merge
    grid2 = mix(grid2, targetWidth, clamp(uvDeriv * 2.0 - 1.0, 0.0, 1.0));
    grid2 = invertLine ? 1.0 - grid2 : grid2;

    // overlap xy lines
    float grid = mix(grid2.x, 1.0, grid2.y);

    return grid;
}

float crossFloor(vec2 uv, float scale, float thickness, float crossIntensity) {
    vec2 lineWidth = vec2(thickness);

    //💡 derivatives of original uv
    //   to create anti-aliasing line with smoothstep
    // how much a specific value is changing between one pixel and the next
    // width change depending on angle & distance from camera can be found with space partial derivatives
    // fwidth - approximation of derivatives
    //float lineAA = fwidth(uv.x);
    // vec2 uvDeriv = fwidth(uv);
    vec4 uvDDXY = vec4(dFdx(uv), dFdy(uv));
    vec2 uvDeriv = vec2(length(uvDDXY.xz), length(uvDDXY.yw));

    // 💡 Invert Line Trick
    // since 0.5 clamp was use, to handle line thickness > 0.5
    // draw black lines on white offset by half a grid width
    bool invertLine = lineWidth.x > 0.5;
    // vec2 targetWidth = invertLine ? 1.0 - lineWidth : lineWidth;
    vec2 targetWidth = lineWidth;

    // 💡 Phone-wire AA
    // STEP 1: ensure line does not get smaller than one pixel
    // if so, we will clamp it to one pixel
    // vec2 drawWidth = max(uvDeriv, lineWidth);
    // clamp to 0.5 to ensure line fades to grey, not black
    vec2 drawWidth = clamp(targetWidth, uvDeriv, vec2(0.5));

// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=girdFloor) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
