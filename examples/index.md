---
layout: doc
title: Three.js Cesium.js 案例讲解
description: three-cesium-examples 380 个案例源码讲解
outline: [2, 3]
---

# 案例讲解

380 个 WebGL / Three.js / Cesium.js 案例，每篇按 **效果说明 → 核心概念 → 实现步骤 → 代码要点 → 源码** 的结构讲解。在线运行与完整源码见 [three-cesium-examples](https://z2586300277.github.io/three-cesium-examples/)。

> 本分类案例均已对照 [three-cesium-examples](https://github.com/z2586300277/three-cesium-examples/tree/dev) 源码生成精讲文档。


[▶ 案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/example)

## 推荐学习路径

| 阶段 | 目录 | 说明 |
|------|------|------|
| 1️⃣ 入门 | [Three.js 入门案例](/examples/three/introduction/) | 15 篇：Scene / Camera / Renderer、几何体、动画循环 |
| 2️⃣ 基础 | [Three.js 基础案例](/examples/three/basic/) | 模型加载、阴影、控制器、后期处理入门 |
| 3️⃣ 进阶 | [着色器](/examples/three/shader/) · [粒子](/examples/three/particle/) · [后期](/examples/three/effectComposer/) | 自定义 GLSL、特效合成 |
| 4️⃣ 地球 | [Cesium 基础](/examples/cesium/basic/) · [图层](/examples/cesium/layer/) | Viewer、Entity、3D Tiles、影像地形 |
| 5️⃣ 实战 | [应用场景](/examples/three/application/) · [Cesium 应用](/examples/cesium/applyExample/) | 智慧城市、飞线、导航等完整场景 |

> 每篇案例文末标注所属分类；入门系列建议按顺序阅读，其余可按兴趣跳转。

## Three.js (301)

### 首页导航 (5)

- [感谢来自BiBi的支持](/examples/three/friendStation/thanksBibi)
- [低代码组态编辑器](/examples/three/friendStation/z2586300277_3d_editor)
- [官方示例 - 优化版](/examples/three/friendStation/officialExamples)
- [ThreeJS资源库](/examples/three/friendStation/threejsHome)
- [优雅永不过时](/examples/three/friendStation/z2586300277_info)

### 着色器 (89)

- [城市光效](/examples/three/shader/cityEffect)
- [草地着色器](/examples/three/shader/grassShader)
- [2025](/examples/three/shader/2025Year)
- [音乐可视化](/examples/three/shader/audioSolutions)
- [1000stars留念](/examples/three/shader/700stars)
- [城市混合扫光](/examples/three/shader/cityBlendLight)
- [全部 89 个](/examples/three/shader/)

### 粒子 (27)

- [优雅永不过时](/examples/three/particle/z2586300277)
- [随机粒子效果](/examples/three/particle/RandomParticle)
- [粒子效果的行星](/examples/three/particle/PlanetParticle)
- [粒子泡泡](/examples/three/particle/bubble)
- [粒子混合着色器](/examples/three/particle/particleBlendShader)
- [粒子聚散](/examples/three/particle/particleScattered)
- [全部 27 个](/examples/three/particle/)

### 游戏复刻 (3)

- [终末地-登录入口](/examples/three/game/zmdIndex)
- [人物虚化](/examples/three/game/characterBlur)
- [终末地-据点围栏](/examples/three/game/zmdFence)

### 应用场景 (68)

- [优雅永不过时](/examples/three/application/z2586300277)
- [魔法阵](/examples/three/application/magicCircle)
- [代码云](/examples/three/application/codeCloud)
- [鬼屋](/examples/three/application/ghostHouse)
- [Canvas贴图](/examples/three/application/canvasTexture)
- [贴图飞线](/examples/three/application/flowLine)
- [全部 68 个](/examples/three/application/)

### 动画效果 (15)

- [animejs使用](/examples/three/animation/animejsBasic)
- [gsap使用](/examples/three/animation/gsapBasic)
- [Theatrejs](/examples/three/animation/Theatrejs)
- [动画合集](/examples/three/animation/gsapCollection)
- [裁剪动画](/examples/three/animation/clipAnimation)
- [第一人称漫游控制](/examples/three/animation/pointLockControls)
- [全部 15 个](/examples/three/animation/)

### 物理应用 (2)

- [物理cannon使用](/examples/three/physics/physicsMesh)
- [物理ammo使用](/examples/three/physics/ammoPhysics)

### 扩展功能 (19)

- [本地模型加载](/examples/three/expand/localModel)
- [IndexedDB使用](/examples/three/expand/useIndexDB)
- [加载3dtiles](/examples/three/expand/loadTiles)
- [3D地图](/examples/three/expand/map3d)
- [分级地图](/examples/three/expand/areaMap)
- [地理边界](/examples/three/expand/geoBorder)
- [全部 19 个](/examples/three/expand/)

### 后期处理 (10)

- [辉光-postprocessing](/examples/three/effectComposer/selectBloomPass)
- [自定义遮罩通道](/examples/three/effectComposer/customMaskPass)
- [UV图像变换](/examples/three/effectComposer/uvTransformation)
- [残影效果](/examples/three/effectComposer/afterimagePass)
- [模糊反射(drei转原生)](/examples/three/effectComposer/blurReflect)
- [饱和度(自定义Pass)](/examples/three/effectComposer/saturationPass)
- [全部 10 个](/examples/three/effectComposer/)

### 基础案例 (35)

- [人物模型动画案例](/examples/three/basic/modelAnimation)
- [gltf/fbx/obj模型加载](/examples/three/basic/modelLoad)
- [模型阴影](/examples/three/basic/modelShadow)
- [天空盒](/examples/three/basic/skyAndEnv)
- [相机属性](/examples/three/basic/cameraAttribute)
- [轨道控制器](/examples/three/basic/orbControls)
- [全部 35 个](/examples/three/basic/)

### 入门案例 (15)

- [入门](/examples/three/introduction/入门)
- [辅助线](/examples/three/introduction/辅助线)
- [光线](/examples/three/introduction/光线)
- [相机控件](/examples/three/introduction/相机控件)
- [动画](/examples/three/introduction/动画)
- [全屏](/examples/three/introduction/全屏)
- [全部 15 个](/examples/three/introduction/)

### 相关工具 (13)

- [sketchfab免费模型](/examples/three/tools/sketchfab_model)
- [开源shader社区](/examples/three/tools/shaderToy)
- [免费hdr全景图资源](/examples/three/tools/skyBox_image)
- [gltf在线draco压缩工具](/examples/three/tools/gltf_report)
- [hdr制作天空盒](/examples/three/tools/skyBox_Make)
- [字体转Three使用json字体](/examples/three/tools/make_json_font)
- [全部 13 个](/examples/three/tools/)

## Cesium.js (79)

### 首页导航 (3)

- [CesiumJS官网](/examples/cesium/topStation/cesiumjsHome)
- [Cesium案例 - 点⭐](/examples/cesium/topStation/jiawanlong)
- [CesiumJS 例子](/examples/cesium/topStation/CesiumJsSamples)

### 在线地图 (12)

- [默认图层](/examples/cesium/layer/defaultLayer)
- [坐标参考](/examples/cesium/layer/coordLayer)
- [百度图层](/examples/cesium/layer/baiduLayer)
- [arcgis图层](/examples/cesium/layer/arcgisLayer)
- [高德图层](/examples/cesium/layer/gaodeLayer)
- [地图滤镜](/examples/cesium/layer/mapfilterLayer)
- [全部 12 个](/examples/cesium/layer/)

### 离线地图 (7)

- [蓝色](/examples/cesium/offline/offlineBlue)
- [夜间](/examples/cesium/offline/day)
- [影像](/examples/cesium/offline/img)
- [夜间](/examples/cesium/offline/night)
- [内网百度](/examples/cesium/offline/baiDu)
- [内网高德](/examples/cesium/offline/gaode)
- [全部 7 个](/examples/cesium/offline/)

### 基础功能 (19)

- [视角切换](/examples/cesium/basic/switchView)
- [记录视角](/examples/cesium/basic/cameraView)
- [自动旋转](/examples/cesium/basic/autoRotate)
- [绘制文字](/examples/cesium/basic/cesiumText)
- [css2D元素](/examples/cesium/basic/cssElement)
- [点击事件](/examples/cesium/basic/clickEvent)
- [全部 19 个](/examples/cesium/basic/)

### 单一效果 (11)

- [粒子（火焰）](/examples/cesium/singleEffect/fire)
- [水波纹](/examples/cesium/singleEffect/ripple)
- [雷达扫描](/examples/cesium/singleEffect/radar)
- [使用Shadertoy](/examples/cesium/singleEffect/cesiumShadertoy)
- [雷达探测](/examples/cesium/singleEffect/radarEmission)
- [动态围墙](/examples/cesium/singleEffect/dynamicWall)
- [全部 11 个](/examples/cesium/singleEffect/)

### 高级特效 (6)

- [雪景](/examples/cesium/advancedEffect/snow)
- [下雨](/examples/cesium/advancedEffect/rain)
- [镜头光晕](/examples/cesium/advancedEffect/lensFlare)
- [智慧城市着色器](/examples/cesium/advancedEffect/tilesShader)
- [城市光影](/examples/cesium/advancedEffect/cityLight)
- [智慧城市光](/examples/cesium/advancedEffect/smartCity)

### 应用相关 (9)

- [流动飞线运动](/examples/cesium/applyExample/flyLine)
- [曲线管道](/examples/cesium/applyExample/curvePipe)
- [路线导航](/examples/cesium/applyExample/routeNavigation)
- [曲线漫游](/examples/cesium/applyExample/cameraCurveRoam)
- [渐变行政区](/examples/cesium/applyExample/gradienGeojsonFace)
- [实例化渲染](/examples/cesium/applyExample/instanceRender)
- [全部 9 个](/examples/cesium/applyExample/)

### 扩展功能 (6)

- [cesium融合three](/examples/cesium/expand/cesiumAndThree)
- [Cesium Three切换](/examples/cesium/expand/cesiumSwitch)
- [echarts飞线](/examples/cesium/expand/echartsFlyLine)
- [热力图](/examples/cesium/expand/heatMap)
- [3D热力图](/examples/cesium/expand/3DheatMap)
- [交通线路](/examples/cesium/expand/transportLine)

### 相关工具 (6)

- [地图转换工具](/examples/cesium/tools/mapDataConvert)
- [地图下载器](/examples/cesium/tools/layerDownload)
- [计算新坐标](/examples/cesium/tools/computerNewPoint)
- [计算方位角](/examples/cesium/tools/computerAngle)
- [绘制图形并导出geojson](/examples/cesium/tools/Draw and export geojson)
- [Cesium 3D 变换控制器](/examples/cesium/tools/transformControls)
