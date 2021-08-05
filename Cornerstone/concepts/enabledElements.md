# Enabled Elements(启用元素)
> 在`Cornerstone`中，一个**Enabled Elements**元素是一个 HTML元素（通常是div），我们在其中显示交互式医学图像

要显示图像，Web开发人员需要执行以下操作：
1. 通过网页中的脚本标签引用Cornerstone JavaScript库文件
2. JS中引用的各种不同的`图像加载器`([Image Loader](https://docs.cornerstonejs.org/concepts/image-loaders.html))将用于在网页中实际加载像素数据(例如WADO，WADO-RS，自定义格式等)
3. 向DOM中添加一个元素，该元素将用于显示内部的图像
4. 使用CSS将元素以及所需的宽度和高度放置在页面上
5. 调用[enable()](https://docs.cornerstonejs.org/api.html#enable)`API以准备要显示图像的元素
6. 使用[loadImage()](https://docs.cornerstonejs.org/api.html#loadimage)`API加载图像
7. 使用[displayImage()](https://docs.cornerstonejs.org/api.html#displayimage)`API显示加载的图像

有关使用`cornerstone`所需的最少代码，请参见[最小使用的例子](https://rawgit.com/chafey/cornerstone/master/example/jsminimal/index.html)。

您可能还希望包括[Cornerstone工具库](https://github.com/chafey/cornerstoneTools)，以使用现成的工具，例如窗口，平移，缩放和测量。