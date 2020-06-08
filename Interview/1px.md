# CSS中常用的1px怎样实现及原因
造成CSS中1px并不等于移动设备的1px的原因是什么呢?原因就是因为不同的手机有不同的设备像素密度。在window对象中有一个devicePixelRatio属性，可以反应CSS中的像素与设备像素比
> devicePixelRatio的官方定义为: 设备的物理像素和设备的独立像素的比例，也就是: devicePixelRatio=物理像素/独立像素

## 怎样实现1PX边框

### 1.iOS8及以上可以使用0.5px
* 优点: 使用方便，直接编写
* 缺点: 无法兼容安卓设备，iOS8以下不识别
可以使用如下代码检测是否支持:
```javascript
((window) => {
  if (window.devicePixelRatio && window.devicePixelRatio >= 2) {
    const testEle = document.createElement('div')
    document.body.appendChild(testEle)

    if (testEle.offsetHeight == 1) {
      window.supportHalfPixel = true
    }

    document.body.removeChild(testEle)
  }
}(window))

// 如果window.supportHalfPixel == true, 则可以直接使用0.5px
```

### 2. 使用border-image
* 优点: 可以设置单条，多条边框；没有性能瓶颈
* 缺点: 1.修改颜色麻烦，需要替换图片 2.圆角需要特殊处理，并且边缘会模糊
实现上，非视网膜屏可能无法显示，所以需要特殊处理下:
```css
.border-1px {
  border-bottom: 1px solid #666;
}
@media only screen and (-webkit-min-device-pixel-ratio: 2) {
  .border-1px {
    border-bottom: none;
    border-width: 1px;
    border-image: url(border.img) 0 0 2 0 stretch;
  }
}
```

### 3. 使用background-image实现
* 优点: 可以设置单条、多条边框，没有性能瓶颈问题
* 缺点: 圆角需要特殊处理，并且边缘会模糊
实现方式如下:
```css
.background-image-1px {
  background: url(border.img) repeat-x left bottom;
  background-size: 100% 1px;
}
```

### 4. 使用背景多层渐变实现
* 缺点: 圆角没法实现，多背景图片有兼容问题
使用CSS3的背景渐变: 设置1px的渐变背景，50%有颜色，50%透明; 实现方式如下:
```css
.background-1px {
  background: linear-gradient(#000, #000 100%, transparent 100%) top 100% 1px no-repeat,
  linear-gradient(#000, #000 100%, transparent 100%) right 1px 100% no-repeat,
  linear-gradient(#000, #000 100%, transparent 100%) bottom  100% 1px no-repeat,
  linear-gradient(#000, #000 100%, transparent 100%) left 1px 100% no-repeat,
}
```

### 5. 使用box-shadow模拟边框
*　缺点: 边框有阴影，颜色会变浅
实现方式:
```css
.box-shadow-1px {
  box-shadow: inset 0px -1px -1px -1px #CCC;
}
```

### 6. viewport+rem实现
* 优点: 一套代码，基本可以兼容所有布局
* 缺点: 老项目改动代价过大，只适用新项目
同时设置viewport的rem基准值，这种方式可以像以前一样轻松愉快的写1px了。在devicePixelRatio=2时，输出viewport:
```html
<meta name="viewport" content="initial-scale=0.5,maximum-scale=0.5,minimum-scale=0.5,user-scalable=no">
```
devicePixelRatio=3时，输出viewport:
```html
<meta name="viewport" content="initial-scale=0.3333,maximum-scale=0.3333,minmum-scale=0.3333,user-scalable=no">
```

### 7. 伪类+transform实现
* 优点: 比较完美，可以实现圆角(伪类和本体都加上border-radius)
* 缺点: 对于已经使用了伪类的元素，可能需要多重嵌套
伪类+trnasform应该是比较完美解决老项目的办法了。原理是适用:before和:after放置到边框位置，并使用transform将其高/宽度scale到原来的一般，原先的元素相对定位，新做的border绝对定位就可以了。实现方式大致如下:
```css
/* 单条边框 */
.scale-1px {
  position: relative;
  border: node;
}
.scale-1px:after {
  content: '';
  position: absolute;
  bottom: 0;
  background: #000;
  width: 100%;
  height: 1px;
  transform: scaleY(0.5);
  transform-origin: 0 0;
}
/* 四条边框 */
.scale-1px {
  position: relative;
  border: none;
  margin-bottom: 20px;
}
.scale-1px: after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid #000;
  box-sizing: border-box;
  widht: 200%;
  height: 200%;
  transform: scale(0.5);
  transform-origin: left top;
}
```
最好使用前也使用判断一下，结合JS代码，判断是否Retine屏:
```javascript
if (window.devicePixelRatio && window.devicePixelRatio <= 2) {
  // Redine屏幕
}
```


### 参考文章
* [1px on retina](https://efe.baidu.com/blog/1px-on-retina/)
* [在retina屏中实现1px border效果](https://imweb.io/topic/55e3d402771670e207a16bd1)
* [Retina屏的移动设备如何实现真正1px的线？](http://jinlong.github.io/2015/05/24/css-retina-hairlines/)
* []()

* [7种方法解决移动端Retina屏幕1px边框问题](https://www.jianshu.com/p/7e63f5a32636)
* [使用Flexible实现手淘H5页面的终端适配](https://github.com/amfe/article/issues/17)
