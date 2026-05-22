---
title: "下雨 - Cesium.js 案例讲解"
description: "场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。主流程在 `initViewer`、`addMaterial`。"
head:
  - - meta
    - name: keywords
      content: "雨景，雨滴效果"
outline: deep
---

# 下雨

*Rain*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=advancedEffect&id=rain)


![下雨](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/expand/rain.jpg)


## 效果说明

场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。主流程在 `initViewer`、`addMaterial`。

> 高级特效 · Cesium.js

## 实现思路

- 屏幕空间后期：`PostProcessStage` 或 `PostProcessStageLibrary` 里的 bloom、雨雪等全屏 Pass。

- 3D Tiles 倾斜摄影/白膜：`Cesium3DTileset.fromUrl`，可配 `heightReference`、style。

- 拾取用 `ScreenSpaceEventHandler` + `scene.pick` / `pickPosition`，注意地形深度。

- Model / 3D Tiles 上挂 `CustomShader`，直接写 GLSL 改 `czm_modelMaterial`。

## 着色器

### 片元

```glsl
uniform sampler2D colorTexture;
        in vec2 v_textureCoordinates;
        float hash(float x){
            return fract(sin(x*23.3)*13.13);
        }
        void main(){
            float time = czm_frameNumber / 120.0;
            vec2 resolution = czm_viewport.zw;
            vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);
            vec3 c=vec3(.6,.7,.8);
            float a=-.4;
            float si=sin(a),co=cos(a);
            uv*=mat2(co,-si,si,co);
            uv*=length(uv+vec2(0,8.9))*.3+1.;
            float v=1.-sin(hash(floor(uv.x*100
```

## 源码

```js
import * as Cesium from "cesium";

let viewer;
let tileset;
let rainEffect;
/**
 * 初始化viewer
 */
const initViewer = () => {
  const DOM = document.getElementById("box");
  viewer = new Cesium.Viewer(DOM, {
    animation: false,
    baseLayerPicker: false,
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(
      Cesium.ArcGisMapServerImageryProvider.fromUrl(
        "https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer"
      )
    ),
    fullscreenButton: false,
    timeline: false,
    infoBox: false,
  });
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function (event) {
    let cartesian = viewer.camera.pickEllipsoid(event.position);
    let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    let lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
    let lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
    let alt = cartographic.height; // 高度，椭球面height永远等于0
    let coordinate = {
      longitude: Number(lng.toFixed(6)),
      latitude: Number(lat.toFixed(6)),
      altitude: Number(alt.toFixed(2)),
    };
    console.log(coordinate);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  initScene();
  addMaterial();
  let interval;
  interval = setInterval(() => {
    if (tileset.customShader.uniforms.u_rainAlpha.value >= 0.5) {
      wind
```

