# Canvas裁剪图片
H5上使用Canvas裁剪图片还是比较简单的，

## 基础API使用
### 1. Canvas绘制图片API
绘制图片到Canvas上可以使用`ctx.drawImage()`方法，此方法有是三种用法:
* `ctx.drawImage(img, x, y)`: 从Canvas上`(x, y)`位置开始绘制图像
* `ctx.drawImage(img, x, y, width, height)`: 从Canvas上`(x, y)`位置开始绘制图像, 绘制的图片大小为width、height(会缩放图片，不会剪切)
* `ctx.drawImage(img, sx, sy, swidth, sheight, x, y, width, height)`: 此方法会剪切、缩放图片并绘制到Canvas上，详细参数如下:
  * `img`: 需要使用的图片、画布、或者视频
  * `sx`: (可选)开始剪切的图片上的X坐标位置
  * `sy`: (可选)开始剪切的图片上的Y坐标位置
  * `swidth`: (可选)被剪切的图片的宽度
  * `sheight`: (可选)被剪切的图片的高度
  * `x`: 在画布上放置图像的X坐标位置
  * `y`: 在画布上放置图像的Y坐标位置
  * `width`: (可选)要使用的图像的宽度
  * `height`: (可选)要使用的图像的高度

  其中截图功能主要使用的参数如下:
    * `sx, sy`: 截图图片的起始位置(左上角开始计算)
    * `swidth, sheight`: 截图图片的宽高(实际图片的真是大小)
    * `x, y`: (截图结果图片展示的左上角位置)
    * `width, height`: 截图结果图片的宽高

### 2. Canvas图像数据转为图片数据API
Canvas图像转为图片数据的方法主要有三个，如下:
| 方法 | 效果 |
| --- | --- |
| ctx.toDataUrl() | 将Canvas转为base64 |
| ctx.getImageData() | 保存Canvas内容 |
| ctx.putImageData() | 渲染保存的Canvas内容 |

### Canvas转为图像
使用方法：`canvas.toDataURL(type, encoderOptions)`, 两个参数如下：
* `type`: 图片格式，默认为`image/png`
* `encoderOptions`: 在指定图片格式为`image/jpeg`或`image/webp`的情况下，可以从`0`到`1`的区间内选择图片的质量。如果超出取值范围，将会使用默认值`0.92`。其他参数会被忽略。


### 3. 文件处理
* `FileReader.readAsDataUrl(file)`: 可以获取到文件转为DataUrl数据
* `URL.createObjectUrl(file)`: 最好主动释放`URL.revokeObjectURL(objectURL);`

### 引用文档
* [Canvas教程](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial)
* [canvas - 裁剪并保存图片](https://blog.csdn.net/qq_40243950/article/details/91472278)
* [Blob,FileReader全面解析](https://blog.csdn.net/swimming_in_IT_/article/details/84304649)