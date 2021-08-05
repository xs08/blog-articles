# Image Ids(图像ID)
> Cornerstone中的`Image Ids(图像ID)`指的是用于展示的图片的URL链接

Cornerstone使用Image Id中的URL方案来确定要实际加载图像要调用的[Image Loader](https://docs.cornerstonejs.org/concepts/image-loaders.html)插件。这种策略允许Cornerstone同时显示从不同服务器使用不同协议获取的多个图像。例如，Cornerstone可以显示通过[WADO](https://en.wikipedia.org/wiki/DICOMweb)获得的DICOM、CT图像以及由数码相机捕获并存储在文件系统中的JPEG皮肤病学图像等

## Image Ids格式

![image ids format](https://docs.cornerstonejs.org/assets/img/image-id-format.png)
Cornerstone没有指定URL的内容是什么, 而是由Image Loader定义URL的内容和格式，以便它可以找到图像。例如，可以编写一个专有的Image Loader插件，他可以使用GUID/文件名或数据库行ID与专有服务器对话并查找图像。

以下是一些有关不同的Image Loader插件的Image Id的示例：
* `example://1`
* `dicomweb://server/wado/{uid}/{uid}/{uid}`
* `http://server/image.jpeg`
* `custom://server/uuid`