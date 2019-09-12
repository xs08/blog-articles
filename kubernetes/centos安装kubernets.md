## CentOS安装kubernetes

#### 一.添加阿里云yum源

命令行执行:

```bash
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg
        https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
```

#### 二. 开始安装

命令行执行:

```bash
yum update -y && yum install -y kubectl kubelet kubeadm
```

#### 三. 下载相关镜像

因为默认的k8s.gcr.io上的镜像在国内都不太能下载(当然有VPN的除外), 我们需要用其他的源来替换. 简单来说就是从其他的源下载需要的镜像, 然后使用tag将下载的镜像重新标记为安装所需要的镜像. 

1. 查看需要的镜像:

   ```bash
   kubeadm config images list
   ```

   大概输出如下:

   ```
   k8s.gcr.io/kube-apiserver:v1.15.0
   k8s.gcr.io/kube-controller-manager:v1.15.0
   k8s.gcr.io/kube-scheduler:v1.15.0
   k8s.gcr.io/kube-proxy:v1.15.0
   k8s.gcr.io/pause:3.1
   k8s.gcr.io/etcd:3.3.10
   k8s.gcr.io/coredns:1.3.1
   ```

   以上就是所需要的镜像, 包括需要的镜像版本.

2. 从阿里云(registry.cn-hangzhou.aliyuncs.com/google_containers)下载镜像, 以api-server为例子:

   ```bash
   docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/kube-apiserver:v1.15.0
   ```

3. 下载完成后,使用`docker tag`将下载的镜像重新tag一下:

   ```bash
   docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/kube-apiserver:v1.15.0 k8s.gcr.io/kube-apiserver:v1.15.0
   ```

   将所有需要的镜像按此操做tag完成就行

#### 四. 系统设置

1. 关闭swap: 

   * **永久关闭:** 编辑**/etc/fstab**, 找到类似**UUID=0a55fdb5-a9d8-4215-80f7-f42f75644f69 none  swap    sw      0       0**的行(有swap标记的), 然后在前面加个**#**号注释掉就行.
   * **临时关闭:**  bash执行`swapoff -a`

2. 关闭selinux:

   * **临时关闭:** `setenforce 0`
   * **永久关闭:** 编辑`/etc/selinux/config`, 将`SELINUX=enforcing`改为`SELINUX=disabled`, 然后重新

3. 关闭防火墙, bash执行:

   ```bash
   systemctl disable firewalld
   systemctl stop firewalld
   ```



#### 五. 开始安装

安装Master需要bash执行:

```bash
kubeadm init
```







