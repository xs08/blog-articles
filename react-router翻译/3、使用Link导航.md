# 使用Link导航

也许在你的应用中使用最多的就是`Link`，它的行为几乎和`<a/>`标签类似，我们只需要知道他是使用一个`Routee`来渲染的就行了。

让我们在`App`组件里创建一个导航器：

~~~javascript
// modules/App.js
import React from 'react'
import { Link } from 'react-router'

export default Rract.createClass({
    render() {
        return (
        	<div>
            	<h1>React Router Tutorial</h1>
            	<ul rol="nav">
            		<li><Link to="/about">About</Link></li>
            		<li><Link to="/repos">Repos</Link></li>
            	</ul>
            </div>
        )
    }
})
~~~

接下来查看[http://localhost:8080](http://localhost:8080)并点击一下link链接，点击返回，点击前进，导航器开始工作啦。

---

[下一节：嵌套路由]()

