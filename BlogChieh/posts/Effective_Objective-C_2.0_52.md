---
title: Effective Objective-C 编写高质量iOS与OS X代码的52个有效方法
publish_date: 2023-04-17
---

注视一个物品半分钟再开始读书

[第一章：熟悉Objective-C](#1)

[第二章：对象、消息、运行期](#2)

[第三章：接口与API设计](#3)

[第四章：协议与分类](#4)

[第五章：内存管理](#5)

[第六章：块 与大中枢派发](#6)

---

# 第1章 熟悉Objective-C
<a id="1"></a>
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
<a id="2"></a>
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

#### 同等性判断 ==

（1）对于对象类型，“**==**”操作符只是比较了两个指针（内存地址）是否相等，即是否为同一个对象。

```
NSString *str = @"test1";
NSString *strCopy = [str copy];
NSString *strNew = [NSString stringWithFormat:@"test%@", @1];

BOOL equalA = (str == strCopy); // YES
BOOL equalB = (str == strNew);  // NO
```

（2）对于基本类型，“**==**”比较的是值。

```
NSInteger x = 123;
NSInteger y = 123;
NSInteger z = 1234;

BOOL equal0 = (x == y); // YES
BOOL equal1 = (x == z);  // NO
```

#### 同等性判断 isEqual

（1）isEqual：NSObject 协议中声明的方法来判断两个对象的等同性，可直接使用

```
NSString *str = @"test1";
NSString *strNew = [NSString stringWithFormat:@"test%@", @1];

BOOL equalD = [str isEqual:strNew]; // YES 
```

（2）iOS系统已经实现了部分NSObject子类的isEqual方法，可直接使用

```
NSString - isEqualToString
NSArray - isEqualToArray
NSDictionary - isEqualToDictionary
NSSet - isEqualToSet
```

（3）对于自定义的类型来说，需要重写isEqual方法：

```
//重写系统的isEqual
- (BOOL)isEqual:(id)object {
    //Step 1: ==运算符判断是否是同一对象, 因为同一对象必然完全相同
    if (self == object) {
        return YES;
    }
    //Step 2: 判断是否是同一类型, 这样不仅可以提高判断的效率, 还可以避免隐式类型转换带来的潜在风险
    if (![object isKindOfClass:[Person class]]) {
        return NO;
    }
    //Step 3: 通过封装的isEqualToPerson方法, 提高代码复用性
    return [self isEqualToPerson:(Person *)object];
}

//自定义方法来执行有意义的值比较
- (BOOL)isEqualToPerson:(Person *)person {
    //Step 4: 判断person是否是nil, 做参数有效性检查
    if (!person) {
        return NO;
    }
    //Step 5: 对各个属性分别使用默认判等方法进行判断
    BOOL haveEqualNames = (!self.name && !person.name) || [self.name isEqualToString:person.name];
    BOOL haveEqualBirthdays = (!self.birthday && !person.birthday) || [self.birthday isEqualToDate:person.birthday];
    //Step 6: 返回所有属性判等的与结果
    return haveEqualNames && haveEqualBirthdays;
}

```

---

### 第9条：以“类族模式”隐藏实现细节

#### 一、创建类族

假设有一个处理雇员的类，每个雇员都有“名字” 和 “薪水”这两个属性，管理者可以命令其执行日常工作。但是，各种雇员的工作内容不同。经理在带领雇员做项目时，无须关心每个人如何完成其工作，仅需指示其开工即可。

首先要定义抽象基类：

```
typedef NS_ENUM(NSUInteger, EOCEmployeeType) {
    EOCEmployeeTypeDeveloper,
    EOCEmployeeTypeDesiner,
    EOCEmployeeTypeFinance
};

@interface EOCEmployee : NSObject

@property (nonatomic, copy) NSString *name;
@property (nonatomic, assign) NSUInteger salary;

+ (EOCEmployee *)employeeWithType:(EOCEmployeeType)type;

- (void)doADaysWork;

@end
```

```
@implementation EOCEmployee

+ (EOCEmployee *)employeeWithType:(EOCEmployeeType)type {
    switch (type) {
        case EOCEmployeeTypeDeveloper:
            return [EOCEmployeeTypeDeveloper new];
            break;
            
        case EOCEmployeeTypeDesiner:
            return [EOCEmployeeTypeDesiner new];
            break;
            
        case EOCEmployeeTypeFinance:
            return [EOCEmployeeTypeFinance new];
            break;
    }
}

- (void)doADaysWork {
    // Subclasses implement this.
}

@end
```

每个“实体子类”都从基类继承而来。例如：

```
@interface EOCEmployeeTypeDeveloper : EOCEmployee
@end

@implementation EOCEmployeeTypeDeveloper
- (void)doADaysWork {
        [self writeCode];
}
@end

```

在本例中，实现了一个“类方法”，该方法**根据待创建的雇员类别分配好对应的雇员类实例**。如果对象所属的类位于某个类族中，那么在查询其类型信息时就要当心了。你**可能觉得自己创建了某个类的实例，然而实际上创建的却是其子类的实例**。在上例中，[employee is**Member**OfClass:[EOCEmployee class]]似乎会返回YES，但实际是NO，因为employee并非Employee类的实例，而是其某个子类的实例。

#### 二、以NSArray为例，深入理解“类族”

```
NSArray *array = [[NSArray alloc] init];
if ([array class] == [NSArray class]) {  
    NSLog(@"arrayClass == NSArrayClass");
    // 无打印
}  

NSArray *array = [[NSArray alloc] init];
if ([array isMemberOfClass:[NSArray class]]) {
    NSLog(@"isMemberOfClass");
    // 无打印
}

NSArray *array = [[NSArray alloc] init];
 if ([array isKindOfClass:[NSArray class]]) {
    NSLog(@"isKindOfClass");
    // 打印 isKindOfClass
}

NSArray *array = [[NSArray alloc] init];
NSLog(@"%@",[[array class] debugDescription]);
    // 打印 __NSArray0
NSLog(@"%@",[[array superclass] debugDescription]);
    // 打印 NSArray
```

```
（1）isMemberOfClass：判断是否是这个类的实例
（2）isKindOfClass：判断是否是这个类或者这个类的子类的实例
```

---

### 第10条：在既有类中使用关联对象存放自定义数据

```
   /** 参数含义：
     id object：被关联的对象（如xiaoming）
     const void *key：关联的key，要求唯一
     id value：关联的对象（如dog）
     objc_AssociationPolicy policy：内存管理的策略
    */

// 1>将object和value关联在一起：
void objc_setAssociatedObject(id object, const void *key, id value, objc_AssociationPolicy policy)

// 2>根据key值获取关联对象
id objc_getAssociatedObject(id object, const void *key);

// 3>移除所有关联对象
void objc_removeAssociatedObjects(id object);

```

应用举例，使用block去实现button的点击回调：

```
// .h

  // 1>声明一个button点击事件的回调block
typedef void(^ButtonClickCallBack)(UIButton *button);
  // 2>为UIButton增加的回调方法
- (void)handleClickCallBack:(ButtonClickCallBack)callBack;

// .m

   // 实现回调方法
- (void)handleClickCallBack:(ButtonClickCallBack)callBack {   
    objc_setAssociatedObject(self, &buttonClickKey, callBack, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    [self addTarget:self action:@selector(buttonClicked) forControlEvents:UIControlEventTouchUpInside];
}

- (void)buttonClicked {
    ButtonClickCallBack callBack = objc_getAssociatedObject(self, &buttonClickKey);
    if (callBack) {
        callBack(self);
    }
}

// 具体调用：
[self.testButton handleClickCallBack:^(UIButton *button) {
        NSLog(@"click...");
}];
```

用关联对象可能会引入难于查找的bug，毕竟是在runtime阶段，所以可能要看情况谨慎选择

---

### 第11条：理解“objc_msgSend”的作用

之前在**了解Objective-C语言的起源**有提到过，Objective-C是用的消息结构。这条就是让你理解一下怎么传递的消息。

在Objective-C中，如果向某个对象传递消息，那就会在运行时使用动态绑定（dynamic binding）机制来决定需要调用的方法。但是到了底层具体实现，却是普通的C语言函数实现的。这个实现的函数就是objc_msgSend,该函数定义如下：

`void objc_msgSend(id self, SEL cmd, ...) `

这是一个参数个数可变的函数，第一参数代表接收者，第二个参数代表选择子（OC函数名），后续的参数就是消息（OC函数调用）中的那些参数。

举例：

```
id return = [git commit:parameter];
id return = objc_msgSend(git, @selector(commit), parameter);
```

objc_msgSend函数会在接收者所属的类中搜寻其方法列表，如果能找到这个跟选择子名称相同的方法，就跳转到其实现代码，往下执行。若是当前类没找到，那就沿着继承体系继续**向上**查找，等找到合适方法之后再跳转 ，如果最终还是找不到，那就进入消息转发的流程去进行处理了。

特殊情况：

```
objc_msgSend_stret：如果待发送的消息要返回结构体，那么可交由此函数处理。
objc_msgSend_fpret：如果消息返回的是浮点数，那么交由此函数处理。
objc_msgSendSuper：如果要给超类发消息，例如[super message:parameter]，那么就交由此函数处理。
```

优化：

1.说过了OC的函数调用实现，你会觉得消息转发要处理很多，尤其是在搜索上，幸运的是objc_msgSend在搜索这块是有做缓存的，每个OC的类都有一块这样的缓存，objc_msgSend会将匹配结果缓存在**快速映射表(fast map)**中，这样以来这个类一些频繁调用的方法会出现在fast map 中，不用再去一遍一遍的在方法列表中搜索了。

2.还有一个有趣的点，就是在底层处理发送消息的时候，有用到**尾调用优化**，大概原理就是在函数末尾调用某个不含返回值函数时，编译器会自动的不在栈空间上重新进行分配内存，而是直接释放所有调用函数内部的局部变量，然后直接进入被调用函数的地址。

---

### 第12条：理解消息转发机制

iOS开发过程中我们经常会碰到这样的报错：`reason: '-[People doesNotExist]: unrecognized selector sent to instance 0x6000021e4640'`，原因是我们调用了一个不存在的方法。用OC消息机制来说就是：消息的接收者不过到对应的selector，这样就启动了消息转发机制，我们可以通过代码在消息转发的过程中告诉对象应该如何处理未知的消息。

#### 1.方法解析

首先，Objective-C运行时会调用对象的`+resolveInstanceMethod:`或`+resolveClassMethod:`方法，尝试动态地为该消息添加一个方法实现。如果该方法实现被成功添加，那么消息就会被重新发送，这次能够被对象响应。

#### 2.快速转发

如果方法解析失败，Objective-C运行时会尝试将消息转发给一个备用接收者。备用接收者是一个实现了`-forwardingTargetForSelector:`方法的对象，该方法返回一个能够响应该消息的对象。如果备用接收者不存在或无法响应该消息，那么就会继续执行第三步。

#### 3.完整转发

如果快速转发也失败了，Objective-C运行时会调用对象的`-methodSignatureForSelector:`方法，获取该消息的方法签名。然后，运行时会创建一个NSInvocation对象，将该消息的方法签名和参数传递给该对象（那条尚未处理的消息有关的全部细节，包括“选择子”、“目标”和“参数”），并调用对象的`-forwardInvocation:`方法。在`-forwardInvocation`方法中，我们可以将该消息转发给另一个对象来处理，或者直接处理该消息。实现此方法时，若发现某调用操作不应由本类处理，则需调用超类的同名方法。这样的话，继承体系中的每个类都有机会处理此调用请求，直至NSObject。 如果最后调用了NSObject类的方法，那么该方法还会继而调用`doesNotRecognizeselector`以抛出;异常，此异常表明选择子最终末能得到处理。

[消息转发代码demo演示](https://github.com/UCanSeeeeee/MessageForwarding/blob/main/MessageForwardingDemo/MessageForwardingDemo/ViewController.m)

接收者在每一步中均有机会处理消息。步骤越往后，处理消息的代价就越大。最好能在第一步就处理完，这样的话，运行期系统就可以将此方法缓存起来了。如果这个类的实例稍后还收到同名选择子，那么根本无需启动消息转发流程。若想在第三步里把消息转给备援的接收者，那还不如把转发操作提前到第二步。因为第三步只是修改了调用目标，这项改动放在第二步执行会更为简单，不然的话，还得创建并处理完整的 NSInvocation。

消息转发机制为我们提供了一种动态地处理未知消息的方式，使得我们可以在运行时动态地为对象添加方法实现，或者将消息转发给其他对象来处理。

![](/books/ocmessage.jpg)

---

### 第13条：用“方法调配技术”调试“黑盒方法”

这条讲的主要内容就是Method Swizzling（Objective-C Runtime 中的一项特性，它允许我们在运行时动态地交换两个方法的实现。通过使用 Method Swizzling，我们可以在不修改原始代码的情况下，对现有方法的行为进行定制化。），通过运行时的一些操作可以用另外一份实现来替换掉原有的方法实现，往往被应用在向原有实现中添加新功能，比如扩展UIViewController，在viewDidLoad里面增加打印信息等。

此方案仅用于程序调试，不可滥用。

[黑盒测试demo演示](https://github.com/UCanSeeeeee/MessageForwarding/blob/main/MessageForwardingDemo/MessageForwardingDemo/UIViewController%2BHook.m)

方法调配技术也就是方法交换技术。 

```
//获取类的实例方法 返回一个Method对象
class_getInstanceMethod(Class obj, SEL cmd)

//获取类的类方法 返回一个Method对象
class_getClassMethod(Class obj, SEL cmd)

//替换方法的实现
method_exchangeImplementations(method1, method2)

/*  添加一个新的方法和该方法的具体实现
    Class cls 你要添加新方法的那个类
    SEL name 要添加的方法
    IMP imp 指向实现方法的指针   就是要添加的方法的实现部分
    const char *types 我们要添加的方法的返回值和参数  
*/
OBJC_EXPORT BOOL class_addMethod(Class cls, SEL name, IMP imp,  const char *types) OBJC_AVAILABLE(10.5, 2.0, 9.0, 1.0)；
```

---

### 第14条：理解“类对象”的用意

[Objective-C类是由Class类型来表示的，它实际上是一个指向objc_class结构体的指针](https://chiehwang.top/iOS_NSObject)

该objc_class结构体存放的是类的“元数据”（metadata）

isa指针指向的是另外一个类叫做元类（metaClass）。那什么是元类呢？元类是类对象的类。也可以换一种容易理解的说法：

```
当你给对象发送消息时，runtime处理时是在这个对象的类的方法列表中寻找
当你给类发消息时，runtime处理时是在这个类的元类的方法列表中寻找
```

![](/books/isaClass.png)

```
上图可以总结为下：
1.每一个Class都有一个isa指针指向一个唯一的Meta Class
2.每一个Meta Class的isa指针都指向最上层的Meta Class，这个Meta Class是NSObject的Meta Class。(包括NSObject的Meta Class的3.isa指针也是指向的NSObject的Meta Class，也就是自己，这里形成了个闭环)
4.每一个Meta Class的super class指针指向它原本Class的 Super Class的Meta Class (这里最上层的NSObject的Meta Class的super class指针还是指向自己)
5.最上层的NSObject Class的super class指向 nil
```

---

# 第3章 接口与API设计
<a id="3"></a>
### 第15条：用前缀避免命名空间冲突

为了避免程序的链接过程中出现`duplicate symbol xxx in:`错误，要尽量在类名，以及分类和分类方法上增加前缀，还有一些宏定义等等根据自己项目来定吧。

---

### 第16条：提供“全能初始化方法”

#### 一、什么是全能初始化方法

在NSDate类中，初始化方法有下面这几种：

```
- (instancetype)init;
- (instancetype)initWithTimeIntervalSinceReferenceDate:(NSTimeInterval)ti;
- (instancetype)initWithTimeIntervalSinceNow:(NSTimeInterval)secs;
- (instancetype)initWithTimeIntervalSince1970:(NSTimeInterval)secs;
- (instancetype)initWithTimeInterval:(NSTimeInterval)secsToBeAdded sinceDate:(NSDate *)date;
```

在上面的几个初始化方法中，`-(instancetype)initWithTimeIntervalSinceReferenceDate:`是全能初始化方法,其他的初始化方法最终都是调用它，生成了NSDate类。

为什么要引入全能初始化方法这个概念呢？省事。

#### 二、实例

比如我们要编写一个表示矩形的类：

```
@interface EOCRectangle : NSObject

@property (nonatomic, assign, readonly) float width;
@property (nonatomic, assign, readonly) float height;
- (instancetype)initWithWidth:(float)width
                    andHeight:(float)height;

@end

@implementation EOCRectangle

-(instancetype)initWithWidth:(float)width andHeight:(float)height{
    if (self = [super init]) {
        _width = width;
        _height = height;
    }
    return self;
}

@end
```

这里我们会碰到一个问题，如果有人直接用`[[EOCRectangle alloc] init];`来初始化，长宽就无法设置，这个类就无法工作。所以我们通常有两种处理方式：

```
// 1.在init方法中，传入默认的值，就是讲类必须的参数的默认值传入，形成一个类
-(instancetype)init{
    return [self initWithWidth:5.0f andHeight:10.0f];
}

// 2.是我们不希望开发者调用init方法，这样类就不能正常工作，我们可以在init方法中，抛出异常，但是一般我们不这样处理，在OC中，只有发生严重错误时，我们才抛出异常。
-(instancetype)init{
    @throw [NSException exceptionWithName:NSInternalInconsistencyException reason:@"不允许调用这个初始化方法，请调用initWithWidth:andHeight:方法" userInfo:nil];
}
```

#### 三、在继承中处理全能初始化方法

创建一个正方形类EOCSquare类，让他继承自EOCRectangle类，正方形的长宽必须相等。那么我们需要提供一个传入边长的初始化方法。`- (instancetype)initWithDimension:(float)dimension;`在实现中：调用父类的方法，传入相同的长宽，即是一个正方形。

```
- (instancetype)initWithDimension:(float)dimension{
    return [super initWithWidth:dimension andHeight:dimension];
}
```

然而，即使我们提供了传入边长的初始化方法，调用者还是可能会调用`initWithWidth:andHeight:`或者`init`方法来初始化，这是我们不愿意看到的，于是就有一个重要的结论：**如果子类的全能初始化方法和父类的全能初始化方法不同，那么总是应该覆写父类的全能初始化方法**

```
-(instancetype)initWithWidth:(float)width andHeight:(float)height{
    float dimension = MAX(width, height);
    return [self initWithDimension:dimension];
}
```

**如果超类的全能初始化方法不适用于子类，我们一般不覆写并使用父类的全能初始化方法，这样显得毫不合理，而是应该在其中抛出异常。**我们还需要覆写init方法。这样，我们就认为，开发者在初始化正方形时，只能传入相应的边长，如果传入长宽，那么认为是调用者自己犯了错误。

```
-(instancetype)initWithWidth:(float)width andHeight:(float)height{
    @throw [NSException exceptionWithName:NSInternalInconsistencyException reason:@"不允许调用这个初始化方法，请调用initWithDimension:方法" userInfo:nil];
}

-(instancetype)init{
    return [self initWithDimension:5.0f];
}
```

---

### 第17条：实现description

这条讲的是可以通过覆写description方法或者debugDescription方法来在NSLog打印时或者LLDB打印时输出更多的自定义信息。

在打印数组或者字典上，这样是很好用的：

```
NSArray *arr = @[@"111",@"222"];
NSLog(@"arr = %@",arr);
//打印出 arr = (111,222)
```

但是如我们在自定义的类中，就不会像刚才那样输出了，输出的往往是一堆内存地址，这样一点也不好调试：

```
EOCRectangle *rectangle = [[EOCRectangle alloc] initWithWidth:10 andHeight:5];
NSLog(@"rectangle = %@", rectangle);
// rectangle = <EOCRectangle: 0x600000618830>
```

要想输出对象的信息，我们需要在类中，重写description方法，例如：

```
-(NSString *)description{
    return [NSString stringWithFormat:@"%@:%p,%@",
            [self class],
            self,
          @{
            @"width":@(_width),
            @"height":@(_height),
            }];
}
/* 输出：
rectangle = EOCRectangle:0x600002e1c350,{
    height = 5;
    width = 10;
}
*/
```

在调试打断点的时候一般重写debugDescription来打印些信息：

```
-(NSString *)debugDescription{
    return [NSString stringWithFormat:@"po 的时候打印我 %@:%p,%@,%@",
            [self class],
            self,
            _width,
            _height];
}
```

---

### 第18条：尽量使用不可变对象

这条主要讲尽量使用不可变的对象，也就是在对外属性声明的时候要尽量加上readonly修饰，这样一来，在外部就只能读取该数据，而不能修改它，使得这个类的实例所持有的数据更加安全。如果外部想要修改，可以**提供方法**来进行修改。

[具体示例代码](https://github.com/UCanSeeeeee/MessageForwarding/blob/main/MessageForwardingDemo/MessageForwardingDemo/CWZoo.m)。

```
❌ 不推荐写法：
@property (nonatomic,readonly) NSSet *animals;
```
```
✅ 应改为：
// .h
@property (nonatomic,readonly) NSSet *animals;
- (void)addAnimals:(NSString *)animal;
- (void)removeAnimals:(NSString *)animal;
- (void)showAnimals;

// .m
- (NSSet *)animals {
    return [_mutableAnimals copy];
}

- (void)addAnimals:(NSString *)animal {
    [_mutableAnimals addObject:animal];
}

- (void)removeAnimals:(NSString *)animal {
    [_mutableAnimals removeObject:animal];
}
```

这样写固然有好，保证了数据的安全性，但代码量也会提升不少。

另外，如果某属性仅可以在对象内部修改，则可以在.h文件中声明为readonly。然后 在.m的类扩展中将属性扩展为readwrite属性。

---

### 第19条：使用清晰而协调的命名方式

写OC代码像是在讲故事，而读OC代码更像是在听故事。

[Objective-C编程规范以及建议](https://chiehwang.top/programming_specification)

---

### 第20条：为私有方法名加前缀

这条主要目的是来区分**公私有方法**，本书提供的技术方案是**在私有方法名前加前缀p_**，其实还可以通过`#pragma mark -`来实现，具体用哪种全凭开发者的习惯。

---

### 第21条：理解 Objective-C 错误模型

1.只有发生了可使整个应用程序崩溃的严重错误时，才应使用异常

2.在错误不那么严重的情况下，可以指派 “委托方法” 来处理错误，也可以把错误信息放在 NSError对象里，经由“输出参数”返回给调用者

在项目中可以自定义一个错误类型模型：在调试程序合适的回调中可传入自定义错误信息。

```
//  .h
//  自定义错误类型
#import <Foundation/Foundation.h>
typedef NS_ENUM(NSUInteger, XWErrorCode) {
    XWErrorCodeUnknow       = -1, //未知错误
    XWErrorCodeTypeError    = 100,//类型错误
    XWErrorCodeNullString   = 101,//空字符串
    XWErrorCodeBadInput     = 500,//错误的输入
};
extern NSString * const XWErrorDomain;
@interface XWError : NSError
+ (instancetype)errorCode:(XWErrorCode)errorCode userInfo:(NSDictionary *)userInfo;
@end

// .m
#import "XWError.h"
@implementation XWError
NSString * const XWErrorDomain = @"XWErrorDomain";
+ (instancetype)errorCode:(XWErrorCode)errorCode userInfo:(NSDictionary *)userInfo {
    XWError *error = [[XWError alloc] initWithDomain:XWErrorDomain code:errorCode userInfo:userInfo];
    return error;
}
@end
```
---

### 第22条：理解NSCopying协议

在OC开发中，使用对象时经常需要拷贝它，我们会通过copy/mutbleCopy来完成。如果想让自己的类支持拷贝，那必须要实现NSCopying协议，只需要实现一个方法：

`-(id)copyWithZone:(NSZone*)zone;`

当然如果要求返回对象是可变的类型就要用到NSMutableCopying协议，相应方法:

`-(id)mutableCopyWithZone:(NSZone*)zone;`

为何出现NSZone呢？以前开发程序时，会据此把内存分成不用的区，而对象会创建在某个区。 现在不用了，每个程序只有一个区：“默认区”，所以不用担心zone参数。

在拷贝对象时，需要注意拷贝执行的是浅拷贝还是深拷贝。深拷贝在拷贝对象时，会将对象的底层数据也进行了拷贝。浅拷贝是创建了一个新的对象指向要拷贝的内容。一般情况应该尽量执行浅拷贝。

```
要点:
1.若想令自己所写的对象具有拷贝功能，则需实现 NSCopying 协议
2.如果自定义的对象分为可变版本和不可变版本。那么就要同时实现 NSCopying 协议 与 NSMutableCopying 协议
3.赋值对象时需决定采用浅拷贝还是深拷贝，一般情况下应该尽量执行浅拷贝
4.如果你写的对象需要深拷贝，那么可考虑新增一个专门执行深拷贝的方法
```
---

# 第4章：协议与分类
<a id="4"></a>
协议(protocol)，它与Java 的“接口”(interface)类似。Objective-C 不支持多重继承（不能继承多个父类），因而我们把某个类应该实现的一系列方法定义在协议里面.协议最为常见的用途是实现委托模式(参见第 23 条)，不过也有其他用法。理解并善用协议可令代码变得更易维护，因为协议这种方式能很好地描述接口。

分类(Category)也是 Objective-C 的一项重要语言特性。利用分类机制，我们无须继承子类即可直接为当前类添加方法，而在其他编程语言中，则需通过继承子类来实现。由于Obiective-C 运行期系统是高度动态的，所以才能支持这一特性，然而，其中也隐藏着一些陷阱，因此在使用分类之前，应该先理解它。

### 第23条：通过委托与数据源协议进行对象间通信

委托与数据源协议我们在使用 UITableView 时经常用到，我们在开发时可仿照其设计模式，将需要的数据通过数据源获取；将执行操作后的事件通过代理回调；并弱引用其代理对象。

```
@class Chinese;
@protocol ChineseDelegate <NSObject>
@optional
- (void)chinese:(Chinese *)chinese run:(double)kilometre;
- (void)chinese:(Chinese *)chinese didReceiveData:(NSData *)data;
- (void)chinese:(Chinese *)chinese didReceiveError:(NSError *)error;
// @required
@end

@interface Chinese : NSObject
// 委托对象-需弱引用
@property (nonatomic, weak) id<ChineseDelegate> delegate;
@end
```
在对象跑步时，通过代理方法回调给委托对象：
```
- (void)run {
    double runDistance = 0.0;
    if (self.delegate && [self respondsToSelector:@selector(chinese:run:)]) {
        [self.delegate chinese:self run:runDistance];
    }
}
```
倘若此方法每分钟都会调用 成百上千次，每次都执行 respondsToSelector 方法难免会对性能有一定影响,因为除第一次有效外其余都是重复判断，所以我们可以将是否能够响应此方法进行缓存！如例所示：
```
#import "Chinese.h"
@interface Chinese() 
@property (nonatomic, strong) struct {
    BOOL didReceiveData;    // 是否实现 didReceiveData
    BOOL didReceiveError;   // 是否实现 didReceiveError
    BOOL didRun;            // 是否实现 run
} chineseDelegateFlags;
@end
@implementation Chinese
- (void)setDelegate:(id<ChineseDelegate>)delegate {
    self.delegate = delegate;
    self.chineseDelegateFlags.didRun = [delegate respondsToSelector:@selector(chinese:run:)];
    self.chineseDelegateFlags.didReceiveData = [delegate respondsToSelector:@selector(chinese:didReceiveData:)];
    self.chineseDelegateFlags.didReceiveError = [delegate respondsToSelector:@selector(chinese:didReceiveError:)];
}
/// 在调用delegate的相关协议方法不再进行方法查询，直接取结构体位段存储的内容进行调用
- (void)run {
    double runDistance = 0.0;
    if (_chineseDelegateFlags.didRun) {
        [self.delegate chinese:self run:runDistance];
    }
}
```

---

### 第24条：将类的实现代码分散到便于管理的数个分类之中


```
要点:
使用分类机制把类的实现代码划分成易于管理的小块
将应该视为“私有”的方法归入名叫 Private 的分类，可隐藏实现细节
```
---

### 第25条：总是为第三方类的分类名称加前缀

这个第三方类指NSString、NSDate等

分类中的方法是直接添加在类里面的，它们就好比这个类中的固有方法。将分类方法加入类中这一操作是在运行期系统加载分类时完成的。运行期系统会把分类中所实现的每个方法都加入类的方法列表中。如果类中本来就有此方法，而分类又实现了一次，那么分类中的方法会覆盖原来那一份实现代码。


```
要点:
向第三方类中添加分类时，总应给其名称加上你专用的前缀。
向第三方类中添加分类时，总应给其中的方法名加上你专用的前缀。
```
---

### 第26条：勿在分类中声明属性

分类（Category）是用于向现有类添加方法的一种机制，它允许在不修改原始类的情况下扩展其功能。因为在编译时，原始类和分类的实现是分开编译的。原始类的实例变量是在编译时确定的，而分类的实现是在运行时动态加载的。由于这种动态加载的特性，向分类中添加实例变量会破坏原始类对象的内存布局，导致无法正确访问和管理实例变量。

为了解决这个问题，Objective-C 提供了关联对象（Associated Objects）的机制，允许在分类中关联属性。通过关联对象，我们可以在分类中声明属性并为其提供 getter 和 setter 方法，虽然它们实际上并不是真正的实例变量。这种方式可以模拟属性的行为，但实际上属性的值是存储在关联对象中的。正常的分类是不可以声明属性的，但是从技术上说，分类里可以用runtime声明属性:
```
#import <objc.runtime.h>
static const char *kFriendsPropertyKey = “kFriendsPropertyKey”;
@implementation EOCPerson(Friendship)
-(NSArray*)friends{
    return objc_getAssociatedObject(self, kFriendsPropertyKey);
}

-(void)setFriends:(NSArray*)friends{
    objc_setAssociateObject(self, kFriendsPropertyKey, friends, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}
@end
```

**但是分类的本质在于扩展类的功能，而非封装数据。使用上述方式需要写大量相似的代码，并且在内存管理上容易出错，改动属性的类型需要改变关联对象的相关类型，不利于维护。**


```
要点:
1.把封装数据所用的全部属性都定义在主接口里
2.在“class-extension分类”中，可以定义存取方法，但尽量不要定义属性
```
---

### 第27条：使用“class-extension分类”隐藏实现细节

简而言之，在该分类中可以添加属性，修改属性。
```
// .h  对外声明为只读，防止外界随意修改
@interface Chinese : NSObject
@property (nonatomic, copy, readonly) NSString *firstName;
@property (nonatomic, copy, readonly) NSString *lastName;
@end
// .m 对内声明为可读写。使用扩展声明一些外界不得而知的私有成员变量
@interface Chinese()
@property (nonatomic, copy, readwrite) NSString *firstName;
@property (nonatomic, copy, readwrite) NSString *lastName;
@property (nonatomic, assign) NSUInteger age;
@end
```

```
要点:使用class-extension分类的好处
1.可以向类中新增实例变量。
2.如果类中的主接口声明为只读，可以再类内部修改此属性。
3.把私有方法的原型文件生命在”class-extension分类”里面。
4.想使类遵循的协议不为人知，可以用“class-extension分类”中声明。

```
---

### 第28条：通过协议提供匿名对象

协议定义了一系列方法，遵从此协议的对象应该实现它们（如果这些方法不是可选的, 那么就必须实现)。于是，我们可以用协议把自己所写的API之中的实现细节隐藏起来，将返回的对象设计为遵从此协议的纯id类型。这样的话，想要隐藏的类名就不会出现在API之中了。若是接口背后有多个不同的实现类，而你又不想指明具体使用哪个类，那么可以考虑用这个办法——因为有时候这些类可能会变，有时候它们又无法容纳于标准的类继承体系中，因而不能以某个公共基类来统一表示。

`@property (nonatomic, weak) id <XxxDelegate> delegate;`

```
要点：
1.协议可在某种程度上提供匿名类型。具体的对象类型可以淡化成遵从某协议的id类型，协议里规定了对象所应实现的方法。
2.使用匿名对象来隐藏类型名称（或类名）。
3.如果具体类型不重要，重要的是对象能够响应（定义在协议里的）特定方法，那么可使用匿名对象来表示。
```
---

# 第5章 内存管理
<a id="5"></a>

Objective-C 的内存管理没那么复杂，有了“自动引用计数”(Automatic Reference Counting，ARC)之后，就变得更为简单了。ARC几乎把所有内存管理事宜都交由编译器来决定，开发者只需专注于业务逻辑。

### 第29条：理解引用计数

![](/i/arc.image)


| 场景       | 对应OC的动作 | 对应OC的方法                       |
|------------|--------------|------------------------------------|
| 上班开灯   | 生成对象     | alloc/new/copy/mutableCopy等       |
| 需要照明   | 持有对象     | retain                             |
| 不需要照明 | 解除持有     | release                            |
| 下班关灯   | 销毁对象     | dealloc                            |

ARC 是 Objective-C 中的一种自动内存管理技术，它在编译时会自动插入适当的 retain、release 和 autorelease 方法，以帮助你管理对象的引用计数。ARC 会根据代码的结构和规则来确定何时增加或减少对象的引用计数，从而避免常见的内存管理错误。在ARC下调用这些内存管理方法是非法的。

```
要点:
1.引用计数机制通过可以递增递减的计数器来管理内存。对象创建好之后，其保留技术至少为1。若保留计数为正，则对象继续存活。当保留计数降为0时，对象就被销魂了。
2.在对象生命期中，其余对象通过引用来保留或释放此对象。保留与释放操作分别会递增及递减保留计数
```
---

### 第30条：以 ARC 简化引用计数

```
要点：
1.ARC 管理对象生命周期的办法基本上就是：在合适的地方插入“保留”及“释放”操作。在ARC环境下，变量的内存管理语义可以通过修饰符指明，原来则需要手工执行“保留”及“释放”操作。ARC在调用这些方法时，并不用过普通的Objective-C消息派发机制，而是直接调用其底层C语言版本，这样做性能更好，直接调用底层函数节省很多CPU周期。
2.虽然有了ARC之后无需担心内存管理问题，但是CoreFoundation对象不归ARC管理，开发者必须适时调用CFRetain/CFRelease.
```
---

### 第31条：在delloc方法中只释放引用并解除监听

dealloc 方法是对象释放所调用的方法，此时若使用对象的成员变量可能已经被释放掉了，若使用异步回调时自身已经被释放，若回调中包含 self 会导致程序崩溃。

```
要点：
1.在 dealloc 方法里，应该做的事情就是释放指向其他对象的引用，并取消原来订阅的“简直观测”（KVO）或 NSNotificationCenter 等通知，不要做其他事情
2.如果对象持有文件描述符等系统资源，那么应该专门编写一个方法来解释此种资源。这样的类要和其使用者约定：用完资源后必须调用 close 方法
3.执行异步任务的方法不应在 dealloc 里调用；只能在正常状态下执行的那些方法也不应在 dealloc 里调用，因为此时对象已处于正在回收的状态了
```

```
- (void)dealloc {
    // 移除通知
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    // 释放需手动释放的资源
    // CFRelease(coreFoundationObject);
}
```

另外 即便对象释放，在极个别情况下并不会调用 dealloc 方法，程序终止时一定会调用的是在 application delegate 的 - (void)applicationWillTerminate:(UIApplication *)application 方法, 若一定要清理某些对象，可在此方法中处理。

---

### 第32条：编写“异常安全代码”时留意内存管理问题

```
要点：
1.捕获异常时，一定要注意将 try 块内所创立的对象清理干净
2.在默认情况下，ARC不生成安全处理异常所需的清理代码，开启编译器标志后，可生产这种代码，不过会导致应用程序变大，而且会降低运行效率
```
---

### 第33条：以弱引用避免保留环

weak不会使引用计数+1，避免**循环强引用使得保留环内的所有对象均无法正常释放**而**导致内存泄漏**。

```
要点：
1.捕获异常时，一定要注意将 try 块内所创立的对象清理干净
2.在默认情况下，ARC不生成安全处理异常所需的清理代码，开启编译器标志后，可生产这种代码，不过会导致应用程序变大，而且会降低运行效率
```
---

### 第34条：以“自动释放池块”降低内存峰值

默认情况下：自动释放池需要等待线程执行下一次事件循环时才清空，通常for循环会不断创建新对象加入自动释放池里，循环结束才释放，因此，可能会占用大量内存。**手动加入自动释放池块（@autoreleasepool）：每次for循环都会直接释放内存，从而降低了内存的峰值。**尤其在遍历处理一些**大数组或者大字典**的时候，可以使用自动释放池来降低内存峰值。

```
1.内存峰值：
是指在应用程序运行期间，内存使用量的最高点或最大值。它表示应用程序在某个时间点所占用的最大内存空间。

2.自动释放池原理：
自动释放池中的对象实际上是存储在堆（Heap）中的。栈（Stack）是用于存储局部变量和函数调用信息的一块内存区域，而堆是用于动态分配内存的区域。
当我们创建一个对象并将其添加到自动释放池时，该对象本身仍然位于堆中。自动释放池只是在运行时管理对象的释放时机，而不影响对象在内存中的存储位置。
在自动释放池的作用域结束时，自动释放池会向其中的对象发送release消息，以便释放它们占用的内存。这意味着对象的内存会在堆中被释放，而不是在栈中。栈上的内存是由系统自动管理的，它们的分配和释放是由编译器和程序执行的机制来处理的，与自动释放池无关。
需要注意的是，自动释放池本身是在栈上创建的。当自动释放池的作用域结束时，它会被从栈上弹出，一旦自动释放池结束，其中的对象将会被释放，它们所占用的内存也将会被回收。
```

```
// 实测，降低约25%内存峰值
    for (int i = 0; i < 1000000; i++) {
        @autoreleasepool {
            NSNumber *num = [NSNumber numberWithInt:i];
            NSString *str = [NSString stringWithFormat:@"%d ", i];
            NSLog(@"%@",[NSString stringWithFormat:@"%@+%@", num, str]);
        }
    }
```

```
要点：
1.自动释放池排布在栈中，对象收到autorelease消息后，系统将其放入最顶端的池里。
2.合理运用自动释放池，可降低应用程序的内存峰值。
3.@autoreleasepool这种新式写法能创建出更为轻便的自动释放池。
```
---

### 第35条：用“僵尸对象”调试内存管理问题

`打开 Xcode 项目 -> 转到 "Product"（产品）菜单 -> 选择 "Scheme"（模式）-> 选择 "Edit Scheme"（编辑模式）-> 在左侧列表中选择 "Run"（运行）-> 在右侧的 "Diagnostics"（诊断）选项卡中，勾选 "Enable Zombie Objects"（启用僵尸对象）-> 关闭编辑模式，并重新运行应用程序，以启用僵尸对象调试模式。`

"僵尸对象"（Zombie Objects）：是一种在 iOS 开发中用于调试内存管理问题的特殊调试模式。在正常情况下，当对象被释放后，其内存会被回收并可以被重新使用。但启用僵尸对象调试模式后，释放的对象不会立即从内存中清除，而是被标记为“僵尸对象”。当某个被标记为僵尸对象的方法被调用时，系统会检查该对象是否已被释放。如果是一个僵尸对象，系统会引发异常并生成相应的日志信息，告知开发者尝试访问已释放的对象。这样，开发者可以通过异常信息来定位内存管理问题，例如访问已释放的对象、重复释放对象等。

如果不启用僵尸对象调试模式，当你访问已经释放的对象时，应用程序通常会出现崩溃的情况。这是因为已释放的对象不再有效，尝试访问它们可能导致访问无效内存地址，进而引发崩溃。因为：`向已回收的对象发送消息是不安全的。这么做有时可以，有时不行。具体可行与否，完全取决于对象所占内存有没有为其他内容所覆写。而这块内存有没有移作他用，又无法确定，因此，应用程序只是偶尔崩溃。在没有崩溃的情况下，**那块内存可能只复用了其中一部分，所以对象中的某些二进制数据依然有效**。还有一种可能，就是**那块内存恰好为另外一个有效且存活的对象所占据**。在这种情况下，运行期系统会把消息发到新对象那里，而此对象也许能应答，也许不能。**如果能，那程序就不崩溃**，可你会觉得奇怪:为什么收到消息的对象不是预想的那个呢？**若新对象无法响应选择子，则程序依然会崩溃**。`

```
要点：
1.系统在回收对象时，可以不将其真的回收，而是把它转化为僵尸对象。通过环境变量NSZombieEnabled可开启此功能。
2.系统会修改对象的isa指针，令其指向特殊的僵尸类，从而使该对象变为僵尸对象。 儸尸类能够响应所有的选择子，响应方式为：打印一条包含消息内容及其接收者的消息，然后终止应用程序。
```
---

### 第36条：不要使用 retainCount

引入ARC之后，retainCount方法就正式废止了，在ARC下调用该方法会导致编译器报错。

---

# 第6章：块与大中枢派发
<a id="6"></a>
### 第37条：理解“块”这一概念

[iOS_Block研究](https://chiehwang.top/iOS_block)

```
定义块的时候，其所占的内存区域是分配在栈中的。这就是说，块只在定义它的那个范围内有效。例如，下面这段代码就有危险:
void (^block) ();
if (/* some condition */){
    block = ^{
        NSLog(@"block");
    }
};
block();
定义在if及 else 语句中的两个块都分配在栈内存中。编译器会给每个块分配好栈内存然而等离开了相应的范围之后，编译器有可能把分配给块的内存覆写掉。于是，这两个块只能保证在对应的 if或 else 语句范围内有效。这样写出来的代码可以编译，但是运行起来时而正确，时而错误。若编译器未覆写待执行的块，则程序照常运行，若覆写，则程序崩溃。为解决此问题，可给块对象发送 copy 消息以拷贝之。这样的话，就可以把块从栈复制到堆了。拷贝后的块，可以在定义它的那个范围之外使用:
void (^block) ();
if (/* some condition */){
    block = [^{
        NSLog(@"block");
    } copy];
};
block();
现在代码就安全了（ARC下编译器编译时会帮你优化自动帮你加上了copy操作）。如果手动管理引用计数，那么在用完块之后还需将其释放。
```
**block数据结构：**
![](/i/block.png)

声明方式：[block语法](http://fuckingblocksyntax.com/)

As a **local variable**:

`returnType (^blockName)(parameterTypes) = ^returnType(parameters) {...};`

As a **property**:

`@property (nonatomic, copy, nullability) returnType (^blockName)(parameterTypes);`

As a **method parameter**:

`- (void)someMethodThatTakesABlock:(returnType (^nullability blockName)(parameterTypes))blockName;`

As an **argument to a method call**:

`[someObject someMethodThatTakesABlock:^returnType (parameters) {...}];`

As a **parameter to a C function**:

`void SomeFunctionThatTakesABlock(returnType (^blockName)(parameterTypes));`

As a **typedef**:

`typedef returnType (^TypeName)(parameterTypes);`

`TypeName blockName = ^returnType(parameters) {...};`

```
// return_type (^block_name)(parameters)
// 示例2：带参数和返回值的Block
int (^multiply)(int, int) = ^(int num1, int num2) {
    return num1 * num2;
};
```

```
要点：
1.块 是C、C++、Objective-C 中的语法闭包
2.块 可接受参数，也可返回值
3.块 可以分配在栈或堆上，也可以是全局的。分配在栈上的块可拷贝到堆里，这样的话，就和标准 Objective-C 对象一样，具备引用计数了。
```
---

### 第38条：为常用的块类型创建typedef

```
int (^CWTestBlock)(int first,int second) = ^ (int first,int second) {
    return first + second;
};

使用 typedef 创建Block , 可将Block作为类型声明，使代码可读性更强，形如：

typedef int(^CWTestBlock)(int,int);
CWTestBlock block = ^(int first,int second) {
    return first + second;
};
```

```
要点：
1.以 typedef 重新定义块类型，可令块类型变量用起来更加简单
2.定义新类型时应遵从现有的命名习惯，勿使其名称与别的类型相冲突
3.不妨为同一个块签名定义多个类型别名。如果要重构的代码使用了块类型的某个别名，那么只需修改相应typedef中的块签名即可，无须改动其他 typedef
```
---

### 第39条：用 handler 块降低代码分散程度

很多情况下，在一个功能类的回调使用 block 比使用 delegate 会让代码看起来更简洁，API更友好。如：

```
typedef void (^CompletionHandler)(NSArray *data, NSError *error);

- (void)fetchDataWithCompletionHandler:(CompletionHandler)completion {
    // 执行网络请求获取数据
    [self.networkManager fetchDataWithCompletion:^(NSArray *data, NSError *error) {
        // 处理返回的数据
        if (error) {
            // 错误处理
            completion(nil, error);
            return;
        }
        // 数据处理
        NSArray *processedData = [self processData:data];
        completion(processedData, nil);
    }];
}

// 调用示例
[self fetchDataWithCompletionHandler:^(NSArray *data, NSError *error) {
    if (error) {
        // 错误处理
        NSLog(@"请求失败: %@", error.localizedDescription);
    } else {
        // 更新 UI 或处理数据
        [self.tableView reloadData];
    }
}];
```

```
要点：
1.在创建对象时，可以使用内联的 handler 块将相关业务逻辑一并声明
2.在有多个实例需要监控时，如果使用委托模式，那么经常需要根据传入的对象来切换，而若改用 handler 块，那么可以增加一个参数，使调用者可通过此参数决定应该把块安排在哪个队列上执行
```
---

### 第40条：用块引用其所属对象时不要出现保留环

如果block被当前ViewController（self）持有，这时，如果block内部再持有ViewController（self），就会造成循环引用。：
```
 - (void)viewDidLoad {
    [super viewDidLoad];
    [self executeBlock:^(NSString *str) {
        NSString *content = [NSString stringWithFormat:@"%@--%@",self.content,str];
        NSLog(@"hello world %@",content);
    }];
}
- (void)executeBlock:(void(^)(NSString *str))myblock{
    // block为self的一个属性，被self持有
    self.myblock = myblock;
    myblock(@"myblock1");
}
```

解决方案：在block外部对弱化self，再在block内部强化已经弱化的weakSelf：
```
__weak typeof(self) weakSelf = self;
[...{
__strong typeof(weakSelf) strongSelf = weakSelf;
}]
```

只要block没有被self所持有的，在block中就可以使用self。

```
要点：
1.如果块所捕获的对象直接或间接保留了块本身，那么就得当心保留环问题。
2.一定要找个适当的时机解除保留环，而不能把责任推给API的调用者
```
---

### 第41条：多用派发队列，少用同步锁

在iOS开发中，如何通过锁来提供同步机制？

1.在GCD出现之前，有两种方式：同步块 和 NSLock
```
- (void)synchronizedMethod {
    @synchronized (self) {       
        // Safe area... 
    }

    NSLock *lock = [[NSLock alloc] init]; // 互斥锁
    [lock lock];
    NSLog(@"Chieh");
    [lock unlock];
}
```

2.GCD
```
_syncQueue = dispatch_queue_create("syncQueue", DISPATCH_QUEUE_CONCURRENT);

//读取字符串
- (NSString*)someString {
    __block NSString *localSomeString;
     dispatch_sync(_syncQueue, ^{
        localSomeString = _someString;
    });
     return localSomeString;
}
- (void)setSomeString:(NSString*)someString {
     dispatch_barrier_async(_syncQueue, ^{
        _someString = someString;
    });
}
```

![](/i/barrier.png)

同步块和 NSLock 可能被 GCD 取代的一些原因：
```
1.简化编程模型：GCD 提供了一种更简洁、易于使用的编程模型，通过使用队列（Dispatch Queue）和块（Block），可以更方便地管理任务的提交和执行。相比之下，使用同步块和 NSLock 需要手动管理锁的获取和释放，容易出现错误和死锁情况。
2.避免死锁：使用同步块和 NSLock 时，开发人员需要手动管理锁的获取和释放，如果处理不当，可能会导致死锁的情况发生，使应用程序无法继续执行。而 GCD 利用队列和异步执行的方式，可以避免一些常见的死锁问题。
3.并行执行：GCD 提供了并行执行任务的能力，可以根据系统的实际情况自动调度任务在多个线程上执行。这样可以更充分地利用多核处理器的优势，提高应用程序的性能。而同步块和 NSLock 在串行执行的情况下，无法实现并行执行的效果。
4.更好的性能：GCD 是基于底层的线程池和任务调度器实现的，并针对不同的硬件和系统情况进行了优化。它能够智能地管理线程和任务的调度，提供更高效的并发处理能力。相比之下，同步块和 NSLock 的性能可能较低，因为它们可能涉及线程的阻塞和唤醒操作。
```

尽管 GCD 提供了更多优势和灵活性，但在某些情况下，使用同步块和 NSLock 仍然是合适的选择。例如，当需要实现更复杂的同步机制、需要使用递归锁（NSRecursiveLock）或条件锁（NSConditionLock）时，NSLock 可能更适合。最终选择使用哪种方式取决于具体的需求和场景。

```
要点：
1.派发队列可用来表述同步语义，这种做法要比使用 @synchronized () 块或 NSLock 对象更简单
2.将同步与异步派发结合起来，可以实现与普通加锁机制一样的同步行为，而这么做却不会阻塞执行异步派发的线程
3.使用同步队列及栅栏块，可以令同步行为更加高效
```
---

### 第42条：多用 GCD，少用 performSelector 系列方法

performSelector系列方法的缺点有两个：
```
1.performSelector系列方法可能引起内存泄漏：在ARC环境下，编译器并不知道将要调用的选择子是什么，有没有返回值，返回值是什么，所以ARC不能判断返回值是否能释放，因此ARC做了一个比较谨慎的做法：只添加retain，不添加release。因此在有返回值或参数的时候可能导致内存泄漏。
3.performSelector系列方法的返回值只能是void或OC对象类型。
4.performSelector系列方法最多只能传入两个参数。
```

```
    // 例如：延后执行某项任务
    [self performSelector:@selector(doSearchAction:) withObject:trimText afterDelay:1];
    // 应当使用 dispatch_after
    dispatch_time_t delayTime = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.0 * NSEC_PER_SEC));
    dispatch_after(delayTime, dispatch_get_main_queue(), ^{
        [self doSearchAction:trimText];
    });
```

```
要点：
1.performSelector 系列方法在内存管理方面容易有疏失。它无法确定将要执行的选择子具体是什么，因而 ARC 编译器也就无法插入适当的内存管理方法
2.performSelector 系列方法所能吃力的选择子太过局限，选择子的返回值类型及发送给方法的参数个数都受到限制。
3.如果想把任务放在另一个线程上执行，那么最好不要用 performSelector 系列方法，而是应该把任务封装到块里，然后调用 GCD 派发机制的相关方法来实现
```
---

### 第43条：掌握 GCD 及操作队列的使用时机

weak不会使引用计数+1，避免**循环强引用使得保留环内的所有对象均无法正常释放**而**导致内存泄漏**。

```
要点：
1.捕获异常时，一定要注意将 try 块内所创立的对象清理干净
2.在默认情况下，ARC不生成安全处理异常所需的清理代码，开启编译器标志后，可生产这种代码，不过会导致应用程序变大，而且会降低运行效率
```
---

### 第35条：用“僵尸对象”调试内存管理问题

weak不会使引用计数+1，避免**循环强引用使得保留环内的所有对象均无法正常释放**而**导致内存泄漏**。

```
要点：
1.捕获异常时，一定要注意将 try 块内所创立的对象清理干净
2.在默认情况下，ARC不生成安全处理异常所需的清理代码，开启编译器标志后，可生产这种代码，不过会导致应用程序变大，而且会降低运行效率
```
---

### 第35条：用“僵尸对象”调试内存管理问题

weak不会使引用计数+1，避免**循环强引用使得保留环内的所有对象均无法正常释放**而**导致内存泄漏**。

```
要点：
1.捕获异常时，一定要注意将 try 块内所创立的对象清理干净
2.在默认情况下，ARC不生成安全处理异常所需的清理代码，开启编译器标志后，可生产这种代码，不过会导致应用程序变大，而且会降低运行效率
```
---

### 第35条：用“僵尸对象”调试内存管理问题

weak不会使引用计数+1，避免**循环强引用使得保留环内的所有对象均无法正常释放**而**导致内存泄漏**。

```
要点：
1.捕获异常时，一定要注意将 try 块内所创立的对象清理干净
2.在默认情况下，ARC不生成安全处理异常所需的清理代码，开启编译器标志后，可生产这种代码，不过会导致应用程序变大，而且会降低运行效率
```
---

### 第35条：用“僵尸对象”调试内存管理问题

weak不会使引用计数+1，避免**循环强引用使得保留环内的所有对象均无法正常释放**而**导致内存泄漏**。

```
要点：
1.捕获异常时，一定要注意将 try 块内所创立的对象清理干净
2.在默认情况下，ARC不生成安全处理异常所需的清理代码，开启编译器标志后，可生产这种代码，不过会导致应用程序变大，而且会降低运行效率
```
---

### 第35条：用“僵尸对象”调试内存管理问题

weak不会使引用计数+1，避免**循环强引用使得保留环内的所有对象均无法正常释放**而**导致内存泄漏**。

```
要点：
1.捕获异常时，一定要注意将 try 块内所创立的对象清理干净
2.在默认情况下，ARC不生成安全处理异常所需的清理代码，开启编译器标志后，可生产这种代码，不过会导致应用程序变大，而且会降低运行效率
```
---