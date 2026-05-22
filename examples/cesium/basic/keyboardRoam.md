---
title: "键盘漫游 - Cesium.js 案例讲解"
description: "keydown/keyup + clock.onTick 驱动相机 WASD 漫游"
head:
  - - meta
    - name: keywords
      content: "cesium.js,键盘漫游,camera,onTick"
outline: deep
---

# 键盘漫游

*Keyboard Roam*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=keyboardRoam)

![键盘漫游](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/keyboardRoam.jpg)

## 你将学到什么

- **flags 状态表** 跟踪按键按下
- **clock.onTick** 每帧根据 flags 移动相机
- 禁用 **screenSpaceCameraController** 避免与鼠标冲突
- 移动速率随 **相机高度** 自适应

## 效果说明

GUI「启动键盘漫游」后：WASDQE 调姿态，IJKLUO 平移，1234 观察方向，方向键驱动地球自转；「停止」恢复鼠标控制。

## 核心概念

### 按键 → flag 映射

```js
document.addEventListener('keydown', (e) => {
    const flagName = getFlagFromKeyboard(e); // 'moveForward', 'pitchUp' ...
    if (flagName) flags[flagName] = true;
});
document.addEventListener('keyup', (e) => {
    if (flagName) flags[flagName] = false;
});
```

### onTick 更新

```js
viewer.clock.onTick.addEventListener(() => {
    const moveRate = (cameraHeight / 150.0) * setStep;
    if (flags.moveForward) camera.moveForward(moveRate);
    if (flags.headingLeft) camera.setView({ orientation: { heading: heading - 0.005 } });
    // ...
});
```

### 禁用默认交互

```js
viewer.scene.screenSpaceCameraController.enableTranslate = false;
viewer.scene.screenSpaceCameraController.enableTilt = false;
```

退出漫游时记得 **removeEventListener** 并 re-enable。

## 实现步骤

1. 定义 `flags` 对象与 `keyboardRoamObj` GUI
2. `startKeyboardRoam(step)` 注册 keydown/keyup/onTick
3. `getFlagFromKeyboard` 映射键码
4. `quitKeyboardRoam` 清理监听、恢复 controller

## 按键一览

| 键 | 作用 |
|----|------|
| WASDQE | 俯仰 / 偏航 / 翻滚 |
| IJKLUO | 前后左右上下平移 |
| 1234 | 观察方向微调 |
| 方向键 | 地球自转 |

## 源码

完整源码见 [GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/cesiumExamples/basic/keyboardRoam.js)。

## 小结

- 第一人称巡检、室内漫游常用此模式；也可封装为 `CameraController` 类
- 上一篇：[绘制线](/examples/cesium/basic/drawLine) · 下一篇：[官方点聚合](/examples/cesium/basic/officialPointCluster)

> 基础功能 · Cesium.js · 17/19
