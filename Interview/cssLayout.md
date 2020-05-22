# CSS相关问题

## 三栏布局(左右固定宽度，中间自适应)
下文布局实现均使用此基本样式与DOM文档:
```html
<div class="container">
  <div class="left">Left</div>
  <div class="main">Main</div>
  <div class="right">Right</div>
</div>
```
```css
html,body,.container {
  height: 100%;
  margin: 0;
  padding: 0;
}
.left, .right {
  width: 200px;
}
.left {
  background-color: red;
}
.right {
  background-color: blue;
}
.main {
  background-color: green;
}
```

1. 浮动布局: float+margin
* 缺点: 有局限性，float脱离文档流，需要清除浮动等
* 优点: 快捷、简单、兼容性较好
> 注意: 必须把main写在right后面。(此处需要单独写html)
```html
<div class="container">
  <div class="left"></div>
  <div class="right"></div>
  <div class="main"></div>
</div>
```
```css
.left {
  float: left;
  height: 100%;
}
.right {
  float: left;
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
```css
.left, .right {
  position: absolute;
  height: 100%;
}
.right {
  left: 0;
}
.right {
  right: 0;
}
/* margin */
.main {
  background: blue;
  margin: 0 200px;
  height: 100%;
}
/* position */
.main {
  position: absolute;
  left: 200px;
  right: 200px;
}
```

3. 弹性盒子: flex
* 缺点: 不兼容 ie9 及以下
* 优点: 移动端兼容性较好
```css
.container {
  display: flex;
}
.main {
  flex: 1;
}
```

4. 表格布局: table
* 缺点: seo不优化；当其中一个单元格高度超出的时候，其他的单元格也是会跟着一起变高的
* 优点: 兼容性很好(ie及以上)，父元素高度会被子元素撑开(不用担心高度塌陷)
```css
.container {
  display: table;
  width: 100%;
}
.container div {
  display: table-cell;
}
```

5. [网格布局: grid](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Grid_Layout)
* 缺点: 不兼容ie9及以下
* 优点: 简单强大，解决二维布局问题
```css
.container {
  display: grid;
  width: 100%;
  grid-template-rows: 100%;
  grid-template-columns: 200px auto 200px;
}
```

## CSS盒子模型
1. **box-sizing**属性值:
* `content-box`: 默认值。width和height属性分别应用到元素的内容框。在宽度和高度之外绘制元素的内边距、边框、外边距
* `border-box`: 为元素设定的width和height属性决定了元素的边框盒。就是说为元素指定的任何内边距和边框都将在已设定的宽度和高度内进行绘制。通过从已设定的宽度和高度分别减去外边距、边框和内边距才能得到内容的宽度和高度
* `inherit`: 从父元素的box-sizing属性继承
> **标准盒模型**: `box-sizing: content-box`，**IE盒模型**: `box-sizing: border-box`

2. BFC(Block Formating Context): 块级格式化上下文，是web页面中盒模型布局的CSS渲染模式，指一个独立的渲染区域或者说是一个独立的渲染容器
(1) BFC的形成条件:
 * html: 根元素会创建一个BFC
 * 浮动: float除none以外的值
 * 定位: position(absolute, fixed)
 * display: (inline-block, table-cell, table-caption)
 * overflow: 除了visiable之外的值(hidden, auto, scroll)
 * 弹性盒子: display(flex, inline-flex)
(2) BFC特性:
 * BFC元素内部的元素会在垂直方向上一个接一个的放置
 * 垂直方向上的距离由margin决定;(会有margin重叠)
 * BFC的区域不会与Float区域重叠;(放置浮动文字环绕，一般使用`overflow: hidden`)
 * 计算BFC高度时，浮动元素也会参与计算;(浮动元素的父元素创建BFC，清除浮动)
 * BFC就是页面上的一个独立容器，容器里面的子元素不会影响外面的元素

