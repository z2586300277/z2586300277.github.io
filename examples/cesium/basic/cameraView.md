---
title: "记录视角 - Cesium.js 案例讲解"
description: "保存/恢复 camera 位置、姿态、frustum 到 sessionStorage"
head:
  - - meta
    - name: keywords
      content: "cesium.js,相机,视角保存,sessionStorage"
outline: deep
---

# 记录视角

*Save Camera View*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=cameraView)

![记录视角](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/cameraView.jpg)

## 你将学到什么

- 序列化 **camera** 的位置、方向、视锥参数
- 用 **sessionStorage** 在浏览器会话内持久化书签
- 恢复视角时 **flyTo** 与 **setView** 的差异
- **Model.fromGltfAsync** 低层加载 glTF

## 效果说明

调整相机到满意角度后点击「保存视角」，刷新页面或再次打开仍可恢复；可配置 glb URL，加载模型到东京坐标并飞到该处。

## 核心概念

### 需要保存哪些字段？

| 字段 | 含义 |
|------|------|
| `positionWC` / 经纬高 | 相机世界坐标 |
| `directionWC` / `upWC` | 视线与上方向（直接赋值可瞬间恢复） |
| `heading` / `pitch` / `roll` | 欧拉角（只读，但可传给 flyTo） |
| `frustum.fov/near/far` | 透视视锥 |

```js
const saveView = () => ({
    positionDegrees: cartesian3ToDegrees(camera.positionWC),
    position: camera.positionWC,
    direction: camera.directionWC,
    up: camera.upWC,
    frustum: {
        fov: camera.frustum.fov,
        near: camera.frustum.near,
        far: camera.frustum.far,
    },
    heading: camera.heading,
    pitch: camera.pitch,
    roll: camera.roll,
});
```

### 两种恢复方式

1. **直接写 WC 分量**（页面初始化）：无动画，适合首屏
2. **flyTo + orientation**（用户点击恢复）：有过渡

源码里 `loadView` 随机二选一，仅为演示两种 API。

### sessionStorage 结构

```js
{
    url: '.../coffeeMug.glb',
    view: { positionDegrees, heading, pitch, roll, ... }
}
```

::: warning
`Cartesian3` 序列化后是普通 `{x,y,z}` 对象，JSON 存取后需重新构造或直接用分量赋值。
:::

## 实现步骤

1. 初始化 Viewer 与 `camera` 引用
2. 页面加载时读 `sessionStorage`，若有 `view` 则直接赋 `positionWC` 等
3. GUI「保存视角」调用 `saveView()` 写入 storage
4. 「恢复保存视角」读 storage 后 `loadView`
5. 可选：按 `storage.url` 用 `Model.fromGltfAsync` 加载模型

## 代码要点

```js
const camera = viewer.camera;

function cartesian3ToDegrees(cartesian3) {
    const c = Cesium.Cartographic.fromCartesian(cartesian3);
    return {
        longitude: Cesium.Math.toDegrees(c.longitude),
        latitude: Cesium.Math.toDegrees(c.latitude),
        height: c.height,
    };
}

// 保存
storage.view = saveView();
sessionStorage.setItem('TCE_savedView', JSON.stringify(storage));

// 恢复（动画）
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(
        view.positionDegrees.longitude,
        view.positionDegrees.latitude,
        view.positionDegrees.height
    ),
    orientation: {
        heading: view.heading,
        pitch: view.pitch,
        roll: view.roll,
    },
});

// 低层 glTF
Cesium.Model.fromGltfAsync({
    url: storage.url,
    modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(
        Cesium.Cartesian3.fromDegrees(139.767052, 35.681167, 0)
    ),
}).then(model => viewer.scene.primitives.add(model));
```

## 源码

完整源码见 [GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/cesiumExamples/basic/cameraView.js)。

## 小结

- 书签功能 = 存 camera 状态 + 可选关联模型 URL
- 生产环境可把书签列表存后端，支持多场景切换
- 上一篇：[视角切换](/examples/cesium/basic/switchView) · 下一篇：[自动旋转](/examples/cesium/basic/autoRotate)

> 基础功能 · Cesium.js · 2/19
