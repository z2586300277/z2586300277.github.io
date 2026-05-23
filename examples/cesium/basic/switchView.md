---
title: "视角切换 - Cesium.js 案例讲解"
description: "flyTo、zoomTo、trackedEntity、viewBoundingSphere 等相机定位 API 对照"
head:
  - - meta
    - name: keywords
      content: "cesium.js,视角,flyTo,zoomTo,trackedEntity,camera"
outline: deep
---

# 视角切换

*Switch View*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=CesiumJS&classify=basic&id=switchView)

![视角切换](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/switchView.jpg)

## 你将学到什么

- Cesium **相机定位** API 全家桶：fly / zoom / setView / lookAt
- 对 **Entity、3D Tiles、经纬度** 三类目标分别如何定位
- **trackedEntity** 第三人称跟随与取消
- **HeadingPitchRange** 控制观察角度

## 效果说明

场景加载成都附近 **3D Tiles 白膜** 与 **glb 园区模型**，dat.GUI 提供十余个按钮，逐一演示不同相机 API 的视觉效果差异。

## 核心概念

Cesium 相机操作分三层：

| 层级 | 对象 | 典型方法 |
|------|------|---------|
| 便捷 | `viewer` | `flyTo` / `zoomTo` / `trackedEntity` |
| 相机 | `viewer.camera` | `flyTo` / `setView` / `lookAt` / `viewBoundingSphere` |
| 动画 | `flyHome` | 回到初始视角 |

### flyTo vs setView vs zoomTo

- **flyTo**：带过渡动画，适合产品交互
- **setView**：瞬间跳转，适合初始化或调试
- **zoomTo**：框选目标，动画较短，常用于数据加载后定位

### HeadingPitchRange

```js
new Cesium.HeadingPitchRange(heading, pitch, range)
```

- `heading`：绕 Z 轴旋转（正北为 0）
- `pitch`：俯仰（负值俯视地面）
- `range`：相机到目标距离

### trackedEntity

```js
viewer.trackedEntity = entity;   // 开启跟随
viewer.trackedEntity = undefined; // 取消
```

相机会锁定实体，地球在下方「自转」——适合车辆、飞机跟踪。

## 实现步骤

1. 初始化 Viewer，ArcGIS 影像 + 天地图注记
2. `Cesium3DTileset.fromUrl` 加载白膜，`entities.add` 加载 glb
3. 用 dat.GUI 把各 API 封装成可点击函数
4. 对比 Entity / tileset / 经纬度 三种 `flyTo` 写法

## 代码要点

```js
const tileset = await Cesium.Cesium3DTileset.fromUrl(FILE_HOST + '3dtiles/house/tileset.json');
viewer.scene.primitives.add(tileset);

const entity = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(104.0668, 30.5728, 0),
    model: { uri: FILE_HOST + '/models/glb/map_park.glb' }
});

// 经纬度 fly
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(116.4074, 39.9042, 1000)
});

// 实体 fly / zoom / 跟随
viewer.flyTo(entity);
viewer.zoomTo(entity);
viewer.trackedEntity = entity;

// 瓦片包围球
viewer.camera.flyToBoundingSphere(
    tileset.boundingSphere,
    new Cesium.HeadingPitchRange(0, -0.5, 0)
);

// lookAt：盯住目标，offset 为 eye 相对位移
viewer.camera.lookAt(
    entity.position.getValue(Cesium.JulianDate.now()),
    new Cesium.Cartesian3(0, 0, 1000)
);
```

::: tip 选型建议
演示调试多用 **setView**；面向用户的场景切换优先 **flyTo** 或 **flyToBoundingSphere**，并控制 `duration`。
:::

## 源码

完整源码见 [GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/cesiumExamples/basic/switchView.js)。

```js
const obj = {
    '重置最初:setView': () => viewer.camera.flyHome(1),
    '经纬度定位:flyTo': () => viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(116.4074, 39.9042, 1000)
    }),
    '实体:flyTo': () => viewer.flyTo(entity),
    '实体:trackedEntity': () => viewer.trackedEntity = entity,
    '瓦片:flyToBoundingSphere': () => viewer.camera.flyToBoundingSphere(
        tileset.boundingSphere,
        new Cesium.HeadingPitchRange(0, -0.5, 0)
    ),
};
for (const key in obj) gui.add(obj, key);
```

## 小结

- **Entity / Primitive** 都可用 `viewer.flyTo`，内部自动算包围体
- **lookAt** 适合固定观察点；**trackedEntity** 适合动态跟踪
- 下一篇：[记录视角](/examples/cesium/basic/cameraView)

> 基础功能 · Cesium.js · 1/19
