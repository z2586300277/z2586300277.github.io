---
title: "Cesium Three切换 - Cesium.js 案例讲解"
description: "Cesium Three切换：Cesium Viewer 初始化与场景配置、相机交互控制器、外部模型 / 3D Tiles 加载（扩展功能）"
head:
  - - meta
    - name: keywords
      content: "cesium.js,expand,cesiumSwitch"
outline: deep
---

# Cesium Three切换

*Cesium Switch*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=CesiumJS&classify=expand&id=cesiumSwitch)

![Cesium Three切换](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/expand/cesiumSwitch.jpg)

## 你将学到什么

- Cesium Viewer 初始化与场景配置
- 相机交互控制器
- 外部模型 / 3D Tiles 加载
- Cesium Entity / DataSource 高层 API
- Cesium 屏幕空间拾取交互
- Cesium 相机定位与跟随

## 效果说明

Cesium 地球场景，加载外部模型，含相机或交互演示。打开在线案例可查看最终画面。

## 核心概念

- **Viewer** 封装地球、相机、图层与 clock；可关闭 animation/timeline 精简 UI。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- 异步 Loader 返回 scene 或 tileset；注意 scale、坐标系与 `modelMatrix` 贴地。
- **Entity** 适合业务对象；**GeoJsonDataSource** 加载 GeoJSON 面线点。
- **ScreenSpaceEventHandler** 监听点击；`scene.pick` 取 Entity，`pickPosition` 取地表坐标。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. Loader 加载资源并加入 scene / entities / primitives
4. dataSources.add 或 entities.add 业务对象
5. setInputAction 注册 LEFT_CLICK 等事件

## 代码要点

```js
const viewer = new Cesium.Viewer(cesiumBox, {
    animation: false,//是否创建动画小器件，左下角仪表    
    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')),
    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮
    timeline: false,//是否显示时间轴    
    infoBox: false,//是否显示信息框   
})

    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')),
    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮
    timeline: false,//是否显示时间轴    
    infoBox: false,//是否显示信息框   
})

const entity = viewer.entities.add({
    name: '房子',
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/cesiumExamples/expand/cesiumSwitch.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=CesiumJS&classify=expand&id=cesiumSwitch) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[cesium融合three](/examples/cesium/expand/cesiumAndThree)
- 下一篇：[echarts飞线](/examples/cesium/expand/echartsFlyLine)

> 扩展功能 · Cesium.js · 2/6
