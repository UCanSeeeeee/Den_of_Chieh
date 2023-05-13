---
title: Effective Objective-C 编写高质量iOS与OS X代码的52个有效方法
publish_date: 2023-04-17
---

注视一个物品半分钟再开始读书

---

# 第1章 熟悉Objective-C

### 第1条：了解 Objective-C 语言的起源

Objective-C 语言由 Smalltalk 演化而来，后者是消息型语言的鼻祖。

Objective-C 为 C 语言添加了面向对象的特性，是 C 的超集。C 语言中所有功能在编写 Objective-C 代码时依然适用。

#### 一、OC语言使用动态绑定的“消息结构”（messaging structure）而非“函数调用”（function calling）。

关键区别在于：使用消息结构的语言，其运行时所应执行的代码由运行环境来决定；而使用函数调用的语言，则由编译器决定。

如果调用的函数是多态的，那么在运行时就要按照 “虚方法表”（动态派发/运行时方法绑定），来查出到底应该执行哪个函数实现。

而采用消息结构的语言，不论是否多态，总是在运行时才会去查我所要执行的方法。实际上，编译器甚至不关心按收消息的对象是何种类型。接收消息的对象问题也要在运行时处理，其过程叫做“动态绑定”(dynamic binding)，也就是说，在运行时才会检查对象类型。接收一条消息之后，究竟应执行何种代码，由运行期环境而非编译器来决定。

#### 二、运行期组件

Objective-C 的重要工作都由 “运行期组件”（runtime component） 而非编译器来完成。使用 Objective-C 的面向对象特性所需的全部数据结构及函数都在运行期组件里面。

举例来说，运行期组件中含有全部内存管理方法。运行期组件本质上就是一种与开发者所编代码相链接的“动态库”（dynamic library），其代码能把开发者编写的所有程序粘合起来。这样的话，只需更新运行期组件，即可提升应用程序性能。而那种许多工作都在“编译期” (compile time) 完成的语言，若想获得类似的性能提升，则要重新编译应用程序代码。

#### 三、内存 & 指针

```
NSString *someString = @"The string";

// someString 变量指向分配在堆里的某块内存，其中含有一个 NSString 对象（实例）

NSString *anotherString = someString;

// 不会拷贝对象，只会拷贝指针，浅拷贝。
```

声明了一个 someString 变量，其类型是 NSString* ，也就是说，此变量是指向 NSString 的指针，也就是在堆中的 @"The string"。所有 Objective-C 语言的对象都必须这样声明，因为对象所占内存总是分配在“堆空间”（heap space）中，指针存储在栈中，每个指针占用4字节（32位架构），指针所在的内存里的值就是 NSString 实例的内存地址。

![](/books/栈和堆.png)

分配在堆中的内存必须直接管理，不需要用 malloc 及 free 来分配或释放对象所占内存，Objective-C 运行期环境把这部分工作抽象为一套内存管理架构，名叫“引用计数”。而分配在栈上用于保存变量的内存则会在其栈帧弹出时自动清理。

在 Objective-C 代码中，有时会遇到定义里不含 * 的变量，它们可能会使用“栈空间”，这些变量所保存的不是 Objective-C对象。比如 CoreGraphics 框架中的 CGRect

CGRect 是C结构体，其定义是：
```
    struct CGRect {
        CGPoint origin;
        CGSize size;
    };
    typedef struct CGRect CGRect;
```

整个系统框架都在使用这种结构体，因为如果改用 Objective-C 对象来做的话，性能会受影响。与创建结构体相比，创建对象还需要额外开销，例如分配及释放堆内存等。

---

### 第2条：在类的头文件中尽量少引入其他头文件

#### 向前声明

当声明文件**不需要知道被引用某个类的实现细节**时则在实现文件中使用@class，若在实现文件中使用到了这个类的接口细节，则在实现文件使用#import

```
解释：@class不会拷贝任何内容，只是告诉编译器这是一个类。
作用：减少编译时间；解决两个类互相运用问题。
```

当类继承自某个超类时，无法使用向前声明，必须#import引用定义那个超类的头文件，协议也是。

---

### 第3条：多用字面量语法，少用与之等价的方法

字面量语法（一种语法糖：指编程语言中可以更容易的表达一个操作的语法）：`NSString *someString = @"Effective objective-c 2.0";`

#### 字面量数值

```
NSNumber *someNumber = [NSNumber numberWithInt:1];
NSNumber *someNumber = @1;
// 字面量语法更简洁
```

有时需要把整数、浮点数、布尔值封入 Objective-C 对象中。这种情况下可以用 NSNumber 类，该类可处理多种类型的数值。能够以 NSNumber 实例表示的所有数据类型都可使用该语法。
```
NSNumber *intNumber = @1;
NSNumber *floatNumber = @2.5f;
NSNumber *doubleNumber = @3.14159;
NSNumber *boolNumber = @YES;
NSNumber *charNumber = @'a';
```

#### 字面量数组

example

```
NSArray *animals = [NSArray arrayhithobjects:@"cat", @"dog", @"mouse", @"badger", nil];
NSString *dog = [animals objectAtIndex : 1];

NSArray *animals = @[@"cat"', @"dog", @"mouse"', @"badger"];
NSString *dog = animals[1];
```

如果object2是nil，则arrayA只有object1一个对象，创建arrayB时会抛出异常。原因在于：“arrayWithObjects:” 方法会依次处理各个参数，直到发现 nil 为止，由于object2是nil，所以该方法会提前结束。由此可见，使用字面量语法更为安全。

```
id objectl = /**/;
id object2 = /**/;
id object3 = /**/;
NSArray *arrayA = [NSArray array WithObjects:object1, object2, object3, nil];
NSArray *arrayB = @[object1, object2, object3];
```

#### 字面量字典

example

```
NSDictionary *personData = [NSDictionary dictionaryWithObjectsAndKeys:@"Matt", @"firstName",@"Galloway", @"lastName", @28, @"age", nil];
NSString *lastName = [personData objectForKey:@"lastName"];

NSDictionary *personData =@[@"firstName": @"'Matt", @"lastName": @"Galloway", @"age": @28];
NSString * lastName = personData[@"lastName"]；
```

#### 可变数组与字典

通过取下标操作，可以访问数组中某个下标或字典中某个键所对应的元素。如果数组与字典对象是可变的（mutable），那么也能通过下标修改其中的元素值。

```
[mutableArray replaceObjectAtIndex:1 withObiect:@"dog"];
[mutableDictionary setObject:@"Galloway" forkey:@"lastName"];

mutableArray[1] =@"dog";
mutableDictionary[@"lastName"]= @"Galloway";
```

#### 局限性

使用宇面量语法创建出来的宇符串、数组、字典对象都是不可变的（immutable）。若想要可变版本的对象，则需复制一份：`NSMutableArray *mutable = [@[@1, @2, @3, @4,@5] mutableCopy];`这么做会多调用一个方法，而且还要再创建一个对象，不过使用字面量语法所带来的好处还是多于上述缺点的。

---

### 第4条：多用类型常量，少用 #define 预处理指令 & 第5条：多用枚举表示状态、选项、状态码

#### 宏定义大家应该都不陌生，使用起来非常简单，首先我们先来看一下宏定义（#define）跟const的区别：

```
1.宏在编译开始之前就会被替换，而const只是变量进行修饰;
2.宏可以定义一些函数方法，const不能
3.宏编译时只替换不做检查不报错，也就是说有重复定义问题。而const会编译检查，会报错
```

编写代码时经常要定义常量，比如`#define ANIMATION_DURATION 0.3`，该预处理指令会把源代码中的 ANIMATION_DURATION 字符串替换为0.3。可是这样定义出来的常量没有类型信息，假设此指令声明在某个头文件中，那么所有引人了这个头文件的代码，其 ANIMATION_DURATION 都会被替换。有个办法比用预处理指令来定义常量更好，比如`static const NSTimeInterval kAnimationDuration = 0.3;`

#### 定义**不对外公开的常量**的时候，我们应该尽量先考虑使用static方式声名const来替代使用宏定义。const不能满足的情况再考虑使用宏定义。比如用以下定义：

```
static NSString * const kConst = @"Hello"； // 代替 -> #define DEFINE @"Hello"
static const CGFloat kWidth = 10.0; // 代替 -> #define WIDTH 10.0
```

#### 定义**对外公开的常量**的时候，我们一般使用如下定义：

```
// .h
extern NSString *const CLASSNAMEconst;
// .m
NSString *const CLASSNAMEconst = @"hello";
```

#### 对于整型类型，代替宏定义直接定义整型常量比较好的办法是使用enum。

使用enum时推荐使用NS_ENUM和NS_OPTIONS宏，并指明其底层数据类型。这样做可以确保枚举是用开发者所选的底层数据类型实现出来的，而不会采用编译器所选的类型。比如用以下定义：

```
typedef NS_ENUM(NSInteger,TestEnum) {
        MY_INT_CONST = 12345
}; // 代替 -> #define MY_INT_CONST 12345 
// 该宏展开后为：typedef enum TestEnum: NSInterger TestEnum;
```

```
// 如果把传递给某个方法的选项表示为枚举类型，而多个选项又可同时使用，那么就将各选项值定义为2的幂，以便通过按位或操作将其组合起来。
typedef NS_OPTIONS(NSInteger, SelectType) {
        SelectA = 0,
        SelectB = 1 << 0,
        SelectC = 1 << 1,
        SelectD = 1 << 2
};
```

这里为什么会出现NS_ENUM和NS_OPTIONS且为什么不直接一个就行？根据**是否将代码按照C++模式编译**，若是不按照C++模式编译，NS_ENUM和NS_OPTIONS展开方式就一样，若是要按照C++模式编译，就不同了。在使用**或运算**操作**两个枚举值**时，C++认为 运算结果的数据类型 应该是 枚举的底层数据类型，也就是NSUInteger，且C++不允许将这个底层类型“隐式转换”为枚举类型本身，所以C++模式下定义了NS_OPTIONS宏，以便省去类型转换操作。

鉴于此，凡是需要以**按位或操作**来组合的枚举都应使用NS_OPTIONS定义。若是枚举不需要互相组合，则应使用NS_ENUM来定义。

**在处理枚举类型的switch语向中不要实现default分支。这样的话，加入新枚举之后，编译器就会提示开发者：switch语向并未处理所有枚举。**

```
typedef NS_ENUM(NSUInteger, EOCConnectionState){
    EOCConnectionStateDisconnected, 
    EOCConnectionStateConnecting, 
    EOCConnectionStateConnected,
};
switch (_currentState) {
    EOCConnectionStateDisconnected:
    // Handle disconnected state 
    break;
    EOCConnectionStateConnecting:
    // Handle connecting state 
    break;
    EOCConnectionStateConnected:
    // Handle connected state 
    break;
}
```

#### const 的一些使用方式和写法区别：

```
const NSString *constString1 = @"I am a const NSString * string";
NSString const *constString2 = @"I am a NSString const * string";
// 全局变量，constString1地址不能修改，constString1值能修改。

NSString *const stringConst = @"I am a NSString * const string";
// stringConst 地址能修改，stringConst值不能修改。

static const NSString *staticConstString1 = @"I am a static const NSString * string";
static NSString const *staticConstString2 = @"I am a static NSString const * string";
// 局部常量，作用域只在本文件中。
```

```
＊左边代表指针本身的类型信息，const表示这个指针指向的这个地址是不可变的。
＊右边代表指针指向变量的可变性，即指针存储的地址指向的内存单元所存储的变量的可变性。
```

---

# 第2章 对象、消息、运行期

对象（object）：就是“基本构造单元”（buildingblock），开发者可以通过对象来存储并传递数据。

消息传道（Messaging）：在对象之间传递数据并执行任务的过程。

Objective-C运行期环境：当应用程序运行起来以后，为其提供相关支持的代码。它提供了一些使得对象之间能够传递消息的重要函数，并且包含创建类实例所用的全部逻辑。

### 第6条：理解“属性”这一概念

1.定义对外开放的属性时候尽量做到**暴露权限最小化**，不希望被修改的属性要加上readonly。

2.atomic并不能保证多线程安全，例如一个线程连续多次读取某个属性的值，而同时还有别的线程在修改这个属性值得时候，也还是一样会读到不同的值。atomic的原理只是在setter and getter方法中加了一个@synchronized(self)，所以iOS开发中属性都要声明为nonatomic,因为atomic严重影响了性能，但是在Mac_OS_X上开发却通常不存在这个性能问题。

[属性修饰符的属性和具体使用请看这章](https://chiehwang.top/oc_foundation)

---

### 第7条：在对象内部尽量直接访问实例变量

实例变量（_属性名）访问对象的场景：

```
- 在init和dealloc方法中，总是应该通过访问实例变量读写数据
- 没有重写getter和setter方法、也没有使用KVO监听
好处：不走OC的方法派发机制，直接访问内存读写，速度快，效率高。
```

```
- (instancetype)initWithDic:(NSDictionary *)dic {
    self = [super init];
    if (self) {   
        _qi = dic[@"qi"];
        _share = dic[@"share"];
    }
    return self;
}
```

用存取方法访问对象的场景：

```
- 重写了getter/setter方法（比如：懒加载）
- 使用了KVO监听值的改变
```

```
- (UIView *)qiShareView {
    if (!_qiShareView) {
        _qiShareView = [UIView new];
    }
    return _qiShareView;
}
```

---

### 第8条：理解“对象等同性”这一概念

思考下面输出什么？

```
    NSString *aString = @"iphone 8";
    NSString *bString = [NSString stringWithFormat:@"iphone %i", 8];
    NSLog(@"%d", [aString isEqual:bString]);
    NSLog(@"%d", [aString isEqualToString:bString]);
    NSLog(@"%d", aString == bString);
```

答案是110，**==**操作符只是比较了两个指针（内存地址）是否相等，而不是指针所指的对象

---

### 第9条：以“类族模式”隐藏实现细节

NSArray *array = [[NSArray alloc] init];
if ([array isMemberOfClass:[NSArray class]]) {
    NSLog(@"isMemberOfClass");
}

NSArray *array = [[NSArray alloc] init];
 if ([array isKindOfClass:[NSArray class]]) {
    NSLog(@"isKindOfClass");
}

---

---

---