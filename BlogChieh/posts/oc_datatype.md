---
title: Objective-C 数据类型
publish_date: 2022-12-26
---

Objective-C中有三种数据类型：基本数据类型、对象数据类型和id数据类型。

`背景：Objective-C是在C语言基础上拓展出的新语言，所以它是完全兼容C语言代码的，C语言中的基本数据类型如int、float、double和char在Objective-C中是完全可以正常使用的。除此之外，Objective-C还拓展了一些新的数据。oc中类分为不可变类和可变（mutable）类，它们创建的对象也是，下面列出了Foundation框架中主要的可变类和不可变类：`

![](/i/22d9be3a-5d17-4723-879e-878bca3650bc.jpg)

---

参考资料：
- [知乎：Objective-C入门——基本数据类](https://zhuanlan.zhihu.com/p/523935515)
- [掘金：OC的数据类型](https://juejin.cn/post/7012042721057570846)


## NSObject基类

NSObject类属于根类。根类在层级结构中处于最高级，除此之外没有更高层级

```
常用方法：
//比较两个对象是否相同 
[obj1 isEqualTo:obj2 ];
//判断此对象是否属于某个类或者此类的子类
[obj1 isKindOfClass:[NSString class]]
//判断此对象是否为此类(不包括子类)
[obj1 isMemberOfClass:[NSString class]]
//判断此对象是否实现了某协议
[obj1 conformsToProtocol :@protocol(StudentDelegate)];
//判断此对象是否拥有此方法
[obj1 respondsToSelector:@selector(clickAction:)]
//用obj2作为参数向接收者发送消息
[obj1 performSelector:@selector(clickAction:) withObject:obj2];
```
---

## id

id类型是oc中独有的数据类型，它可以存储任何类型的对象,也叫万能指针，能指向任何OC对象，相当于NSObject *。

```
//注意 id后面不要加上 *
id p = [person new]
```
---

## NSString+NSMutableString

### NSString 

// 多一句嘴，"NSString" 和 "Swift String" 最关键的差别在于NSSting是类Class（引用类型）而String是结构体Struct（值类型）
```
创建字符串的方式：
NSString *str = @"Hello World!"; 

NSString *str = [[NSString alloc] init];
str = @"Hello World!";

NSString *str = [NSString stringWithFormat:@"My age is %i",18];

// 从一个url读取字符
NSURL* url = [NSURL URLWithString:@"https://www.baidu.com"];
```
```
搜索字符串：
[str hasPrefix:@""];
[str hasSuffix:@""];

[str isEqualTostring:@""];
[str compare:@""];

//忽略大小写进行比较
[str caseInsensitiveCompare:@""];
//NSString的截取 从指定位置开始
[str substringFromIndex:1];
//从开头截图到指定位置，但不包括此位置 
[str substringToIndex:4];
//根据指定范围进行截取
[str substringWithRange:NSMakeRange(1,3)];
//用separator为分隔符截取字符串，返回一个装有所有子串
[str componentsSeparatedByString:@" "];
```
```
常用方法：
//返回长度 
[str length];
//返回指定位对应的字符
[str characterAtIndex:1];

//转化为int
[str intValue];
//转化为float 
[str floatValue];
//转化为bool
[str boolValue]:
//转化为C语言字符本 
[str UTF8String];
```
---
### NSMutableString
NSString是不可变的，不能删除字符或者添加字符。NSString有一个子类NSMutableString,称为"可变字符串”。可以用创建NSString的方法来创建NSMutableString,因为NSMutableString是NSString的子类，NSString能用的方法NSMutableString都能用。
```
常用方法：
//设置内容
[mutableStr setString:@"我是可变字符串"];
//拼接一个字符串
[mutableStr appendString:@" ..."];
//拼接一个格式 
[mutableStr appendFormat :@"我有%d个朋友",3];
//替换字符串
[mutableStr replaceCharactersInRange : [mutableStr range of string @"age"]withString:@"Age"];
//插入字符串 
[mutableStr insertString:@"..." atIndex:2];
//删除字符串 
[mutableStr deleteCharactersinRange: [mutableStr range string @"age"]];
```
---

## NSArray+NSMutableArray

### NSArray

用来存储对象的有序列表，它是不可变的，不能存储C语言中的基本数据类型，如int、float、enum、struct，也不能存储nil。

```
创建方法：
NSArray *arr = [NSArray array];
NSArray *arr = @[@"1",@"2",@"3"];
NSArray *arr = [NSArray arrayWithobjects:@"1" ,@"2"，@"3"，@"4"]；
```
```
常用方法：
NSArray *arr = [NSArray array];
NSArray *arr = @[@"1",@"2",@"3"];
NSArray *arr = [NSArray arrayWithobjects:@"1" ,@"2"，@"3"，@"4"]；
[arr count];
[arr containsObject:@""];
[arr firstObject];
[arr lastObject]; 
[arr objectAtIndex:2];
[arr indexOfObject:@""];
//在range范围内查找元素的位置 
[arr indexOfObject:@"" inRange:NSMakeRange(3, 4)];
//用 "" 将字典元素依次拼接成一个字符串 
[arr componentsJoinedByString：@" "]
```
---
### NSMutableArray

可变的NSArray。NSArray的子类，可以随意的添加或者删除元素。

```
//表示这个数组可能有5个元素
NSMutableArray *mutableArr = [NSMutableArray arrayWithCapacity:5]; 
NSMutableArray *mutableArr = [[NSMutableArray alloc] initWithCapacity:5];
```

```
常用方法：
//表示这个数组可能有5个元素
NSMutableArray *mutableArr = [NSMutableArray arrayWithCapacity:5]; 

NSMutableArray *mutableArr = [[NSMutableArray alloc] initWithCapacity:5];
//删除所有元素 
[mutableArr removeAllObjects];
//删除某个范围的元素 
[mutableArr removeObjectsInRange :NSMakeRange(3,2)];
//删除某个指定元素 
[mutableArr removeObject:@"a"];
//删除两个集合中都存在的元素 
[mutableArr removeObjectsInArray:@[@"a" ,@"b" ,@"c"，@"d"];
```
## NSInteger 
1.NSInteger是基本数据类型，并不是 NSNumber 的子类，当然也不是 NSObject 的子类。

2.NSInteger是基本数据类型 Int 或者 Long 的别名(NSInteger 的定义typedeflongNSInteger)，它的区别在于，NSInteger 会根据系统是 32位还是 64 位来决定是本身是 int 还是 Long。