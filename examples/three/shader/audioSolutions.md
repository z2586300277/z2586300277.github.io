---
title: "音乐可视化 - Three.js 案例讲解"
description: "AudioAnalyser 频谱驱动 Simplex4D 噪声顶点位移"
head:
  - - meta
    - name: keywords
      content: "three.js,AudioAnalyser,音乐可视化,SimplexNoise,onBeforeCompile"
outline: deep
---

# 音乐可视化

*Audio Visualization*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=audioSolutions)

![音乐可视化](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/audioSolutions.jpg)

## 你将学到什么

- **THREE.AudioAnalyser** 读取 FFT 频谱
- 频谱均值驱动 **uStrength** uniform
- **Simplex 4D Noise** 沿法线顶点位移
- `customDepthMaterial` 同步修改保证阴影正确

## 效果说明

点击 Play 播放 MP3，高精度 **IcosahedronGeometry** 表面随节拍起伏，片元输出法线色形成「脉动球体」。

## 核心概念

### 音频链路

```js
const listener = new THREE.AudioListener();
const audio = new THREE.Audio(listener);
const mediaElement = new Audio(url);
mediaElement.play();
audio.setMediaElementSource(mediaElement);
analyser = new THREE.AudioAnalyser(audio, 4096);
```

### 频谱 → 强度

```js
analyser.getFrequencyData();
let sum = 0;
for (let i = 0; i < analyser.data.length; i++) sum += analyser.data[i];
uniform.uStrength.value = sum / (analyser.data.length * 25.5);
```

### 顶点噪声位移

在 `onBeforeCompile` 的 `#include <fog_vertex>` 后：

```glsl
newPos += normal * simplexNoise4d(vec4(position, uTime)) * uStrength;
gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
```

**depthMaterial** 同样注入，否则 shadow pass 与 color pass 几何不一致。

片元改为 `gl_FragColor = vec4(vNormal, 1.)`，用法线 RGB 当可视化色。

## 实现步骤

1. init 场景：高细分 Icosahedron + 地面 + 灯光阴影
2. MeshStandardMaterial.onBeforeCompile 注入 GLSL
3. createButton 绑定 Play/Pause
4. tick 里 updateOffsetData + uTime + render

## 源码

完整源码见 [GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/shader/audioSolutions.js)。

## 小结

- 音频可视化核心：**Analyser → uniform → shader 形变**
- 下一篇：[城市混合扫光](/examples/three/shader/cityBlendLight)

> 着色器 · Three.js · 3/89
