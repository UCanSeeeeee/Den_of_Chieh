---
title: Objective-C 属性关键字和所有权修饰符
publish_date: 2022-11-02
---

属性关键字：

- 原子性（指事务的不可分割性，一个事务的所有操作要么不间断地全部被执行，要么一个也没有执行。）
1.atomic（默认）：保证属性的赋值和取值的原子性操作是线程安全的，但不包括操作和访问。
2.nonatomic：一般属性都用 nonatomic 进行修饰，因为 atomic 非常耗时。
- 读写权限
1.readwrite（默认）：同时生成 setter 方法和 getter 方法的声明和实现。
2.readonly	：只生成 getter 方法的声明和实现。
3.setter：可以指定生成的 setter 方法名，如 setter = setName。
4.getter：可以指定生成的 getter 方法名，如 getter = getName。
- 内存管理

1.assign：
```
1. 既可以修饰基本数据类型，也可以修饰对象类型；
2. setter 方法的实现是直接赋值，一般用于基本数据类型 ；
3. 修饰基本数据类型，如 NSInteger、BOOL、int、float 等；
4. 修饰对象类型时，不增加其引用计数；
5. 会产生悬垂指针（悬垂指针：assign 修饰的对象在被释放之后，指针仍然指向原对象地址，该指针变为悬垂指针。这时候如果继续通过该指针访问原对象的话，就可能导致程序崩溃）。
```
2.unsafe_unretained：
```
1. 既可以修饰基本数据类型，也可以修饰对象类型；
2. MRC 下经常使用，ARC 下基本不用；
3. 同 weak，区别就在于 unsafe_unretained 会产生悬垂指针。
```
3.weak：
```
1. 只能修饰对象类型；
2. ARC 下才能使用；
3. 修饰弱引用，不增加对象引用计数，主要可以用于避免循环引用；
4. weak 修饰的对象在被释放之后，会自动将指针置为 nil，不会产生悬垂指针。
```
4.strong（默认）：
```
1. ARC 下才能使用；
2. 原理同 retain；
3. 但是在修饰 block 时，strong 相当于 copy，而 retain 相当于 assign。
```
5.retain：
```
1. MRC 下使用，ARC 下基本使用 strong；
2. 修饰强引用，将指针原来指向的旧对象释放掉，然后指向新对象，同时将新对象的引用计数加1；
3. setter 方法的实现是 release 旧值，retain 新值，用于OC对象类型。
```
6.copy：
```
1.setter 方法的实现是 release 旧值，copy 新值，用于 NSString、block 等类型。
```
# 所有权修饰符
1.__strong：1. 强引用持有对象，可以对应 strong、retain、copy 关键字。2. 编译器将为 strong、retain、copy 修饰的属性生成带 __strong 所有权修饰符的实例变量。

2.__weak：1. 弱引用持有对象，对应 weak 关键字，ARC下用来防止循环引用。2. 编译器将为 weak 修饰的属性生成带 __weak 所有权修饰符的实例变量。

3.__unsafe_unretained：1. 弱引用持有对象，对应 unsafe_unretained、assign 关键字，MRC下用来防止循环引用。2. 编译器将为 unsafe_unretained 修饰的属性生成带 __unsafe_unretained 所有权修饰符的实例变量。3. 与 __weak 相比，它不需要遍历 weak 表来检查对象是否 nil，性能上要更好一些。但是它会产生悬垂指针。

4.__autoreleasing：在 MRC 中我们可以给对象发送 autorelease 消息来将它注册到 autoreleasepool 中，而在 ARC 中我们可以使用 __autoreleasing 修饰符修饰对象将对象注册到 autoreleasepool 中。
