---
title: Objective-C 基础
publish_date: 2022-12-26
---

一切从零开始

## 细节


1.使用数据类型要遵循：先声明，再实现，后使用

2.在OC中声明类的时候，必须指明父类

__________________________________________________________________________

### 一、".h" 和 ".m" 的区别：

```
.h文件是头文件，包含了类，类型、函数与常数的声明；而.m文件是源代码文件。interface放到.h里去, 这样其它文件可以调用这个类；而implementation一般写在.m文件里。所有能被外部文件访问的成员与方法都定义到.h里.
.m就是真正实现. 一些不对外开放的方法成员, 在.m里也能存在.
```

### 二、类框架：

```
// .h文件：
#import <Foundation/Foundation.h>
//引入头文件
@interface Person : NSObject{
//声明成员变量
}
//声明属性和方法：声明属性的时候，不能给属性赋初值。
@end

// .m文件：
#import "Person.h"
//引入头文件
//添加类扩展
@implementation Person
//对声明的方法进行实现
@end
```

### 三、类扩展的编写语法:

```
@interface Person (){
  //向类声明部分一样，可以添加成员变量
}
//添加属性，语法和在类声明中的属性一样。
//添加方法
@end
```

### 四、引入头文件：

头文件有两种，OC中本来就有的头文件和自己创建的文件。

```
类在.h文件和.m文件中都可以引入头文件，区别是：在.h文件中引入头文件，.h和.m文件都可以使用这个文件中的资源；如果在.m文件引入头文件，.h文件不能使用该文件中的资源。所以，在引入头文件的时候，需要考虑在.h文件中当声明类的时候，是否使用该头文件中包含的资源。如果使用，就在.h文件中引入；反之，在.m文件中引入即可。

引入编程语言提供的头文件的写法是：
  #import <文件名>
引入自己写的文件的写法是：
  #import "文件名"
引入的文件必须是.h文件，引入.m文件会报错
```

```
问题：当两个类相互包含的时候，比如 Person.h 中包含 Book.h，而 Book.h 中又包含 Person.h。这个时候就会出现循环引用的问题，造成程序无限递归，从而导致编译无法通过。
解决方案：其中一边不要使用 #import 来引入对方的头文件。而是使用 @class 类名；来标注这是一个类。这样就可以在不引入对方头文件的情况下，告诉编译器这是一个类。在 .m 文件中再 #import 对方的头文件，这样就可以使用了
```

```
#import "" 和 #import <> 的区别：
使用“<>”用来引入系统文件的头文件，使用“""”引入本地文件的头文件。

#import 和 @class 的区别：
#import 是将指定的文件内容在预编译的时候拷贝到写指令的地方。
@class 并不会拷贝任何内容，只是告诉编译器这是一个类。这样编译器在编译的时候才可以知道这是一个类。如果需要使用该类或者内部方法需要使用 #import导入。
```

### 五、声明成员变量：

```
在类中，对于属性实际上有两种形式：成员变量和属性。它们都是变量。不同的是：成员变量外界不能调用，属性可以。
```

### 六、声明属性和方法:

```
1.声明属性：
在OC中，声明属性需要关键字来修饰：@property。例如，我们声明一个int型的age属性的编写方式为：@property int age;

2.声明方法；
在OC语言中，类中可以包含两种方法：类方法和对象方法。类方法要用类名调用；对象方法需要实例化对象调用。

类方法的创建：
+ (int)personWithA1:(float)a1 andA2:(NSString*)a2; //a1,a2分别代表两个参数
对象方法（实例方法）的创建：
- (int)personWithA1:(float)a1 andA2:(NSString*)a2;

调用类方法：
      [Person personWithA1:2 andA2:@"类方法"];//调用对象是类名
调用对象方法（实例方法）：
      Person * obj1=[[Person alloc]init];
      [obj1 personWithA1:1 andA2:@"对象方法"];//调用对象是类对象

方法声明格式：  
方法类型 (返回值类型)方法名:(参数类型)内参名a 外参名B:(参数类型)内参名b; // 第一个参数无外参，且参数之间用空格
```

```
类工厂方法：类方法+返回值为id/instancetype+规范命名 buttonWithType
```

### 七、成员变量、属性和方法

实例变量只能在类内访问，不能在类外访问，也不能通过点语法访问。若想打破这个规则，需要对该变量实现`getter/setter`方法。属性没有该限制，因为编译器会为其自动创建一组存取方法。


```
@interface Person : NSObject{  
// 成员变量 - 如果成员变量的类型是一个类则称这个变量为实例变量。成员变量包括实例变量，所以可以通称为成员变量。
    NSString *name; //实例变量
    int age;
}
// 声明属性
// 声明方法
@end
```

一、通常我们使用@property声明的变量都叫做成员属性，也可称属性变量。

```
example：
@property(nonatomic, readwrite, assign) double height;  
// 括号括起来的部分就是属性修饰符。总共有3类属性修饰符：多线程类型、读写类型、内存管理类型。
```

二、@property、@synthesize和@dynamic
```
@property有两个对应的词，一个是@synthesize，一个是@dynamic。如果@synthesize和@dynamic都没写，那么默认的就是@syntheszie var = _var；（默认情况下， @property声明的属性也是@synthesize的。）
@synthesize的语义是如果你没有手动实现setter方法和getter方法，那么编译器会自动为你加上这两个方法。
@dynamic告诉编译器,属性的setter与getter方法由用户自己实现，不自动生成。

```
 
__________________________________________________________________________

## 属性修饰符

参考资料：[摸鱼周报](https://mp.weixin.qq.com/s/dtyozlqCO7PcpyGhx2qB5g)

1⃣️多线程修饰符：

```
1.atomic（默认）：保证属性的赋值和取值的原子性操作是线程安全的，但不包括操作和访问。
2.nonatomic：一般属性都用 nonatomic 进行修饰，因为 atomic 非常耗时。
原子性：指事务的不可分割性，一个事务的所有操作要么不间断地全部被执行，要么一个也没有执行。
```

2⃣️读写权限修饰符：

```
1.readwrite（默认）：同时生成 setter 方法和 getter 方法的声明和实现。
2.readonly	：只生成 getter 方法的声明和实现。
3.setter：可以指定生成的 setter 方法名，如 setter = setName。
4.getter：可以指定生成的 getter 方法名，如 getter = getName。
```

3⃣️内存管理修饰符：

一、ARC模式：

```
assign：

1. 既可以修饰基本数据类型，也可以修饰对象类型；
2. setter 方法的实现是直接赋值，一般用于基本数据类型 ；
3. 修饰基本数据类型，如 NSInteger、BOOL、int、double、float、char 等；
4. 修饰对象类型时，不增加其引用计数；
5. 会产生悬垂指针（悬垂指针：assign 修饰的对象在被释放之后，指针仍然指向原对象地址，该指针变为悬垂指针。这时候如果继续通过该指针访问原对象的话，就可能导致程序崩溃）。

weak：

1. 只能修饰对象类型；
2. ARC 下才能使用；
3. 修饰弱引用，不增加对象引用计数，主要可以用于避免循环引用；
4. weak 修饰的对象在被释放之后，会自动将指针置为 nil，不会产生悬垂指针。

strong（默认）：

1. ARC 下才能使用；
2. 原理同 retain；
3. 在修饰 block 时，strong 相当于 copy，而 retain 相当于 assign。

copy：

1.setter 方法的实现是 release 旧值，copy 新值，
2.将内容另外拷贝一份，保存在一个单独的存储空间中。用于不可变类型的属性（NSString、NSArray,NSDictionry、block 等）类型。
```

二、MRC模式：

```
unsafe_unretained：

1. MRC 下经常使用，ARC 下基本不用；
2. 既可以修饰基本数据类型，也可以修饰对象类型；
3. 同 weak，区别就在于 unsafe_unretained 会产生悬垂指针。

retain：

1. MRC 下使用，ARC 下基本使用 strong；
2. 修饰强引用，将指针原来指向的旧对象释放掉，然后指向新对象，同时将新对象的引用计数加1；
3. setter 方法的实现是 release 旧值，retain 新值，用于OC对象类型。
```

常用修饰符的使用场景：

```
nonatomic：不涉及到多线程的情况下都用。
readwrite：自己看情况用。
assign：对于基本数据类型，例如int，double，float，char，还有OC语言中的BOOL以及NSInteger
weak：协议 delegate。
strong: 类对象。
copy：不可变类型的属性如NSString、NSArray、NSDictionry、block。
```

## 所有权修饰符


```
__strong：

1. 强引用持有对象，可以对应 strong、retain、copy 关键字。
2. 编译器将为 strong、retain、copy 修饰的属性生成带 __strong 所有权修饰符的实例变量。

__weak：

1. 弱引用持有对象，对应 weak 关键字，ARC下用来防止循环引用。
2. 编译器将为 weak 修饰的属性生成带 __weak 所有权修饰符的实例变量。

__unsafe_unretained：

1. 弱引用持有对象，对应 unsafe_unretained、assign 关键字，MRC下用来防止循环引用。
2. 编译器将为 unsafe_unretained 修饰的属性生成带 __unsafe_unretained 所有权修饰符的实例变量。
3. 与 __weak 相比，它不需要遍历 weak 表来检查对象是否 nil，性能上要更好一些。但是它会产生悬垂指针。

__autoreleasing：

在 MRC 中我们可以给对象发送 autorelease 消息来将它注册到 autoreleasepool 中，而在 ARC 中我们可以使用 __autoreleasing 修饰符修饰对象将对象注册到 autoreleasepool 中。
```


__________________________________________________________________________

## 成员变量自动生成的set/get方法

```
@interface people : NSObject{
    int _age;
}
@property int age; //这句写后将自动生成set/get方法  setAge:(int)age`
@end

@implementation people

//自定义set方法
-(void)setAge:(int)age{
    NSLog(@"set age : ");
    _age=age; 
}

//自定义get方法
-(int)age{
    NSLog(@" get age: ");
    return _age;
}
@end
```

__________________________________________________________________________

## OC的一些机制

### 一、消息发送机制：

本质：

```
[person say] 在编译时就变成了 objc_msgsend(person @selector(say));
解释为：向person这个对象发送say的消息。所以OC称调用方法为向某个接受者发送某个消息。
所以：C语言程序在编译的时候就去寻找函数的具体实现，如果这个函数没有实现，程序编译就不能通过。但是OC可以成功编译，运行时才会报错。
```

两种调用类型：

```
- 调用对象的属性（点语法 - 调用类中的属性）：类对象.属性的方式

people.name = @"ZhangSan"; // [people setName:@"ZhangSan"];
NSString * theName = people.name; // NSString * theName = [people getName];

在没有等号的情况下，默认是get方法。
在有等号的情况下，在等号左边是set方法。在等号右边是get方法。

- 调用类中的方法：[接收方 选择器:实参];
1.对于方法开头有”-“的，用［对象 方法］的方法。
2.带有”+“的，用［类名 方法］的方式调用。
```

### 二、对“instancetype”的理解：

```
定义：方法返回类型，通常用于init初始化相关方法的返回类型。
解释：返回类型不写成Person *是因为如果Person有子类时，其子类方法的返回类型应该是子类类型，又由于子类继承了Person相关方法，然而Objective-C不允许一个类中存在两个消息的方法名相同，而参数或返回类型不同的情况。
```

### 三、对“id”，“instancetype”的理解：

```
1.当不确定对象类型时，可以使用类型id。可用于修饰变量、方法参数和返回值。instancetype只能作为返回值使用。
2.什么时候使用instancetype？
- 非关联返回类型方法的返回值是id时，返回值为id，所以此时使用instancetype会让其返回值为当前所在类的类型。instancetype是一个编译时类型，会根据实际的调用类自动推断返回类型。
/*
关联返回类型：通过运行时关联对象（Runtime Associated Object）来给方法添加额外的返回类型信息。返回值类型是当前所在类的类型。
*/
```

### 四、对`self`、`super`的理解：

```
在使用OC语言创建一个类时，底层就为我们创建好了一个self，它的使用范围仅限于在本类中（在类的实现部分）。

self代表当前方法的调用者。在OC的类中，实现部分全部都是方法（声明部分无法使用self），有类方法和对象方法。如果外界对象调用对象方法时，self就代表这个对象；同样，调用类方法时，self就代表这个类。这句话简单的理解，就是：如果self所在的这个方法是类方法，那么self就代表当前类；如果是对象方法，self就代表当前类的对象。

在self表示本类对象的时候，就具备类对象的所有功能，可以使用self来调用类中的属性，例如：self.name = @"ZhangSan"
```

```
self和super指向同一个对象，区别在于：
self调用方法时优先在当前类的方法列表中寻找方法，super会优先从父类的方法列表中寻找方法。
```

在子类的初始化方法中要调用父类的初始化方法`self = [super init]`，将返回的父类实例赋值给self，通常用于确保父类的初始化成功以及子类可以继承父类的属性和行为。

### 五、对`_`的理解：

```

情景：self.name会调用它的set方法或get方法。这样就会出现get方法中调用get方法或者是set方法中调用set方法，如此不断重复下去，造成死循环，程序将崩溃。所以在这种地方，我们就只能使用_name的这种形式。

什么时候用_name，什么时候用self.name呢？
“如果在编写过程中需要在类中调用本类的属性，如果这个地方必须调用get或set方法，那就必须使用self.name这种方式，如果在get或者set方法中，就必须使用_name的方式，如果不是上述的两种情况，使用哪个都可以。”

```

### 六、对“super”的理解：

```
super和self的使用规则一样，不同之处在于：super指父类方法的调用者。而self指当前方法的调用者。
通常发送消息给某个对象时，会先从该对象查找对应方法，如果没找到会继续从父类中查找，一直到NSObject，直到查到为止。
```

__________________________________________________________________________

## 内存管理机制

### 一、内存管理，从大的方面来说，主要指栈和堆上的内存管理：

```
1.当一个方法执行的时候，内存分配在Stack上。假设有如下调用关系： ｀main() ->randomItem -> alloc｀，当我们开始执行main()方法时，会从栈底到栈顶依次给 main()及其本地变量、randomItem方法及其本地变量、alloc方法及其本地变量 分配内存。当方法执行完成时，会从栈顶到栈底依次出栈。
2.所有Objective-C中的对象，内存分配都在Heap上。通常使用指针存储对象在堆上的内存地址。
```

### 二、iOS使用ARC和autoreleasepool机制实现内存管理。

```
1.ARC即Automatic Reference Counting，自动引用计数。是相对于MRC(Manual Reference Counting，手动引用计数)而言的。
2.若使用autoreleasepool关键字括起来，当括号里方法执行完时，实例对象会自动释放。
```

__________________________________________________________________________

## 占位符、转义符和常量定义

参考资料：[占位符](https://blog.csdn.net/ypf1024/article/details/109892256)、[转义符](https://www.yiibai.com/objective_c/objective_c_constants.html)

### 一、占位符：

```
1.整型：

%d    // 十进制整数，正数无符号，负数有“-”符号
%o    // 八进制无符号整数，没有0前缀
%x    // 十六进制无符号整数，没有0x前缀
%u    // 十进制无符号整数
%zd  // NSInteger专用
%tu  // NSUInteger专用

2.浮点型：

%f    // 以小数形式输出浮点数，默认6位小数
%e    // 以指数形式输出浮点数，默认6位小数
%g    // 自动选择%e或者%f格式

3.字符型：

%c    // 单个字符的输出，同C语言
%s    // 输出字符串，同C语言

4.其他类型：

%p    // 输出十六进制形式的指针地址
%@    // 输出OC对象

5.占位符附加字符：

1)在整型和浮点型占位符之前，加l(字母L的小写)，可以输出长整型或长字符串；
2)n(任意整数)：如%5d，输出5位数字，即输出的总位数。
3).n：保留几个小数。如%5.2f，表示5位数字，2位小数；字符串：截取字符的个数；
4)-：字符左对齐。

6.NSLog各种打印格式：

%@ 对象
%d, %i 整型 (%i的老写法)
%hd 短整型
%ld, %lld 长整型
%u 无符整型
%f 浮点型和double型
%0.2f 精度浮点数，只保留两位小数
%x 为32位的无符号整型数(unsigned int),打印使用数字0-9的十六进制,小写a-f;
%X 为32位的无符号整型数(unsigned int),打印使用数字0-9的十六进制,大写A-F;
%o 八进制
%zu size_t
%p 指针地址
%e float/double (科学计算)
%g float/double (科学技术法)
%s char * 字符串
%.*s Pascal字符串
%c char 字符
%C unichar
%Lf 64位double
%lu sizeof(i)内存中所占字节数
打印CGSize：NSLog(@"%@", NSStringFromCGSize(someCGSize));
打印CGRect：NSLog(@"%@", NSStringFromCGRect(someCGRect)); 或者CFShow(NSStringFromCGRect(someCGRect));
```

### 二、转义符：

```
\\          \字符
\'字符     '字符 
\"字符     "字符
\?         ?字符
\a         警报或铃声
\b         退格
\f          换页
\n         换行
\r         回车
\t         水平制表
\v         水直制表
\ooo      八进制数字的一到三位数
```

### 三、定义常量：

#define 预处理器

`#define viewHeight 40`

const 关键字

`static CGFloat const viewHeight = 40.f;`

如果常量仅在某个实现文件中使用，还应该加上 static 关键字，否则会被视为全局常量。若不使用 static，编译器会为它创建一个外部符号，若另一个编译单元中也声明了同名变量，就会报错。

__________________________________________________________________________

## init /initWithFrame调用机制：
```
动态查找到 UIView 的 init 方法
调用 super init 方法
super init 方法内部执行的是 [super initWithFrame:CGRectZero]
然后 super 会发现 MyView 实现了 initWithFrame方法
转而执行 [UIView initWithFrame:CGRectZero]
最后再执行 init 其余部分
```
__________________________________________________________________________

## OC中对象的常用方法

1.比较两个对象是否为同一个对象（指针是否指向同一地址）

-（bool）isEqual:(id)object


2.调用一个方法（最难的一个，其余类似）

`-（void）performSelector:(SEL)aSelector withObject:(id)anArgument afterDelay:(NSTimeInterval)delay;//延迟调用  调用私有方法 没有警告`


3.某一个对象是否派生或属于某一个类

`-（bool）isKindOfClass:(Class)aClass;`


4.某一个对象是否属于某类

`-（bool）isMemberOfClass:(Class)aClass;`


5.某对象是否响应指定的方法：

`- (bool)respondsToSelector:(SEL)aSelector;`


6.返回指定对象的父类和本类

`-（Class）superclass; -(Class)class;`

__________________________________________________________________________

## 指针

```
balance是指向&balance [0]的指针，它是balance数组的第一个元素的地址。 因此，以下程序片段为p分配第一个balance元素的地址
double *p;
double balance[10];
p = balance;
将第一个元素的地址存储在p中后，可以使用* p，*(p + 1)，*(p + 2)等访问数组元素。
```

__________________________________________________________________________

## OC中的单例

单例理解：就是在开发过程中，有时会需要在不同的地方对同一块内存的数据进行操作，而对于OC来讲，这块内存往往代表的是一个对象的数据。所以想出了这样一种办法：就是可以通过一个类方法直接返回一个本类的对象(必须是类方法，因为如果是对象方法，在调用的时候还要声明一个该类的对象并对其初始化，而这个对象本身没有实际作用，无故的占用了内存空间)，而且保证这个对象只被分配一次内存空间(这样才能保证通过这个对象永远能够对那块内存空间进行操作)，通过这种方式，在整个工程中，你只要想读取这块内存中的数据，就可以通过调用该类的类方法返回这个唯一的对象。

单例用处：单例，严格来说应该是工程中需要共享数据时才使用，如果用单例只是去传递数据，那就有点大材小用了。

模拟背景：两个人ZhangSan和LiSi合租了一辆车Car，通过记录每个人开车的时间，最后统计出这辆车总共跑的小时数。⬇️

- Car代码

```
#import <Foundation/Foundation.h>
@interface Car : NSObject
@property (nonatomic,assign) int driveHours;
+ (instancetype)car;
@end

#import "Car.h"
static Car *car = nil; // static关键字在这里的作用是：使这个对象只分配一次内存
@implementation Car
+ (instancetype)car {
         if (car == nil) {
             car = [[Car alloc] init]; // 我们首先判断car对象是否是空值，如果是空值，我们才给它初始化。否则，说明它已经被使用过了，就直接返回，不进入if语句。
         }
         return car;
}
@end
```

- Person代码

```
#import <Foundation/Foundation.h>
#import "Car.h"
@interface Person : NSObject
@property (nonatomic,copy) NSString *name;
@property (nonatomic,strong) Car *car;
- (void)displayWithDriveHours:(int)hours;
@end

#import "Person.h"
@implementation Person
- (instancetype)init {
if (self = [super init]) {
        self.car = [Car car];//创建对象的car属性实际上就是Car类的那个唯一的实例。
        self.name = nil;
    }
    return self;
}
- (void)displayWithDriveHours:(int)hours {
    self.car.driveHours += hours;
}
@end
```

- main.m代码

```
“import <Foundation/Foundation.h>
#import "Person.h"
int main(int argc, const char * argv[]) {
    Person *ZhangSan = [[Person alloc] init];
    Person *LiSi = [[Person alloc] init];
    [LiSi displayWithDriveHours:5];
    [ZhangSan displayWithDriveHours:10];
    [LiSi displayWithDriveHours:3];
    Car *car = [Car car];
    NSLog(@"The allHours are %d",car.driveHours); // The allHours are 18
    return 0;
    // 无论是哪个对象调用这个类方法，返回的都是相同的对象，对同一块内存数据做操作。这就是单例的实际作用。
}
```

__________________________________________________________________________

## Foundation 和 UIKit

官方解释:

Foundation：
Access essential data types, collections, and operating-system services to define the base layer of functionality for your app.The Foundation framework provides a base layer of functionality for apps and frameworks, including data storage and persistence, text processing, date and time calculations, sorting and filtering, and networking.  The classes, protocols, and data types defined by Foundation are used throughout the macOS, iOS, watchOS, and tvOS SDKs.
//访问基本数据类型、集合和操作系统服务来定义应用程序的基本功能层。Foundation框架为应用程序和框架提供了一个基本的功能层，包括数据存储和持久性、文本处理、日期和时间计算、排序和过滤以及联网。Foundation定义的类、协议和数据类型在macOS、iOS、watchOS和tvOS sdk中使用。

Foundation框架就是一个Foundation.h文件。和其它.h文件不同的是，Foundation.h文件中包含的全是头文件(接口)。通过前面学习的知识知道，如果要在编程过程中使用这个类，那么首先要在程序开始之前引入这个类的.h文件，引入之后，才可以对这个类进行操作。而Foundation.h文件全是其他类的.h文件。那么就应该明白，其实Foundation框架就是通过一个.h文件将苹果官方工程师们写的各个类的接口文件包裹起来，全部包含在一个.h文件中，给这个文件起了个名字，叫Foundation.h文件，又由于它符合框架的定义，所以Foundation.h文件又叫做Foundation框架。

```
1. 值对象
2. 集合
3. 操作系统服务：文件系统、URL、进程通讯
4. 通知
5. 归档和序列化
6. 表达式和条件判断
7. Objective-C语言服务
```

UIKit：
Construct and manage a graphical, event-driven user interface for your iOS or tvOS app.The UIKit framework provides the required infrastructure for your iOS or tvOS apps.  It provides the window and view architecture for implementing your interface, the event handling infrastructure for delivering Multi-Touch and other types of input to your app, and the main run loop needed to manage interactions among the user, the system, and your app. Other features offered by the framework include animation support, document support, drawing and printing support, information about the current device, text management and display, search support, accessibility support,  app extension support, and resource management.
//为你的iOS或tvOS应用程序构建和管理图形化、事件驱动的用户界面。UIKit框架为你的iOS或tvOS应用程序提供了所需的基础设施。它提供了实现界面的窗口和视图架构，提供了事件处理基础设施，用于向应用程序交付多点触控和其他类型的输入，以及管理用户、系统和应用程序之间交互所需的主运行循环。该框架提供的其他功能包括动画支持、文档支持、绘图和打印支持、当前设备的信息、文本管理和显示、搜索支持、可访问性支持、应用程序扩展支持和资源管理。
```
1. 用户界面接口、
2. 应用程序对象、
3. 事件控制、
4. 绘图模型、
5. 窗口、视图和用于控制触摸屏、
6. Others Interface。
```

Important：Use UIKit classes only from your app’s main thread or main dispatch queue, unless otherwise indicated.  This restriction particularly applies to classes derived from UIResponder or that involve manipulating your app’s user interface in any way.
// 重要的：除非另有说明，否则只能从应用程序的主线程或主调度队列中使用UIKit类。这个限制特别适用于从UIResponder派生的类或涉及以任何方式操纵应用程序用户界面的类。



![](/i/c973a6f9-19d8-4bd2-89be-44f3dd4a9f35.jpg)

- Cocoa不是一种编程语言，它也不是一个开发工具，它是创建Mac OS X和IOS程序的原生面向对象API，为这两者应用提供了编程环境。Cocoa本身是一个框架的集合，它包含了众多子框架。其中最重要的要数“Foundation”和“UIKit”。前者是框架的基础，和界面无关，其中包含了大量常用的API；后者是基础的UI类库，以后我们在IOS开发中会经常用到。
- 其实所有的Mac OS X和IOS程序都是由大量的对象构成，而这些对象的根对象都是NSObject，NSObject就处在Foundation框架之中，
