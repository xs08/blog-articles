# Libraries(相关库)
> Cornerstone是一个开源项目，旨在提供一个完整的基于Web的医学成像平台。它提供了可以一起使用或独立使用的模块化库。
![相关库关系图](https://docs.cornerstonejs.org/assets/img/library-hierarchy.png)

Cornerstone生态系统的核心库就是cornerstone。他主要处理[image rendering pipeline(图像渲染管线)](https://docs.cornerstonejs.org/concepts/rendering-pipeline.html), [loading(加载)](https://docs.cornerstonejs.org/concepts/image-loaders.html), [chching(缓存)](https://docs.cornerstonejs.org/advanced/image-cache.html)和[viewport transformations(视口转换)](https://docs.cornerstonejs.org/concepts/viewports.html)

除了核心库外，Cornerstone开发团队还支持其他几个库，这些库为开发复杂的成像应用程序提供了生态系统。

| 库 | 描述 |
| -- | ---- |
| [Cornerstone Core](https://github.com/cornerstonejs/cornerstone) |	核心库，提供图像渲染，加载，缓存和视口转换 |
| [Cornerstone Tools](https://github.com/cornerstonejs/cornerstoneTools) |	对构建工具的扩展支持，对鼠标，键盘和触摸设备的支持 |
| [Cornerstone WADO Image Loader](https://github.com/cornerstonejs/cornerstoneWADOImageLoader)| 用于DICOM第10部分文件的图像加载器 |
| [Cornerstone Web Image Loader](https://github.com/cornerstonejs/cornerstoneWebImageLoader) |	用于Web图像文件（PNG，JPEG）的图像加载器 |
| [Cornerstone Math](https://github.com/cornerstonejs/cornerstoneMath) |	数学工具功能和类以支持工具开发 |
| [dicomParser](https://github.com/cornerstonejs/dicomParser) |	强大的DICOM第10部分解析库 |