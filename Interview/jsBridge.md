## JSBridge简介
JSBrige是一种JS实现的Bridge, 主要是连接着桥两端的Native和H5。它在APP内方便的让Native调用JS，JS调用H5, 是Native和H5双向通信的通道。JSBridge主要提供了JS调用Native代码的能力，实现JS调用原生功能如查看本地相册、打开摄像头、使用指纹、使用FaceID等。

### H5与Native对比
| name | H5 | Native |
| --- | --- | --- |
| 稳定性 | 调用系统浏览器内核，稳定性较差 | 使用原生内核，更加稳定 |
| 灵活性 | 版本迭代快，上线灵活 | 迭代慢，需要受应用少点审核，上线速度受限 |
| 流畅度 | 加载相对较慢，有一定白屏时间 | 加载速度快，更加流畅 |
| 用户体验 | 功能受浏览器显示，体验不如原生好 | 原生系统api丰富，能实现的功能较多 |
| 可移植性 | 兼容平台跨系统，PC与移动端，iOS与Android等 | 可移植性较低，不同平台需要维护两套代码 |
| 受网络影响 | 较大 | 较小 |

### JSBridge双向通信原理
#### JS调用Native
JS调用Native的实现方式较多，主要有以下三种: `URL拦截(URL Scheme)`、`重写原生方法(alert、prompt等)`、`注入API`，下面详细介绍下这三种:
##### 1. URL拦截(URL Scheme)
Android和iOS都可以通过拦截`URL Scheme`的方式来决定是否执行对应的Native代码逻辑。URL拦截是什么?当我们在webview内使用`window.location.href = 'www.xx.com'`打开某个链接的时候，Native的Webview提供了一个接口用以是否对此请求进行拦截，此时我们可以针对需要打开的具体链接`www.xx.com`进行匹配，如果发现是约定好的协议内容而不是具体页面链接的时候，就执行Native原生的方法。很多APP内使用H5打开原生页面的行为大多是这种类型，协议内容的实现方式有多种，此处使用打开原生页面的方式举个栗子: 
* `协议内容JSON化`: 也就是说将这个协议内容(比如说打开的原生页面路径、参数等)JSON化为一个字符串，然后直接使用`location.href = 'jsonstring'`
* `三端化协议`: 这种方式适合于混合开发的情况，例如需要打开的页面最开始是使用H5开发的，后来优化之后开发了Native的版本，但是这个Native的版本可能需要在新版本的APP里使用。具体使用就是H5打开这个链接的时候还是使用H5页面链接的方式，但是可以在链接后面拼接参数(参数为打开Native需要的数据)，Native端监听到这个打开事件获取到参数后可以根据参数判断本地是否有Native的内容，有的话打开Native的内容，没有则使用链接打开H5内容。这种方式还有一个好处是H5可以在其他浏览器环境开发，而不用做适配

不同平台提供的方法是有区别的，基本步骤就是: H5发起`URL Scheme`的链接，Native监听到这个事件并获取到参数，Native决定是否执行Native的方法:
* 对于Android的话，原生的Webview提供了`shouldOverrideUrlLoadding`方法来提供Native拦截H5发送的`URL Scheme`请求
* 对应iOS平台的话，系统的WKWebview也是可以根据拦截的`URL Scheme`和对应参数执行相关的操做

这种方法的有点是安全性能较高，而且使用方式灵活，可以实现H5与Native页面的无缝切换。有个需要注意的问题是: 如果使用`iframe.src`来发送`URL Scheme`需要对URL的长度做控制，使用比较复杂，速度也较慢

##### 2. 重写原生JS方法
* Andorid4.2以前注入对象的接口是*addJavascriptInterface*，后来由于安全原因已经逐渐不使用了。重写原生方法一般会通过修改浏览器的部分window对象的方法来完成操做。主要是拦截**alert、confirm、prompt、console.log**四个方法，分别被*Webview*的**onJsAlert、onJsConfirm、onConsoleMessage、onJsPrompt**监听。
* iOS由于安全限制，**WKWebview**对**alert、confirm、prompt**等方法做了拦截，如果通过此方式进行Native与JS交互，需要实现三个**WKUIDelegate**的方法。

使用这种方式时，也需要与Native客户端约定好使用的传参的格式，H5调用的时候传入约定好的参数，如果参数有误则不执行对应的逻辑。**注意: 如果开发的H5页面需要在其他环境使用的话，则不可使用这种方式。其他平台肯定没有与Native相同的重写机制**

##### 3. 注入API的方式
基于Webview提供的能力，我们可以想**window**对象上注入对象或者方法。JS通过这个对象或者方法进行调用，来使用Native提供的能力，使用这种方式时，JS需要等待Native执行完对应的逻辑后才能执行回调。
* Android的Webview提供了**addJavascriptInterface**方法，支持Android4.2及以上的系统
* iOS的UIWebview提供了**JavaScriptScore**方法，支持iOS7及以上系统。WKWebview提供了**window.webkit.messageHandler**方法，支持iOS8及以上系统。目前使用较多的是WKWebview提供的方法

#### Native调用JS
Nativa调用JS比较简单，只需H5将JS方法暴露在**window**对象上给Native调用即可。
* Android中主要有两种实现方式: 在Android4.4以前，通过loadUrl方法，执行一段JS代码来实现。4.4以后，可以使用**evaluateJavascript**方法实现。loadUrl方法使用简单，但是效率较低且调用时候会刷新Webview；**evaluateJavascript**方法效率高获取返回值方便，调用时不刷新Webview，但是只支持Adnroid4.4+
* iOS在WKWebview中可以通过**evaluateJavaScript:javaScriptString**来实现，支持iOS8以上系统

### JSBridge如何使用
* **H5引入**: JSBridge可以通过H5实现引入。这种方式可以确认JSBridge确实存在，但是后期如果JSBridge改变的话，双方都需要做兼容，所以维护成本较高
* **Native注入**: 这种方式有利于保持Native的API一直性，缺点是Native注入方法和时机受限，JS调用Bridge前需要先判断JSBridge是否注入成功


### 引用文档
* [小白必看，JSBridge 初探](https://www.zoo.team/article/jsbridge)