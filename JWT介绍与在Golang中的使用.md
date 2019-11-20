# JWT介绍与在Golang中的使用

当我们学习web开发的时候知道，HTTP协议是一种无状态的协议，那么我们怎样让客户端与服务端在数据层面建立正确的链接呢？最开始的解决方案是使用Cookie与Session，一般情况下这也是沿用至今的较好的方式。但是随着应用逐渐分布式发展的时候，cookie与session的方式在分布式中就有些弊端了。而这时候，JWT(JSON Web Token)的出现解决了很多的问题

## 一、从Cookie与Session到JWT

### 什么是Cookie与Session

简单来说，cookie是存在客户端的一个键值对的值(比如userId=12345)，当客户端请求服务端的时候，浏览器会自动待上这个cookie；而session就是服务端自己存储的关于请求用户的数据，如说说服务端拿到了Cookie userId的值为12345，然后服务端就可以根据这个值查询自己内存中的userId为12345的用户数据，这时候服务端就能知道当前请求时用户ID为12345的用户发起的。从而实现了客户端与服务端之间打通数据状态的功能。注意，web开发初期的时候session是存储在服务端应用内存中的，当用户登录的时候将这个session存入，并且设置一定的过期时间，当一段时间之后如果没有使用就会淘汰掉这个数据。试想一下，当需要存入的session数据越来越多的时候，服务端内存占用是非常大的

### 分布式间的Cookie与Session

首先假设用户信息使用cookie&session来存储的，当我们的应用都是单机、单集群运行的时候，这时候cookie&session是非常简便的方式。但是当我们应用开始分布式的时候，cookie与session在不同应用集群间使用的时候怎样同步呢？目前大概的方式有两种：

* `一、直接在集群之间复制这个状态数据，比如用户登录后向所有的集群广播同步复制登录信息到自己的内存中。这用方式使用比较简单，而且当某些机器Down掉的时候也不会影响集群中其他机器。但是这种方式的弊端是存在一定延迟，而且集群内多了很多额外的网络开销，而且可能有的应用对于用户来说根本不会使用却还是同步了用户信息。`
* `二、使用缓存进行集中式管理，将所有的session存入集群中的某台机器上，用户访问不同节点时先从缓存中取session信息。这种情况适用于急群中机器较多、网络环境复杂的情况。同样的，这样的方式也会造成一些额外的网络开销，而且session数据的稳定性基于缓存的稳定性，当缓存服务出现问题的时候容易造成严重的问题`

还有一种使用stikySession方式，简单来说是将用户的所有请求固定打到一台服务器上，只需要在这台机器存储用户的数据。这种方式的耦合性比较高，有可能导致所有的应用都需要在同一台机器上进行部署，显然这样是不可以的

### 使用Token

更加现代的方式是可以将部分必要的数据保存到客户端。比如用户的基本信息等，但是我们不希望客户端可以查看到这些数据(Cookie明文存储的)，所以我们可以在用户登录之后将基础的用户数据加密之后再让客户端存起来，而且只有服务端才能够解密这些数据。这就解决了一个很大的问题，发现没，使用这种方式的话，**我们就不需要在服务端之间同步存储用户基础信息了**。接收到请求之后将用户携带的数据解密自然就得到了用户的基本信息。

这时候我们考虑的问题就是使用什么方式来编码数据了，通用的数据编码有xml/json/等。而json由于其可读性较好且编码后的字节数更少更节省传输时间等通用性的原因在这里可以选做编码Token的格式。于是，就有了我们主题的`JSON Web Token`，这就是JWT的由来。简单来说就是使用JSON编码后在web中传输的Token

### JWT的其他说法

由于不是强依赖于Cookie，JWT不仅可以在浏览器中使用，使用也适用于RESTful接口。浏览器中使用的时候，可以将简单的JWT存入Cookie(Cookie有长度限制)，也可JWT存入localStorage之类的存储中，使用的时候作为额外的参数待上就行。这种情况下，可以使用对Cookie的过期方式来删除失效的Token，或者前端主动将localStorage中的Token给删除就行。但是RESTful接口中使用的时候，过期时间就不方便控制了，这时候服务端不能直接将Token过期



##  二、JWT的组成

标准JWT包含三个部分： Header、Payload、Signature，由这三部分生成整个Token，三部分之间用“.”号做分割。
列如: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`

1. **Header**：header部分通常包含了两部分：type、alg。**type**是token的类型，使用JWT的时候值就是`JWT`。 **alg**是使用的Hash算法。例如SHA256或RSA等，然后会将这部分经过base64Url编码形成第一部分，如：

  ```json
  { "alg": "SHA256", "typ": "JWT" }
  ```

2. **Payload**：payload部分是荷载信息。它包含一些声明Claim(实体的描述，通常是需要存储的用户信息、以及一些其他的元数据)。这里的声明分三类：

  * **Reserved Claims**：简单来说就是一些预定义的声明，用于记录JWT的相关信息。但这些并不是必须的，可以按照需要来声明。例如下面这些字段：*iss(issuer)*、*exp(expiration time)*、*sub(subject)*、*aud(audience)*等（这里有个规则，就是尽可能紧凑的使用命名，也是就减少编码后的长度）
  * **Plubic Claims**：官方的介绍有点迷糊，个人觉得这里主要就是存放通用的数据的字段。比如用户数据中的用户名、电话、地址等信息
  * **Private Claims**：交换信息双方额外定义的声明。除了Public Claims中定义的通用字段外，额外需要存储的字段。比如用户下单之后需要记录一个上次下单的时间这样的字段

  这里的数据也是经过Base64Url编码后形成第二部分，如：

  ```json
  { "sub": "UserInfo", "name": "TonyXiong", "admin": true }
  ```

3. **Signature**：使用header中指定的算法将编码后的header、编码后的payload、另外指定的一个secret进行加密。假如使用的是HMAC SHA256算法，大致流程类似于：HMACSHA256( base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)。这个signature字段被用来确认JWT信息的发送者是谁，并保证信息没有被修改



## 三、Golang中JWT的使用

Golang中使用JWT也有了很多现成的实现，不需要我们再单独实现了。我这边主要记录一下`https://github.com/dgrijalva/jwt-go`这个包在Gin项目中的应用吧。只要了解了基本的原理，使用方式在其他类似的包及框架中基本上都是大同小异的

###github.com/dgrijalva/jwt-go 主要方法介绍

这里我们用代码来介绍一下：

```golang
import (
	"crypto/md5"
	"encoding/hex"
)
// 自定义一种加密的算法
func EncodeMD5(value string) string {
	m := md5.New()
	m.Write([]byte(value))

	return hex.EncodeToString(m.Sum(nil))
}

// 定义需要生成JWT的数据
type UserClaims struct {
	UserName string `json:"username"`
	Password string `json:"password"`
	jwt.StandardClaims
}

// 生成Token
claims := Claims{
		EncodeMD5(username),
		EncodeMD5(password),
		jwt.StandardClaims{
			ExpiresAt: expireTime.Unix(),
			Issuer:    "gin-blog",
		},
}
tokenClaims := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
token, err := tokenClaims.SignedString(jwtSecret)

// 解析JWT
tokenClaims, err := jwt.ParseWithClaims(token, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
})
```















#### 引用文章：

* [jwt.io介绍](https://jwt.io/introduction/)
* [JWT与cookie和token的区别](https://blog.csdn.net/Cjava_math/article/details/81563871)
* [dgrijalva/jwt-go](https://github.com/dgrijalva/jwt-go)
* [煎鱼大佬的Go-gin-example](https://github.com/EDDYCJY/go-gin-example)