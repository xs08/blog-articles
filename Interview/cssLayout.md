# CSS布局问题

## 三栏布局(左右固定宽度，中间自适应)
1. 浮动布局: float+margin
* 缺点: 有局限性，float脱离文档流，需要清除浮动等
* 优点: 快捷、简单、兼容性较好
> 注意: 必须把main写在right后面
```html
<div class="container">
  <div class="left"></div>
  <div class="right"></div>
  <div class="main"></div>
</div>
```
```css
html,body,.container {
  margin: 0;
  padding: 0;
  height: 100%;
}
.left {
  float: left;
  width: 200px;
  height: 100%;
}
.right {
  float: left;
  width: 200px;
  height: 100%;
}
.main {
  margin: 0 200px;
  height: 100%;
}
```

2. 定位布局: position
* 缺点: 脱离文档流，高度未知会出现问题。可用性不是很好
* 优点: 简单粗暴
> 中间盒子可以`margin`，也可以绝对定位