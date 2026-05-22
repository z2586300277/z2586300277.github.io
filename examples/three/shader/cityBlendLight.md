---
title: "城市混合扫光 - Three.js 案例讲解"
description: "modelBlendShader 环形扫光带 mix 双色，innerCircleWidth 动画扩散"
head:
  - - meta
    - name: keywords
      content: "three.js,扫光,onBeforeCompile,FBX,modelBlendShader"
outline: deep
---

# 城市混合扫光

*City Blend Light*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=cityBlendLight)

![城市混合扫光](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/cityBlendLight.jpg)

## 你将学到什么

- 封装 **modelBlendShader** 批量改模型材质
- 用 **模型空间距离** 做环形扫光带
- `mix(diff, color3, r)` 双色渐变 + `intensity` 增亮
- `model.render` 钩子驱动 uniform 动画

## 效果说明

FBX 城市场景上，一道青蓝→深蓝的光环从中心向外扩散，扫过建筑表面；可选 `isDisCard` 丢弃暗色像素（镂空楼体）。

## 核心概念

### 扫光逻辑（片元）

```glsl
float dis = length(v_position - center);
if (dis < (innerCircleWidth + circleWidth) && dis > innerCircleWidth) {
    float r = (dis - innerCircleWidth) / circleWidth;
    diffuseColor = vec4(mix(diff, color3, r) * intensity, opacity);
} else {
    if (isDisCard) discard;
    else diffuseColor = vec4(diffuse, opacity);
}
```

| uniform | 作用 |
|---------|------|
| `innerCircleWidth` | 环内缘半径（动画递增） |
| `circleWidth` | 环带宽度 |
| `circleMax` | 到达后重置为 0 |
| `center` | 扫光中心（模型空间 vec3） |

### 批量 onBeforeCompile

```js
model.traverse(c => c.isMesh && materials.push(c.material));
materials = [...new Set(materials)]; // 去重共享材质

materials.forEach(material => {
    material.onBeforeCompile = (shader) => {
        Object.keys(uniforms).forEach(key => shader.uniforms[key] = uniforms[key]);
        // 替换 void main / diffuseColor 行
    };
});

model.render = () => {
    if (uniforms.innerCircleWidth.value < uniforms.circleMax.value)
        uniforms.innerCircleWidth.value += uniforms.circleSpeed.value;
    else uniforms.innerCircleWidth.value = 0;
};
```

animate 里调用 `model.render?.()`。

## 实现步骤

1. FBXLoader 加载 city.FBX，scale/position 调整
2. `modelBlendShader(object3d)` 收集材质、注入 GLSL
3. rAF 更新 innerCircleWidth 并 render

## 源码

完整源码见 [GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/shader/cityBlendLight.js)。

## 小结

- 与城市光效同属「FBX + onBeforeCompile 大屏」系列，本案例侧重 **径向扫光带**
- 上一篇：[音乐可视化](/examples/three/shader/audioSolutions) · 下一篇：[海面](/examples/three/shader/oceanShader)

> 着色器 · Three.js · 5/89
