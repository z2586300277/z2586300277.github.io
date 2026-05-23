---
title: "echarts飞线 - Cesium.js 案例讲解"
description: "echarts飞线：Cesium Viewer 初始化与场景配置、Cesium 屏幕空间拾取交互、Cesium 相机定位与跟随（扩展功能）"
head:
  - - meta
    - name: keywords
      content: "cesium.js,expand,echartsFlyLine"
outline: deep
---

# echarts飞线

*EchartsFlyLine*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=CesiumJS&classify=expand&id=echartsFlyLine)

![echarts飞线](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/expand/echartsFlyLine.jpg)

## 你将学到什么

- Cesium Viewer 初始化与场景配置
- Cesium 屏幕空间拾取交互
- Cesium 相机定位与跟随
- HTML DOM 与三维坐标同步

## 效果说明

Cesium 地球场景，含相机或交互演示。打开在线案例可查看最终画面。

## 核心概念

- **Viewer** 封装地球、相机、图层与 clock；可关闭 animation/timeline 精简 UI。
- **ScreenSpaceEventHandler** 监听点击；`scene.pick` 取 Entity，`pickPosition` 取地表坐标。
- **flyTo** 带动画定位；**trackedEntity** 第三人称跟随实体。
- 每帧 **worldToWindowCoordinates** 投影，translate 定位 DOM。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. setInputAction 注册 LEFT_CLICK 等事件
3. viewer.camera.flyTo 或 viewer.flyTo(target)
4. postRender / preUpdate 更新 overlay 位置

## 代码要点

```js
const viewer = new Cesium.Viewer(DOM, {

    animation: false,//是否创建动画小器件，左下角仪表    

    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl(GLOBAL_CONFIG.getLayerUrl())),



    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl(GLOBAL_CONFIG.getLayerUrl())),

    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮

    timeline: false,//是否显示时间轴    

    infoBox: false,//是否显示信息框   


        this._chart = echarts.init(ele);
        const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        handler.setInputAction(click => mockClickChart(event, this._chart), Cesium.ScreenSpaceEventType.LEFT_CLICK);
        return this._chart;
    }
    dispose() {
        if (this._echartsContainer) {
            this._map.container.removeChild(this._echartsCont
// ...
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/cesiumExamples/expand/echartsFlyLine.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=CesiumJS&classify=expand&id=echartsFlyLine) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[Cesium Three切换](/examples/cesium/expand/cesiumSwitch)
- 下一篇：[热力图](/examples/cesium/expand/heatMap)

> 扩展功能 · Cesium.js · 3/6
