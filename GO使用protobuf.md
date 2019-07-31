##GO 使用protobuf 

记录一下Protobuf怎样用。栗子🌰来源于[谷歌ProtocolBuffer官方网站](https://developers.google.com/protocol-buffers/docs/gotutorial)。protocol buffer的使用是通过定义应用的proto文件，然后用编译器将proto文件转为语言可以使用的文件（转换后的文件不可以编辑！！），然后应用中使用的是转换后的文件。（Linux&Mac下使用）

### 下载安装编译器

安装编译器的方式有如下：

* 谷歌官网的guides里面也有介绍怎样安装Protoc编译器，这里是[介绍页面](https://developers.google.com/protocol-buffers/docs/downloads)。多数人推荐编译安装，可以获得最新的版本及优化的性能。我觉着对于刚入门学习的话，直接下载二进制打包好的来直接使用可以省事很多。安装包可在[github release](https://github.com/protocolbuffers/protobuf/releases)里面下载。下载解压后bin目录下的protoc就是编译器，*Unix系统可将其放到path对应的目录中，就可直接在Terminal中使用了。window同学可以直接用.exe文件
* Mac下可直接使用Homebrew安装：`brew install protobuf`

### 插件安装

安装完编译器，不同语言需要安装不同语言的编译插件才能真正进行编译。GO语言的编译插件直接如下方式下载（前提配置好GOPATH等golang环境）：

```bash
go get -u github.com/golang/protobuf/protoc-gen-go
```

### protobuf语法

安装好编译器，就可以进行proto文件的编写了。例子是实现一个地址簿应用，使用的是proto3的语法。首先我们需要定义应用的`.proto`文件：

```protobuf
syntax = "proto3";  // 告诉编译器，使用proto3语法。必须声明
package tutorial;   // 通过包名来约束命名空间，避免引用混乱。编码后会添加在go文件中

import "google/protobuf/timestamp/proto";  // 引入额外数据包，里面声明了一些额外的数据格式。非必须，按需使用

// message可以理解为Go中的struct或者是js中的对象。就是一个包含键值对的数据。其中数字表示编码后在数据中的位置。详细信息可见文章尾部参考文档：protocol buffer 编码原理
message Person {
	string name = 1;
	int32 id = 2;
	string email = 3;
	
	enum PhoneType {
		MOBILE = 0;
		HOME = 1;
		WORK = 2;
	}
	
	message PhoneNumber {
		string number = 1;
		PhoneType type = 2;
	}
	
	repeated PhoneNumber phones = 4;
	
	google.protobuf.Timestamp last_updated = 5;
}

message AddressBook {
	repeated Person people = 1;
}
```



### 编译Proto文件

因为之前已经安装过protoc编译器了，所以proto文件编写完成后就可以进行编译了。使用基本命令如下：

```bash
protoc -I=需要编译的proto文件目录 --go_out=编译后存放目录 需要编译文件路径+文件名
```

注意，最后需要指明需要编译文件的项目路径。比如需要编译proto文件在当前proto目录下的user.proto文件，则`需要编译文件路径+文件名`为`proto/user.proto`，最后执行编译后就会在`编译后存放目录`下生成编译后的文件，不指定编译后生成文件名的时候，生成的文件名为`原文件名.pb.go`。



#### 参考文档：

* [Protocol Buffer编码原理](https://mp.weixin.qq.com/s/p_vcj5m19eK8ziiCa-me6g)
* [developers.google.com/protocol-buffers/docs/gotutorial](developers.google.com/protocol-buffers/docs/gotutorial)

