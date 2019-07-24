# Go Micro -微服务框架入门

Go Micro[文档](https://micro.mu/docs/go-micro.html)这样介绍自己：Go Micro提供了分布式系统开发核心所必须的RPC和事件驱动的通信, Micro的核心思想是健全的可插拔架构（就是说很多的功能都可以通过不同的插件来实现）。Micro提供了一些默认的选项可以快速开始开发并且所有东西都是可以很方便更替的。

Go Micro专注于分布式系统，提供了如下这些功能：

* **服务发现**—自动化的服务注册和命名解析。服务发现是微服务开发的核心，Go Micro默认的服务发现途径是通过的DNS广播实现的(mdns)，mdns是不需要任何配置的(原文: a zeroconf system)。当然也可以为了P2P网络进行一些设置来使用SWIM协议，或者是使用Consul来进行弹性的云本地开发设置
* **负载均衡**—客户端的负载均衡内建在服务发现内。Go Micro使用随机hash算法进行分布式服务选择，当发生意外的时候使用的是其他节点重试的策略
* **消息编码**—基于content-type的动态消息编码。默认支持的消息编码有proto-rpc和json-rpc。
* **Request/Response模型**—Go Micro的RPC通信基于Request/Response模型，并且支持双向流式通信。他提供了抽象的异步通信模型，当有请求来到一个服务的时候会自动进行解析、负载均衡、服务查询和数据流化。默认使用的网络协议是http/1.1，或者当TLS启用的时候使用的是http2
* **插件化接口**—Go Micro为分布式系统提供了抽象化的go Interface.