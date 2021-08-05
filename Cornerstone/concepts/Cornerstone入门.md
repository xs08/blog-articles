# Conrnerstone入门
cornerstone是医疗影像处理的开源库，可以支持许多特性。OHIF基于此做了一个Viewer，在此深入了解下怎样处理这个。跟着官方文档[Cornerstone](https://docs.cornerstonejs.org/)学习下

## 概念


* 渲染循环：由RAF驱动。如果RAF不可用，则使用setTimeout和clearTimeout使用16ms计时器进行填充。
当启用或禁用元素与Cornerstone一起使用时，将逐个元素执行渲染循环。

工作流程如下：
1. 向RAF注册了draw()回调
2. 在屏幕上显示一个框架之后，浏览器就会调用draw()
3. 执行draw回调时：
  1. 如果计划将元素重新渲染，则将其渲染并向RAF重新注册draw
  2. 如果没有计划重新渲染该元素，则不执行任何工作，并且向RAF重新注册该回调
  3. 如果元素为disabled，则不会重新注册该回调，从而结束渲染循环

这意味着：
1. cornerstone.draw()和cornerstone.invalidate()不会触发立即渲染视口。而是将图像标记为需要重新渲染
2. 每个基石元素都会注册自己的RAF循环
3. 如果在60Hz系统上渲染时间超过16毫秒，则跳过渲染该帧
4. 即使渲染时间比16ms短得多，每帧只能进行一次渲染
5. 所有交互（例如，开窗，平移，缩放等）都将合并并在下一帧中呈现