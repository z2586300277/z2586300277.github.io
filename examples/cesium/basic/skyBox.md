---
title: "天空盒 - Cesium.js 案例讲解"
description: "SkyBox 六面体贴图替换默认天空，UrlTemplateImageryProvider 高德影像"
head:
  - - meta
    - name: keywords
      content: "cesium.js,SkyBox,天空盒,cubemap"
outline: deep
---

# 天空盒

*Sky Box*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=CesiumJS&classify=basic&id=skyBox)

![天空盒](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/skyBox.jpg)

## 你将学到什么

- **scene.skyBox** 替换默认渐变天空
- 立方体贴图 **六面命名**（positiveX / negativeX …）
- **UrlTemplateImageryProvider** 加载 XYZ 瓦片底图

## 效果说明

使用高德卫星影像作底图，天空换成自定义六面 PNG，形成「地面实景 + 定制天空」的视觉效果。

## 核心概念

### SkyBox

```js
viewer.scene.skyBox = new Cesium.SkyBox({
    sources: {
        positiveX: 'px.png',  // 右 (+X)
        negativeX: 'nx.png',  // 左 (-X)
        positiveY: 'py.png',  // 前 (+Y) — 注意与 Three.js 轴向可能不同
        negativeY: 'ny.png',  // 后 (-Y)
        positiveZ: 'pz.png',  // 上 (+Z)
        negativeZ: 'nz.png',  // 下 (-Z)
    }
});
```

本案例注释说明了 **贴图轴与 Cesium 期望面的映射关系**（px/nx/py 等需按实际摄影机朝向调整）。

### 关闭默认底图

```js
const viewer = new Cesium.Viewer(box, { baseLayer: false });
viewer.imageryLayers.addImageryProvider(
    new Cesium.UrlTemplateImageryProvider({
        url: 'https://.../{z}/{x}/{y}',
        maximumLevel: 18,
    })
);
```

## 实现步骤

1. Viewer 设 `baseLayer: false`，手动 add 影像
2. 准备 6 张无缝立方体贴图
3. `new Cesium.SkyBox({ sources })` 赋给 `scene.skyBox`
4. 若天空方向不对，交换 positiveY/negativeY 等面

## 代码要点

```js
viewer.scene.skyBox = new Cesium.SkyBox({
    sources: {
        positiveX: FILE_HOST + 'files/cesiumSky/px.png',
        negativeX: FILE_HOST + 'files/cesiumSky/nx.png',
        positiveY: FILE_HOST + 'files/cesiumSky/pz.png',
        negativeY: FILE_HOST + 'files/cesiumSky/nz.png',
        positiveZ: FILE_HOST + 'files/cesiumSky/py.png',
        negativeZ: FILE_HOST + 'files/cesiumSky/ny.png',
    }
});
```

::: tip 性能
SkyBox 在远处渲染，开销很小。HDR 环境光见 **ImageBasedLighting** 相关高级案例。
:::

## 源码

完整源码见 [GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/cesiumExamples/basic/skyBox.js)。

## 小结

- 六面图命名搞错是最常见问题，逐个面调试
- 上一篇：[点击事件](/examples/cesium/basic/clickEvent) · 下一篇：[GeoJSON 面](/examples/cesium/basic/geojsonFace)

> 基础功能 · Cesium.js · 7/19
