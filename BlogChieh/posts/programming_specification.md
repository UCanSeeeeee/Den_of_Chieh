---
title: Objective-C编程规范以及建议
publish_date: 2022-12-26
---

后续会有些修改和补充

### 方法声明和定义

-或者+和返回类型之间须使用一个空格，括号要同行并有一个空格。

```
// 例如：
- (NSRange)rangeOfString:(NSString *)searchString {
    ...
}

// 如果函数名字太长，可以用冒号对齐：（当第一个关键字比其它的短时，要保证下一行至少有4个空格的缩进，对齐关键字）
- (NSRange)rangeOfString:(NSString *)searchString
                 options:(NSStringCompareOptions)mask
                   range:(NSRange)rangeOfReceiverToSearch;
```

---

### 方法调用

```
// 调用时所有参数应该在同一行，或者每行一个参数，以冒号对齐：（当关键字的长度不足以以冒号对齐时，下一行都要以四个空格进行缩进）
[numberString rangeOfString:searchString
                    options:NSCaseInsensitiveSearch
                      range:searchRange];

```

---

### 文件名

```
.h	C/C++/Objective-C 的头文件
.m	Objective-C 实现文件
.mm	Ojbective-C++ 的实现文件
.cc	纯 C++ 的实现文件
.c	纯C 的实现文件
```

### 类名

类名（以及类别、协议名）应首字母大写，并以驼峰格式分割单词。

### 方法名

方法名应该以小写字母开头，并混合驼峰格式。每个具名参数也应该以小写字母开头。**写OC代码像是在讲故事，而读OC代码更像是在听故事。**

### 常量名

常量名（如宏定义、枚举、静态局部变量等）应该以小写字母 k （表示constants，为什么不用c呢？因为c被用于count）开头，使用驼峰格式分隔单词，例如`kStatusBarHeight`。

### 变量名

尽量避免中英文混合命名，中英文混合命名是建议用'_'下划线分割中英文。

循环以及一些生命周期很短、很浅显易懂的变量可以放开要求，可以使用简单单字母等等变量名

---

### 注释

注释不要过多，尽量能够做到代码自解释。与其给类型及变量起一个晦涩难懂的名字，再为它写注释，不如直接起一个有意义的名字。

```
1.在复杂的 属性 或 类名 @interface 前添加注释。
2.`#pragma mark` 把代码进行分类、`#pragma mark -` 有下划线分割。
```

### 建议

[这些建议在另一篇博客第四条有描述](https://chiehwang.top/Effective_Objective-C_2.0_52)

```
1.定义常量时多用类型常量，少用#define预处理指令;
2.使用NS_ENUM和NS_OPTIONS定义枚举；
3.用简洁字面量语法；
4.用好strong、copy。
```
