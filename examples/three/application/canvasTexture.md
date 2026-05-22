---
title: "Canvas贴图 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,Canvas贴图"
outline: deep
---
# Canvas贴图

*Canvas Texture*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=canvasTexture)

![Canvas贴图](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/canvasTexture.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- ECharts 与三维融合
- requestAnimationFrame 渲染循环

## 效果说明

Three.js 业务向场景组合。

> 应用场景 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- 二维图表/飞线与 Cesium/Three 场景叠加或纹理映射。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as echarts from 'echarts'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(0, 0, 3)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const w = 800, h = 600
const container = document.createElement('canvas')
// 设置实际尺寸而不是CSS尺寸
container.width = w
container.height = h
// 保持CSS尺寸以便echarts正确初始化
container.style.width = w + "px"
container.style.height = h + "px"

const myChart = echarts.init(container, null, {
    devicePixelRatio: window.devicePixelRatio // 使用正确的设备像素比
})
const texture = new THREE.CanvasTexture(container)
// 设置贴图过滤模式以提高清晰度
texture.minFilter = THREE.LinearFilter
texture.magFilter = THREE.LinearFilter

// 计算保持纵横比的平面尺寸
const aspectRatio = w / h
const planeWidth = 4
const planeHeight = planeWidth / aspectRatio
const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
const planeMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)

const uniforms = {
    iResolution: {
        type: 'v2',
        value: new THREE.Vector2(box.clientWidth, box.clientHeight)
    },
    iTime: {
        type: 'f',
        value: 1.0
    }
}
planeMaterial.onBeforeCompile = shader => {
    shader.uniforms.iResolution = uniforms.iResolution
    shader.uniforms.iTime = uniforms.iTime
    shader.fragmentShader = shader.fragmentShader.replace(/#include <common>/, `
        uniform vec2 iResolution;
        uniform float iTime;
        #include <common> 
    `)
    shader.fragmentShader = shader.fragmentShader.replace('vec4 diffuseColor = vec4( diffuse, opacity );', `
        vec3 c;
        float l,z=iTime;
        for(int i=0;i<3;i++) {
            vec2 uv,p=gl_FragCoord.xy/iResolution;
            uv=p +  2.0;
            p-=.5;
            p.x*=iResolution.x/iResolution.y;
            z+=.07;
            l=length(p);
            uv+=p/l*(sin(z)+1.)*abs(sin(l*9.-z-z));
            c[i]=.01/length(mod(uv,1.)-.5);
        }
        vec4 diffuseColor = vec4( diffuse * c  * vec3(8.,8.,8.), opacity );
    `)
}

animate()

function animate() {
    texture.needsUpdate = true
    uniforms.iTime.value += 0.05
    requestAnimationFrame(animate)
    renderer.render(scene, camera)

}

const data = [820, 932, 901, 934, 1290, 1330, 1320]
const option = {
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            data,
            type: 'line',
            areaStyle: {}
        }
    ]
}
myChart.setOption(option)
setInterval(() => {
    data.forEach((item, index) => {
        data[index] = Math.floor(Math.random() * 1000)
    })
    myChart.setOption({
        series: [{
            data: data
        }]
    })
}, 2000)
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=canvasTexture) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
