---
title: "粒子泡泡 - Three.js 案例讲解"
description: "粒子泡泡：Scene / Camera / Renderer 渲染管线、相机交互控制器、ShaderMaterial / RawShaderMaterial 自定义 GLSL（粒子）"
head:
  - - meta
    - name: keywords
      content: "three.js,particle,bubble,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 粒子泡泡

*Bubble*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=bubble)

![粒子泡泡](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/bubble.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- ShaderMaterial / RawShaderMaterial 自定义 GLSL
- 粒子 / 点云 / 实例化渲染
- GUI 参数调试面板

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，粒子或点云特效，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- **ShaderMaterial** 自定义 uniforms + vertex/fragment；**RawShaderMaterial** 需手写全部 shader 声明。
- 大量点用 **BufferGeometry + Points** 或 **InstancedMesh** 合批，避免逐 Entity 创建。
- dat.GUI / lil-gui 绑定 uniform 或配置对象实时调参。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. 定义 uniforms，在 rAF 中更新并 render
4. 构建几何 attribute 或 instanceMatrix 并 add 到 scene
5. gui.add 绑定可调参数

## 代码要点

```js
const {
    Color, ShaderMaterial,
    BufferGeometry, Points,
    Vector3, Float32BufferAttribute,
} = THREE


class Bubble extends Points {



    vertexShader = `
varying vec2 vUv;     //创建uv变量,用于给片元着色器传递uv
uniform float u_time; //从前端接收u_time
uniform float speed;  //从前端接收speed
uniform float size;   //从前端接收size
uniform float emitter;//发射器类型
uniform float maxHeight;//从前端接收maxHeight
attribute float data1;


    fragmentShader = `
uniform vec3 color;//从前端接收颜色
varying vec2 vUv; //获取从顶点着色器传递过来的uv
void main(){
    
    //气泡计算公式, 根据中心到边缘的距离设定透明度
    float dis = pow(  distance(  gl_PointCoord  ,  vec2(0.5,0.5)  )   ,2.0);
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/particle/bubble.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=bubble) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[粒子效果的行星](/examples/three/particle/PlanetParticle)
- 下一篇：[粒子混合着色器](/examples/three/particle/particleBlendShader)

> 粒子 · Three.js · 4/27
