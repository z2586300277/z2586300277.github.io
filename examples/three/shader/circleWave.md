---
title: "圆波扫光 - Three.js 案例讲解"
description: "circleWave 同心圆扩散 + 加法混合 + 扫描纹理"
head:
  - - meta
    - name: keywords
      content: "three.js,圆波,扫光,ShaderMaterial,AdditiveBlending"
outline: deep
---

# 圆波扫光

*Circle Wave Scan*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=shader&id=circleWave)

![圆波扫光](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/circleWave.jpg)

## 你将学到什么

- **circleWave** 函数：同心圆径向扩散
- `fract(dist - t)` 形成 moving ring
- **AdditiveBlending** 叠加发光
- 扫描纹理 `wave.png` 调制遮罩

## 效果说明

水平放置的平面上，青色同心圆波从中心向外扩散，带 noise 纹理细节；dat.GUI 可调主色与暗部色。

## 核心概念

### circleWave

```glsl
float circleWave(vec3 p, vec3 origin, float distRatio) {
    float t = uTime;
    float dist = distance(p, origin) * distRatio;
    float radialMove = fract(dist - t);
    float fadeOutMask = 1.0 - smoothstep(1.0, 3.0, dist);
    radialMove *= fadeOutMask;
    float cutInitialMask = 1.0 - step(t, dist);
    return radialMove * cutInitialMask;
}
```

- `fract(dist - t)`：波环随时间外移
- `cutInitialMask`：未到达半径前不显示
- `fadeOutMask`：远处衰减

### 双层波 + 纹理

```glsl
float cw  = circleWave(worldPos, uScanOrigin, 3.2);
float cw2 = circleWave(worldPos, uScanOrigin, 2.8);
float scanMask = texture2D(uScanTex, uv).r;
vec3 scanCol = mix(uScanColorDark, uScanColor, mask1);
gl_FragColor = vec4(col, length(col)); // alpha 随亮度
```

材质：`transparent: true`，`blending: THREE.AdditiveBlending`。

## 实现步骤

1. PlaneGeometry + ShaderMaterial
2. mesh.rotation.x = PI/2 水平铺地
3. GUI 绑定 uScanColor / uScanColorDark
4. uTime 每帧 += 0.005

## 源码

完整源码见 [GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/shader/circleWave.js)。

## 小结

- 地面雷达/能量扩散特效的基础圆环 shader
- 上一篇：[中国旗帜](/examples/three/shader/chinaFlag) · 下一篇：[围墙着色器](/examples/three/shader/fenceWall)

> 着色器 · Three.js · 8/89
