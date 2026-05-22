---
title: "cesium融合three - Cesium.js 案例讲解"
description: "Cesium 接第三方库或扩展能力。主流程在 `initCesium`、`initThree`。"
head:
  - - meta
    - name: keywords
      content: "cesium融合three,场景,融合"
outline: deep
---

# cesium融合three

*Cesium+Three*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=expand&id=cesiumAndThree)


![cesium融合three](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/expand/cesiumAndThree.jpg)


## 效果说明

Cesium 接第三方库或扩展能力。主流程在 `initCesium`、`initThree`。

> 扩展功能 · Cesium.js

## 实现思路

- 底图换 `ImageryProvider`：XYZ 模板、WMTS、ArcGIS 等，挂到 `viewer.imageryLayers`。

## 代码结构

- 相机同步

## 独立函数

- `initThree()` — 材质 / GLSL
- `render()` — renderer.render(scene, camera)
- `syncCesiumThree()` — 经纬高 ↔ Cartesian3

## 源码

```js
import * as Cesium from 'cesium'
import * as THREE from 'three'

const cesiumBox = document.getElementById('box')

const threeBox = document.createElement('div')

Object.assign(threeBox.style, {

    position: 'absolute',

    pointerEvents: 'none',

    zIndex: 1,

    width: '100%',

    height: '100%'

})

cesiumBox.appendChild(threeBox)

const minWGS84 = [115.23, 39.55] // 最小经纬度

const maxWGS84 = [116.23, 41.55] // 最大经纬度

initThree(threeBox,initCesium(cesiumBox))

// 初始化Cesium
function initCesium() {

    const viewer = new Cesium.Viewer(cesiumBox, { 
        baseLayerPicker: false, 
        imageryProvider: false, // 替换 baseLayer: false
        infoBox: false 
    })

    viewer.imageryLayers.addImageryProvider(

        new Cesium.WebMapTileServiceImageryProvider({

            url: "https://t0.tianditu.gov.cn/img_w/wmts?tk=c4e3a9d54b4a79e885fff9da0fca712a",
            layer: "img",
            style: "default",
            format: "tiles",
            tileMatrixSetID: "w"

        })

    )

    viewer.camera.flyTo({

        destination: Cesium.Cartesian3.fromDegrees((minWGS84[0] + maxWGS84[0]) / 2, (minWGS84[1] + maxWGS84[1]) / 2 - 1, 200000),

        orientation: { heading: Cesium.Math.toRadians(0), pitch: Cesium.Math.toRadians(-60), roll: Cesium.Math.toRadians(0) }

    })

    return viewer

}

functi
```

### 相机同步

```js
function syncCesiumThree(group, camera, viewer) {

    // 更新相机位置
    camera.fov = Cesium.Math.toDegrees(viewer.camera.frustum.fovy)

    // 笛卡尔坐标转换
    const cartToVec = cart => new THREE.Vector3(cart.x, cart.y, cart.z)

    // 获取经纬度范围
    const { minWGS84, maxWGS84 } = group.cesium

    // 转换为笛卡尔坐标
    const center = Cesium.Cartesian3.fromDegrees((minWGS84[0] + maxWGS84[0]) / 2, (minWGS84[1] + maxWGS84[1]) / 2)

    // 获取定向模型的前进方向
    const centerHigh = Cesium.Cartesian3.fromDegrees((minWGS84[0] + maxWGS84[0]) / 2, (minWGS84[1] + maxWGS84[1]) / 2, 1)

    // 左下坐标
    const bottomLeft = cartToVec(Cesium.Cartesian3.fromDegrees(minWGS84[0], minWGS84[1]))

    // 左上坐标
    const topLeft = cartToVec(Cesium.Cartesian3.fromDegrees(minWGS84[0], maxWGS84[1]))

    // 方向向量
    const latDir = new THREE.Vector3().subVectors(bottomLeft, topLeft).normalize()

    // 设置位置
    group.position.copy(center)

    // 看向中心
    group.lookAt(centerHigh.x, centerHigh.y, centerHigh.z)

    // 设置方向
    group.up.copy(latDir)

    // 更新相机
    camera.matrixAutoUpdate = false

    // 相机视图矩阵
    const cvm = viewer.camera.viewMatrix

    // 相机逆视图矩阵
    const civm = viewer.camera.inverseViewMatrix

    camera.matrixWorld.set(
        civm[0], civm[4], civm[8], civm[12],
        civm[1], civm[5], civm[9], civm[13],
        civm[2], civm[6], civm[10], civm[14],
    
```

