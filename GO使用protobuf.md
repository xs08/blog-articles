##GO 使用protobuf 

记录一下Protobuf怎样用。栗子🌰来源于[谷歌ProtocolBuffer官方网站](https://developers.google.com/protocol-buffers/docs/gotutorial)。protocol buffer的使用是通过定义应用的proto文件，然后用编译器将proto文件转为语言可以使用的文件（转换后的文件不可以编辑！！），然后应用中使用的是转换后的文件。

### protobuf语法

例子是实现一个地址簿应用，使用的是proto3的语法。首先我们需要定义应用的`.proto`文件：

```protobuf
syntax = "proto3";  // 告诉编译器，使用proto3预发
package tutorial;   // 通过包名来约束命名空间，避免引用混乱

import "google/protobuf/timestamp/proto";  // 引入编译器插件，按需使用

// message可以理解为Go中的struct或者是js中的对象。就是一个包换键值对的数据
// 在XML或JSON等数据描述语言中，一般通过成员的名字来绑定对应的数据。但是Protobuf编码却是通过成员的唯一编号来绑定对应的数据，因此Protobuf编码后数据的体积会比较小
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

