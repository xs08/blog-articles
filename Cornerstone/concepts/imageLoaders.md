# Image Loaders(图像加载器)
> Image Loader是一个JavaScript函数，功能是负责解析传入的Image Ids并返回一个**Image Load Object**传入到Cornerstone。(**Image Load Object**是指会resolve一个图片数据的`Promise`)

由于加载图像通常需要从服务器获取，因此图像加载的API必须是异步的。Cornerstone 要求图像加载器返回一个包含Promise的对象，Cornerstone将使用该对象异步接收图像数据，如果解析错误的将会传入一个[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)到Cornerstone中。

## Image Loader Workflow(图像加载器工作流程)
![image loader workflow](https://docs.cornerstonejs.org/assets/img/image-loader-workflow.png)
1. ImageLoader向Cornerstone注册自己，用来加载特定的ImageId URL Schema
2. 应用程序使用`loadImage()`api加载图像。
3. Cornerstone会把加载图像数据的任务委托给已经注册过用来处理传入的特定imageId URL Schema的图像加载器
4. ImageLoader将返回一个包含Promise的Image Load对象，一旦获得像素数据，它将与相应的[Image Object](https://docs.cornerstonejs.org/concepts/images.html)一起解析。获取像素数据可能需要使用XMLHttpRequest调用远程服务器，对像素数据进行解压缩（例如从JPEG 2000中解压缩），以及将像素数据转换为Cornerstone可以理解的格式（例如RGB、YBR颜色）
5. 然后，使用API显示已解析的Promise返回的图像对象displayImage()

尽管像素数据通常是从服务器获取的，但并非总是如此。示例实际上使用ImageLoader插件来提供图像，而根本不需要服务器。在这种情况下，图像经过base64编码并存储在ImageLoader插件本身中。该插件仅将base64像素数据转换为像素数组。或者，可以编写一个图像加载器，在客户端生成派生图像。通常可以通过这种方式实现MPR这样的功能

## 可用的Image Loaders
| Image Loader | Used for |
| ------------ | -------- |
| [Cornerstone WADO Image Loader](https://github.com/cornerstonejs/cornerstoneWADOImageLoader) | DICOM第10部分图像<br />支持WADO-URI和WADO-RS<br />支持多帧DICOM实例<br />支持从File对象读取DICOM文件 |
| [Cornerstone Web Image Loader](https://github.com/cornerstonejs/cornerstoneWebImageLoader) | PNG和JPEG图像 |
> 如果您有要添加到此列表的图像加载器，请随时发送请求请求。

## Image Load Object(图像加载对象)
Cornerstone图像加载器返回包含Promise的**Image Load Object(图像加载对象)**。我们选择使用对象而不是仅返回Promise的原因是因为现在图像加载器还可以在其图像加载对象中返回其他属性。例如，我们打算使用在图像加载对象内由图像加载器传回的*cancelFn*来实现取消未决或正在进行的请求的支持(开发中)

## 编写一个图片加载器
这是一个图像加载器的示例，该图像加载器使用XMLHttpRequest获取像素数据，并将包含Promise的图像加载对象返回给Cornerstone:
```javascript
function loadImage(imageId) {
    // Parse the imageId and return a usable URL (logic omitted)
    const url = parseImageId(imageId);
    // Create a new Promise
    const promise = new Promise((resolve, reject) => {
      // Inside the Promise Constructor, make
      // the request for the DICOM data
      const oReq = new XMLHttpRequest();
      oReq.open("get", url, true);
      oReq.responseType = "arraybuffer";
      oReq.onreadystatechange = function(oEvent) {
          if (oReq.readyState === 4) {
              if (oReq.status == 200) {
                  // Request succeeded, Create an image object (logic omitted)
                  const image = createImageObject(oReq.response);
                  // Return the image object by resolving the Promise
                  resolve(image);
              } else {
                  // An error occurred, return an object containing the error by
                  // rejecting the Promise
                  reject(new Error(oReq.statusText));
              }
          }
      };

      oReq.send();
    });

    // Return an object containing the Promise to cornerstone so it can setup callbacks to be
    // invoked asynchronously for the success/resolve and failure/reject scenarios.
    return {
      promise
    };
}
```

图像加载器负责返回与传递给其loadImage函数的Image ids相对应的Image Load Object。Image Load Object中的Promise resolve后，应使用Image解决。图像加载器使用API为给定的URL方案注册自己：registerImageLoader()
```javascript
// 将 匹配到'myCustomLoader'的url协议的图像加载器注册到cornerstone，以便遇到'myCustomLoader'协议开头的图像时会使用此加载器进行加载
cornerstone.registerImageLoader('myCustomLoader', loadImage);
// 图像链接使用'myCustomLoader'协议，会自动调用上麦呢注册的加载器进行加载
cornerstone.loadImage('myCustomLoader://example.com/image.dcm')
```