---
title: "加载模型 - Cesium.js 案例讲解"
description: "Cesium3DTileset 倾斜摄影 + Entity glTF 模型，adjust3dtilesPosition 贴地偏移"
head:
  - - meta
    - name: keywords
      content: "cesium.js,加载模型,3D Tiles,glTF,Entity"
outline: deep
---

# 加载模型

*Load Model*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=CesiumJS&classify=basic&id=loadModel)

![加载模型](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/loadModel.jpg)

## 你将学到什么

- **3D Tiles** 与 **glTF Entity** 两种加载方式
- `viewer.scene.primitives.add(tileset)` vs `viewer.entities.add`
- 经纬高坐标转换与 **贴地偏移** 原理

## 效果说明

加载倾斜摄影 **3D Tiles** 建筑白膜，在其包围球中心放置一辆 **glTF 汽车模型**，并将 tileset 整体贴地。

## 核心概念

Cesium 有两套主要渲染 API：

| API | 适用 | 加载方式 |
|-----|------|---------|
| **Primitive** | 3D Tiles、地形、大批量静态几何 | `scene.primitives.add()` |
| **Entity** | 点线面、模型、标签等高层对象 | `viewer.entities.add()` |

### 3D Tiles

```js
const tileset = await Cesium.Cesium3DTileset.fromUrl(url);
viewer.scene.primitives.add(tileset);
viewer.camera.viewBoundingSphere(tileset.boundingSphere, new Cesium.HeadingPitchRange(0, -0.5, 0));
```

3D Tiles 是 **流式 LOD 格式**，适合城市级倾斜摄影、点云、人工模型库。

### Entity glTF

```js
viewer.entities.add({
    position: tileset.boundingSphere.center,
    model: {
        uri: 'car.glb',
        minimumPixelSize: 128,  // 远距离最小像素，保证可见
        maximumScale: 200,
    }
});
```

### 贴地偏移 adjust3dtilesPosition

倾斜摄影数据常 **悬浮或陷入地下**，需计算高度偏移：

```
1. boundingSphere.center → Cartographic（经纬高）
2. 取椭球面高度 0 的表面点 surface
3. offset = surface - center
4. tileset.modelMatrix 应用平移
```

涉及 Cesium 空间数学：`Cartographic.fromCartesian` → `Cartesian3.fromRadians` → `Matrix4.fromTranslation`。

## 实现步骤

1. `new Cesium.Viewer()` 精简 UI，配置 ArcGIS 影像底图
2. `await Cesium3DTileset.fromUrl()` 加载 tileset
3. `adjust3dtilesPosition(tileset)` 贴地
4. `viewBoundingSphere` 飞到模型
5. Entity 加载 glTF 到 tileset 中心

## 代码要点

```js
const tileset = await Cesium.Cesium3DTileset.fromUrl(FILE_HOST + '3dtiles/test/tileset.json');
viewer.scene.primitives.add(tileset);
adjust3dtilesPosition(tileset);

viewer.entities.add({
    name: 'gltf',
    position: tileset.boundingSphere.center,
    model: {
        uri: HOST + '/files/model/car.glb',
        minimumPixelSize: 128,
        maximumScale: 200,
    }
});

function adjust3dtilesPosition(tileset) {
    const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
    const surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
    const offset = Cesium.Cartesian3.subtract(surface, tileset.boundingSphere.center, new Cesium.Cartesian3());
    tileset.modelMatrix = Cesium.Matrix4.fromTranslation(offset);
}
```

::: tip 坐标系
Cesium 使用 WGS84 椭球。所有位置最终转为 **Cartesian3（地心固定坐标系 ECEF）** 参与渲染。
:::

## 源码

完整源码见 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=CesiumJS&classify=basic&id=loadModel)。

```js
import * as Cesium from 'cesium';

const viewer = new Cesium.Viewer(box, {
    animation: false,
    baseLayerPicker: false,
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(
        Cesium.ArcGisMapServerImageryProvider.fromUrl(
            'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer'
        )
    ),
    fullscreenButton: false,
    timeline: false,
    infoBox: false,
});

const tileset = await Cesium.Cesium3DTileset.fromUrl(FILE_HOST + '3dtiles/test/tileset.json');
viewer.scene.primitives.add(tileset);
adjust3dtilesPosition(tileset);
viewer.camera.viewBoundingSphere(tileset.boundingSphere, new Cesium.HeadingPitchRange(0, -0.5, 0));

viewer.entities.add({
    name: 'gltf',
    position: tileset.boundingSphere.center,
    model: { uri: HOST + '/files/model/car.glb', minimumPixelSize: 128, maximumScale: 200 }
});
```

## 小结

- 大场景建筑 → **3D Tiles**；单个可交互模型 → **Entity.model**
- 相关：[Cesium 相机](/examples/cesium/basic/cameraView) · [3D Tiles 着色](/examples/cesium/advancedEffect/tilesShader)

> 基础功能 · Cesium.js
