---
title: objc4源码配置
publish_date: 2022-12-27
---

objc

## 方式一：

源码下载地址：[apple官方开源](https://opensource.apple.com)

准备工作及报错解决：[参考链接一](https://juejin.cn/post/7068539803318353928)、[参考链接二](https://juejin.cn/post/7110975922508939301)

---

## 方式二：

已配置好的源码github地址：https://github.com/LGCooci/KCCbjc4_debug

---
## 可能遇到的问题：

```
打断点无法进入源码：
Target -> 自己创建的项目 -> 在General - Frameworks and Libraries中添加目标库（例如：libobjc.A.dylib）
Target -> 自己创建的项目 -> 将ild Phases - Compile Sources中的mail.m放到第一位
```
