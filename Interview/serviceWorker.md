# serviceWorker
Service worker是一个注册在指定源和路径下的事件驱动worker。它采用JavaScript控制关联的页面或者网站，拦截并修改访问和资源请求，细粒度地缓存资源。

Service worker运行在worker上下文，因此它不能访问DOM。相对于驱动应用的主JavaScript线程，它运行在其他线程中，所以不会造成阻塞。

它设计为完全异步，同步API（如XHR和localStorage）不能在service worker中使用。

出于安全考量，Service workers只能由HTTPS承载，毕竟修改网络请求的能力暴露给中间人攻击会非常危险。在Firefox浏览器的用户隐私模式，Service Worker不可用。

> Service workers之所以优于以前同类尝试（如`缓存`），是因为它们无法支持当操作出错时终止操作。Service workers可以更细致地控制每一件事情

## 生命周期
1. 下载
2. 安装 
3. 激活

## 页面中添加ServiceWorker
```html
<!-- index.html -->
<script>
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./scheduler.js').then((registration) => {
    // 注册成功后打印serviceWorker可作用的范围scope
    console.log(registration.scope)
  }).catch(err => {
    console.log('install fail:', err)
  })
}
</script>
```

### 使用serviceWorker判断是否支持webp
```javascript
// serviceWorker.js
self.addEventListener('fetch', event => {
  const { request: {
    url, headers
  }} = event
  let supportWebp = false // 是否支持webp

  if (/\.(jpg|png|jpeg)$/.test(url)) {
    if (headers.has('accepts')) {
      supportWebp = headers.get('accept').includes('webp')
      if (supportWebp) {
        const newUrl = url.substr(0, url.lastIndexOf('.')) + '.webp'
        event.respondWith(
          fetch(newUrl, {
            mode: 'no-cors
          })
        )
      }
    }
  }
})
```