---
title: 新Mac开发环境配置
publish_date: 2023-04-05
---

为未来做准备

// 最下面有些已经失效+无用 读者自行把握

# 开发
```
- Xcode + SF符号 + Cursor + VSCode + ClashX Pro / Shadowsocks
- Lookin 
- Sourcetree
- iTerm terminal
- DevToys 全能开发工具base64、json......
- 妙言 笔记
- Charles （Mac）/ Storm Sniffer（iOS） 抓包工具
- Sublime Text / Typora  Markdown编辑器
- 网易有道词典
- Chrome / Arc + Tampermonkey [YouTube翻译插件](https://chrome.google.com/webstore/detail/youtube-dual-subtitles/hkbdddpiemdeibjoknnofflfgbgnebcm)
- Xnip 截图
- Stats 硬件监控
- MonitorControl 外接显示器辅助
- Xmind + WPS 文档画图
- Imgur 图片转url
- Motrix / Downie / NeatdownloadManager 视频下载
- The Unarchiver 解压缩
- IINA 视频播放器
- CleanMyMac X 磁盘清理
- AnyGo 修改定位
- ChatGPT 客户端
- Telegram + 阿里云盘
```
---
# 电脑设置
```
- 电脑三指拖移 // 设置 - 辅助 - 指针
- 时区改为十二小时制
- 紫色默认背景
```
---
# Mac 鼠标加速
```
- defaults read .GlobalPreferences com.apple.mouse.scaling
- defaults write .GlobalPreferences com.apple.mouse.scaling -1
```
---
# Mac 名字
[MacOS - hostname/ComputerName](https://shockerli.net/post/macos-hostname-scutil/)
```
别人看到的设备名字
scutil --get ComputerName
sudo scutil --set ComputerName XXX
```
---
# App损坏无法打开解决办法：
```
xattr 拓展属性
-r 递归整个目标 .app 目录内容
-c 标志删除所有属性
应用（没权限的话就sudo）：xattr -rc /App_PATH 
```
---
# Xcode + iOS 版本
```
https://github.com/JinjunHan/iOSDeviceSupport
open /Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/DeviceSupport
```
# ARC Browser
```
const a = document.querySelectorAll('a')
for (i of a) {
  i.setAttribute("target", "_blank")
}
```
---
# 配置终端及开发环境 // 可以改造一下系统终端 // 配置一个字体即可解决显示bug

git登陆 连接仓库 密钥等问题

[iTerm2 + Oh My Zsh 打造舒适终端体验](https://segmentfault.com/a/1190000014992947)

[M1 Mac Terminal 安装(iTerm2+Oh My Zsh+zsh-syntax-highlighting)](https://zhuanlan.zhihu.com/p/365838868)

[homebrew](https://blog.csdn.net/weixin_38716347/article/details/123838344)

[代理加速](https://segmentfault.com/a/1190000039686752)

[clash for mac 怎么调整规则](https://juejin.cn/post/7034763326152245255)

[MacOS ClashX设置修改代理端口教程](https://www.bokezhu.com/2021/03/04/731.html)

[配置python3](https://blog.csdn.net/weixin_45651616/article/details/125795130)

[安装pip](https://www.jianshu.com/p/396c25709277)

[CocoaPods安装和使用并遇到的坑](https://juejin.cn/post/6940651626990403597)

安装 Cocoapods：ruby源 -> 升级gem -> 安装pod

```
1.使用 homebrew 安装 ruby：
brew install ruby
2.设置默认 ruby 和 gem 环境：
echo 'export PATH="/usr/local/opt/ruby/bin:$PATH"' >> ~/.zshrc
echo 'export GEM_HOME="$HOME/.gem"' >> ~/.zshrc
3.cocoapods 安装【版本1.8.4，温馨提示：当pod install失败的时候先查看pod版本】:
gem install -n /usr/local/bin cocoapods
```

```
M1 兼容性报错：
sudo arch -x86_64 gem install ffi
arch -x86_64 pod install
```

---
# 工具网站

[在线网站清单](https://github.com/qianguyihao/website-list)

[CodeTop题库](https://codetop.cc/home)

[code](https://paste.nugine.xyz/)

[画图](https://app.diagrams.net/)

`javascript:document.body.contentEditable='true';document.designMode='on'; void 0` // 修改网页内容

# CS入门指南

[MIT - CS](https://csdiy.wiki)

[notes - CS](http://www.cyc2018.xyz/)

[mc - 幕布](https://mubu.com/doc/fVKgdcSrF3#m-I6oWEqVPh4)

[AcWing - 算法](https://www.acwing.com)

# 好文记录

[一文多发](https://openwrite.cn/)

[打包流程](https://blog.csdn.net/lixianyue1991/article/details/121272242?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522166712488516782428661363%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=166712488516782428661363&biz_id=0)

