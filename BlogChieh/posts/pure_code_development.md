---
title: iOS纯代码模式开发&混编
publish_date: 2022-12-26
---

Pure development！

## OC

1.删除.storyboard

2.删除info.plist中的Application Scene Manifest

3.删除Build Setting里的main

4.删除SceneDelegate

5.删除AppDelegate中的后两个方法

6.在AppDelegate.h中声明一个UIWindow

// @property (strong, nonatomic) UIWindow *window;

7.在AppDelegate.m中改写代码

```
    self.window = [[UIWindow alloc]initWithFrame: [UIScreen mainScreen].bounds];
    self.window.backgroundColor = [UIColor blackColor];
    ViewController *rootViewController = [[ViewController alloc] init];
    self.window.rootViewController = rootViewController;
    [self.window makeKeyAndVisible];
```

## Swift

1.选择Swift+UIKit

2.删除 Main.storyboard - Move to Trash

3.xcodeproject配置：删除Main，并勾选掉iPad、Landscape Left、Landscape Right // 横竖屏

4.全局搜索，删除main相关。

5.在SceneDelegate.swift的scene方法中修改：

```
    guard let windowScene = (scene as? UIWindowScene) else { return }
    window = UIWindow(frame: windowScene.coordinateSpace.bounds)
    window?.windowScene = windowScene
    window?.rootViewController = MainTabBarViewController()
    window?.makeKeyAndVisible()
```

## 在Swift中写Objective-c

1.创建oc文件，在弹窗中选择"Create Bridging Header" 。

2.在生成的文件中导入oc类头文件。 // "#import xxx.h"

3.在Swift中直接使用。