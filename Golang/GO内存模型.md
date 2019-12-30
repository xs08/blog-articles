# GO内存模型

— 版本：2014.05.31

目录：

* 介绍
* 建议
* Happens Before
* 同步
  * 初始化
  * Goroutine 创建
  * Goroutine 销毁
  * Channel 通信
  * 锁
  * Once
* 不正确的同步



## 介绍

GO内存模型指明了