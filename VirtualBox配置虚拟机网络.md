## VirtualBox网络配置

### 一. VirtualBox提供的网络接入模式

1. NAT 网络地址转换模式(NAT, Network Address Translation)
2. Brigded Adapter 桥接模式
3. Internal 内部网络模式
4. Host-only Adapter 仅主机模式

主要就这四种,还有两种分别是No Adapter就是不配置网络,还有一种是Generic Device, 自行配置网络. 常用的上面四种区别如下:

|   communication | NAT  | Brideged Adapter |    Internal    | Host-only Adapter |
| --------------: | :--: | :--------------: | :------------: | :---------------: |
|     虚拟机→主机 |  ✔   |        ✔         |       ✘        |  默认不能,需配置  |
|     主机→虚拟机 |  ✘   |        ✔         |       ✘        |  默认不能,需配置  |
| 虚拟机→其他主机 |  ✔   |        ✔         |       ✘        |  默认不能,需配置  |
| 其他主机→虚拟机 |  ✘   |        ✔         |       ✘        |  默认不能,需配置  |
|   虚拟机→虚拟机 |  ✘   |        ✔         | 同网络名下可以 |         ✔         |

接下来就可以根据需要选择自己的网络配置啦