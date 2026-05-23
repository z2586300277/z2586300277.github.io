---
title: "城市光效 - Three.js 案例讲解"
description: "onBeforeCompile 注入生长/上升线/扩散波/扫光四套 GLSL，FBX 城市白膜大屏"
head:
  - - meta
    - name: keywords
      content: "three.js,onBeforeCompile,城市光效,shader,FBX"
outline: deep
---

# 城市光效

*City Effect*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=shader&id=cityEffect)

![城市光效](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/cityEffect.jpg)

## 你将学到什么

- **Material.onBeforeCompile** 在不写完整 ShaderMaterial 的情况下改内置 shader
- 替换 `#include <begin_vertex>` / `#include <dithering_fragment>` 注入 GLSL
- 四套大屏特效：**生长、上升流光、圆扩散、扫光**
- FBX 分层处理：建筑 / 地面 / 道路 + **EdgesGeometry** 线框

## 效果说明

加载上海 FBX 城市模型，建筑从低到高「长出来」，表面有蓝色上升带、紫色同心扩散波、青色 X 向扫光；建筑边线同步生长，地面与道路单独设色。

## 核心概念

### onBeforeCompile 工作方式

Three.js 内置 `MeshStandardMaterial` 等会先拼好 vertex/fragment shader，再调用：

```js
material.onBeforeCompile = (shader) => {
    shader.uniforms.uProgress = { value: 0 };
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         transformed.z = position.z * min(uProgress, 1.0);`
    );
};
```

`#include <xxx>` 是 **shaderChunk** 片段，可在 Three 源码 `renderers/shaders/ShaderChunk/` 查原文。

### 四套特效分工

| 函数 | 注入位置 | 视觉 |
|------|---------|------|
| `applyGrowShader` | vertex `begin_vertex` | `uProgress` 压扁 Z，建筑生长 |
| `applyRiseShader` | fragment `dithering_fragment` | 沿高度 `smoothstep` 上升亮带 |
| `applySpreadShader` | fragment | 距原点距离环形波 `mod(uSpreadTime)` |
| `applySweepShader` | fragment | 沿 X 的扫光条 |

uniform 在 rAF 里通过 **renderList** 回调统一更新：

```js
const renderList = [];
renderList.push((time) => { shader.uniforms.uRiseTime.value = time * 30.0; });

function animate() {
    renderList.forEach(fn => fn(clock.getElapsedTime()));
    // ...
}
```

### FBX 分层 modelHandlerMap

```js
const modelHandlerMap = {
    CITY_UNTRIANGULATED: (model, group) => { /* 建筑 + 线框 + 四套 shader */ },
    LANDMASS: (model) => { /* 深色地面 */ },
    ROADS: (model) => { /* 道路色 */ },
};
```

线框：`EdgesGeometry` + `LineSegments`，需 `rotateX(-Math.PI/2)` 对齐 FBX 坐标系。

## 实现步骤

1. Scene / Camera / Renderer / OrbitControls，CubeTexture 天空盒
2. FBXLoader 加载城市，按 `child.name` 走 handler
3. 建筑材质 `onBeforeCompile` 链式调用四个 apply 函数
4. 线框材质同样 `applyGrowShader` 同步生长
5. Clock + renderList 驱动所有 uniform 动画

## 代码要点

**生长（顶点）**

```js
transformed.z = position.z * min(uProgress, 1.0);
```

**上升线（片元，节选）**

```js
float ratio = smoothstep(speed, speed + smoothness, vHeight)
            - smoothstep(speed + smoothness, speed + smoothness * 2.0, vHeight);
return uRiseColor * ratio;
```

**扩散波**：用 `length(vTransformedPosition - center)` 与 `mod(uSpreadTime, 1800.0)` 做循环波纹。

::: tip logarithmicDepthBuffer
`renderer` 开启 `logarithmicDepthBuffer: true`，大场景深度精度更好，城市级模型建议保留。
:::

## 源码

完整源码见 [GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/shader/cityEffect.js)。

## 小结

- 智慧城市大屏常用 **onBeforeCompile 叠特效**，比从零写 ShaderMaterial 省维护
- 下一篇：[草地着色器](/examples/three/shader/grassShader)

> 着色器 · Three.js · 1/89
