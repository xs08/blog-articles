# CSS动画问题

## 一、动画种类及其优缺点
1. CSS3动画: 
  * `transform`
  * `transistion`
  * `animation`
2. JavaScript动画(操做DOM, 修改CSS属性)
3. Canvas动画
4. SVG动画
5. WebGL动画
6. GIF动画: 
优点: 1. 实现简单 2. 几乎所有浏览器都支持
缺点:
  1. 支持颜色少，Alpha透明度支持差，锯齿毛边比较严重
  2. 交互上，不能直接控制播放暂停。灵活性差
  3. 复杂效果文件较大。(使用video替换[需要处理video控件显示]、使用giflossy/gifsicle对其进行压缩)
  4. 会引起页面周期性绘制。性能较差

## CSS逐帧动画
*W3C*规定`animation-timing-function`应该位于两个`keyframe`之间，而不是整个动画上。
使用CSS3动画的时间函数`animation-timing-function`的阶梯函数`steps`来实现逐帧动画连续播放。但是有以下问题:
使用REM布局时候，有两个问题: rem 的计算会存在误差，因此使用雪碧图时我们并不推荐用 rem。如果是逐帧动画的话，由于计算的误差，会出现抖动的情况。
1. 微观尺寸定位不准(20px左右)。解决方案是: 可以使用font-icon或者svg-icon解决(svg-icon有兼容性问题)
2. 逐帧动画容易有抖动(sprite在尺寸缩放后，帧与帧之间的像素互补现象[像素换算有小数点，使用round/ceil/floor取整，都会有不对其现象]导致动画抖动。1px由几个光点表示是由以终端的dpr决定)。解决方案是: 
  1. 每帧使用一张图片(资源消耗增多(文件size,请求等)，处理额外的动画..)
  2. 可以将背景图片缩放。需要计算
  3. 使用插入SVG的方法
  4. 非逐帧动画部分，使用rem做单位
  5. 逐帧动画部分，使用px做单位，再结合js对动画部分使用scale进行整体缩放

移动端兼容性良好: 相对于JS，CSS3逐帧动画使用简单，且效率更高(使用GPU进行渲染)

怎样理解`steps`函数机制:
1. `steps`接收两个参数: 第一个指定函数中间隔数量(必须是正整数)；第二个可选，指在每个间隔的起点(`start`)还是终点(`end`)发生阶跃变化，默认是`end`



### JS+Canvas+图片实现帧动画
```javascript
// <canvas id="canvas" width="300" height="300"></canvas>
(() => {
  const canvas = document.getElementById("canvas")
  const context = canvas.getContext("2d")
  const width = 300
  const height = 300

  context.clearRect(0, 0, width, height)
  context.drawImage(img, i * width, 0, width, height, 0, 0, width, height)
  window.requestAnimationFrame(drawImg)
})
```

### JS动画与CSS3动画比较
1. JS动画
**缺点:**使用CPU的计算能力，由于JS单线程执行。可能会由于计算量问题造成动画阻塞或者其他事件的阻塞
**优点:**控制能力强，能够实现复杂的交互动画。(可以将JS与CSS动画组合使用)

2. CSS动画
**缺点:**缺乏控制能力，较难组合多个动画效果
**优点:**浏览器级别的优化。它在必要时可以创建图层，然后在主线程之外运行



## CSS3动画性能优化
CSS动画制作过程中，提升移动端CSS3动画体验的主要方法主要有一下方面:

#### 1. 尽可能多的利用硬件能力，如使用3D变形来开启GPU加速
元素通过translate3D移动的流畅度会优于left/right属性。**原因:** CSS布局属性更改会引起整个页面重排relayout、重绘repaint、重组recompositePaint，这些操做通常是比较花费性能的，应该尽可能的避免此类操做
>　假如动画有闪烁，可以尝试添加: `backface-visibility: hidden; perspective:100;`等属性