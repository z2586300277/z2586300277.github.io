---
title: "Cesium 3D 变换控制器 - Cesium.js 案例讲解"
description: "Cesium 3D 变换控制器：Cesium Viewer 初始化与场景配置、外部模型 / 3D Tiles 加载、Cesium 相机定位与跟随（相关工具）"
head:
  - - meta
    - name: keywords
      content: "cesium.js,tools,transformControls,uniform 驱动"
outline: deep
---

# Cesium 3D 变换控制器

*Cesium 3D Transform Controls*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=CesiumJS&classify=tools&id=transformControls)

![Cesium 3D 变换控制器](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/tools/transformControls.jpg)

## 你将学到什么

- Cesium Viewer 初始化与场景配置
- 外部模型 / 3D Tiles 加载
- Cesium 相机定位与跟随
- Cesium Primitive 层海量渲染
- GUI 参数调试面板

## 效果说明

Cesium 地球场景，含相机或交互演示，技术点：uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Viewer** 封装地球、相机、图层与 clock；可关闭 animation/timeline 精简 UI。
- 异步 Loader 返回 scene 或 tileset；注意 scale、坐标系与 `modelMatrix` 贴地。
- **flyTo** 带动画定位；**trackedEntity** 第三人称跟随实体。
- **BillboardCollection / Primitive** 合批渲染，适合万级点面。
- dat.GUI / lil-gui 绑定 uniform 或配置对象实时调参。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. Loader 加载资源并加入 scene / entities / primitives
3. viewer.camera.flyTo 或 viewer.flyTo(target)
4. scene.primitives.add(collection)
5. gui.add 绑定可调参数

## 代码要点

```js
const viewer = new Cesium.Viewer(box, {
  baseLayerPicker: false,       // 不显示图层选择器
  geocoder: false,              // 不显示地理编码器
  homeButton: false,            // 不显示主页按钮
  sceneModePicker: false,       // 不显示场景模式选择器
  navigationHelpButton: false,  // 不显示导航帮助按钮
  animation: false,             // 不显示动画控件
  timeline: false,              // 不显示时间线

    Cesium.Cartesian3.fromDegrees(baseLon, baseLat, baseHeight),
    new Cesium.HeadingPitchRoll(
      Cesium.Math.toRadians(0),
      Cesium.Math.toRadians(0),
      Cesium.Math.toRadians(0)
    ),
  ),
  scale: 10,
})

      duration: 0,
      offset: new Cesium.HeadingPitchRange(
        Cesium.Math.toRadians(-45),
        Cesium.Math.toRadians(-15),
        boundingSphere.radius * 3
      ),
    })
  }, 1000)
})
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/cesiumExamples/tools/transformControls.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=CesiumJS&classify=tools&id=transformControls) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[绘制图形并导出geojson](/examples/cesium/tools/Draw and export geojson)


> 相关工具 · Cesium.js · 6/6
