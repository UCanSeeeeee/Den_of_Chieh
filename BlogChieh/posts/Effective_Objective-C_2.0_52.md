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

### 第17条：实现description
### 第17条：实现description
### 第17条：实现description
### 第17条：实现description
### 第17条：实现description
