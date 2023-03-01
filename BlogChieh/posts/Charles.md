---
title: Charles从下载、配置到使用
publish_date: 2022-12-25
---

Let's go!


`简介：Charles 通过将自己设置成系统的网络访问代理服务器，使得所有的网络访问请求都通过它来完成，从而实现了网络封包的截取和分析。`

下载：[官网下载地址](https://www.charlesproxy.com)

---

## 安装证书

- 安装 CA 证书的目的是为了抓包 https 请求，完成 SSL 证书校验
- 点击顶部工具栏的 Help---> SSL Proying ---> Install Charles Root Certificate
- 证书安装成功最后一步，会确定是否添加证书到钥匙串，选择添加到本地项目
- 证书添加成功会弹出钥匙串访问页面，然后找到 Charles Proxy 证书 ，双击证书会进入详情页面，提示此证书不被信任，点击信任按钮，修改为始终信任。

---

## 配置Http代理

1.顶部工具栏选择 Proxy ---> Proxy setting

2.选择 Proxies 开始配置，port 默认端口为 8888，若端口被占用需手动自行修改。

![](/i/ad2088e3-5d52-45db-9fb7-3dd5e0b61bc4.jpg)

---

## 配置Https代理

1.目前大多数的网络请求接口都是 https，Charles也需要配置 SSL 代理进行抓包 操作步骤：顶部工具栏---> Proxy ---> SSL Proxying Setting

![](/i/366398f3-b584-4fca-83e4-30bdef2aa289.jpg)

---

## Mac端抓包

完成上述操作后，Proxy --->  macOS Proxy

---

## 移动端抓包配置

1.首先需要修改手机网络，调整手机 wifi 和电脑在同一局域网中。

2.以iOS为例：设置 --> wifi --> Http代理 配置代理 - 手动 - 代理服务器主机名设置为电脑 ip 地址，代理端口设置为 8888 --> 完成后点击保存。

3.移动端证书下载：顶部工具栏--> 选择 Help--> Install Charles Root Certificate on Mobile Device or Remote Browser 。一直同意，直到手机浏览器输入地址 chls.pro/ssl 下载证书。

4.证书下载好后：设置 --> 信任证书 + 启用证书

5.以上信息完成后，我们就可以在移动端抓包了，抓到的接口数据会显示到 Charles 中。

---

## Mock数据：

将某文件的json数据在本地存储后，修改自己的目的字段，而后右键那个文件选择map local，在弹出窗中的local path选择刚刚本地存储的文件，等待命中即可。`记得要删除Query字段。`

![](/i/3dd7e4d6-1d9e-4716-9ba2-96765f1b6da9.jpg)