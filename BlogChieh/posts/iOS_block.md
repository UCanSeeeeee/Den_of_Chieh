---
title: iOS block
publish_date: 2022-12-27
---

# block应用

// 结合他人博客和社区文章

## block类型：
```
1.__NSGlobalBlock__：全局block，block内部不引用变量或只引用了全局变量或静态变量
2.__NSStackBlock__：栈区block，实际上该类block已经很少见了。block在编译时都会被指向成栈区block，但如果没有捕获__block修饰的变量，在运行后栈区block基本都被转换成了全局block。目前在Xcode12的测试环境中，只有在例如NSlog函数中直接定义一个匿名的block作为参数，这种情况的block才是栈区block。
3.__NSMallocBlock__：堆区block，在block中引用了局部变量或被__block修饰的变量，或者对block调用了block_copy，此时block会被拷贝到堆上，成为堆区block
```

| Block类型                | 条件                        | 存储域 | 执行Copy后效果            |
| ------------------------ | --------------------------- | ------ | ------------------------- |
| NSGlobalBlock（全局Block）  | Block内部没有引用其他外部变量 | 数据区 | 无任何变化                |
| NSStackBlock（栈Block）    | Block内部访问了auto变量      | 栈区   | 从栈复制到堆              |
| NSMallocBlock（堆Block）   | NSStackBlock调用了copy       | 堆区   | 引用计数加1               |

## block循环引用

```
正常释放：是指A持有B的引用，当A调用dealloc方法，给B发送release信号，B收到release信号，如果此时B的retainCount（即引用计数）为0时，则调用B的dealloc方法。
循环引用：A、B相互持有，所以导致A无法调用dealloc方法给B发送release信号，而B也无法接收到release信号。所以A、B此时都无法释放。
```
![](/i/6ab5e1b9-6dcf-4c3c-8076-488163c959b4.jpg)

```
请问下面两段代码有循环引用吗？
//代码一 
NSString *name = @"CJL";
self.block = ^(void){
    NSLog(@"%@",self.name);
};
self.block();

//代码二
UIView animateWithDuration:1 animations:^{
    NSLog(@"%@",self.name);
};

答：
代码一中发生了循环引用，因为在block内部使用了外部变量name，导致block持有了self，而self原本是持有block的，所以导致了self和block的相互持有。
代码二中无循环引用，虽然也使用了外部变量，但是self并没有持有animation的block，仅仅只有animation持有self，不构成相互持有

```

## 解决循环引用（四种方法）

```
typedef void(^CJLBlock)(void);
@property(nonatomic, copy) CJLBlock cjlBlock;
```

```
方式一：weak-stong-dance
1.如果block内部并未嵌套block，直接使用__weak修饰self即可。此时的weakSelf和self指向同一片内存空间，且使用__weak不会导致self的引用计数发生变化。

__weak typeof(self) weakSelf = self;
self.cjlBlock = ^(void){
     NSLog(@"%@",weakSelf.name);
}

2.如果block内部嵌套block，需要同时使用__weak 和 __strong。其中strongSelf是一个临时变量，在cjlBlock的作用域内，即内部block执行完就释放strongSelf这种方式属于打破self对block的强引用，依赖于中介者模式，属于自动置为nil，即自动释放。

__weak typeof(self) weakSelf = self;
self.cjlBlock = ^(void){
    __strong typeof(weakSelf) strongSelf = weakSelf;
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        NSLog(@"%@",strongSelf.name);
    });
};
self.cjlBlock();
```

```
方式二：__block修饰变量
这种方式同样依赖于中介者模式，属于手动释放，是通过__block修饰对象，主要是因为__block修饰的对象是可以改变的。需要注意的是这里的block必须调用，如果不调用block，vc就不会置空，那么依旧是循环引用，self和block都不会被释放。

__block ViewController *vc = self;
self.cjlBlock = ^(void){
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        NSLog(@"%@",vc.name);
        vc = nil;//手动释放
    });
};
self.cjlBlock();
```

```
方式三：对象self作为参数
将对象self作为参数，提供给block内部使用，不会有引用计数问题

self.cjlBlock = ^(ViewController *vc){
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        NSLog(@"%@",vc.name);
    });
};
self.cjlBlock(self);
```

```
方式四：使用NSProxy
```

## 总结

`循环引用的解决方式从根本上来说就两种，以self -> block -> self为例`

1.打破self 对 block的强引用，可以block属性修饰符使用weak，但是这样会导致block还每创建完就释放了，所以从这里打破强引用行不通

2.打破block对self的强引用，主要就是self的作用域和block作用域的通讯，通讯有代理、传值、通知、传参等几种方式，用于解决循环，常见的解决方式如上述。

# block底层分析

```
int main(int argc, char * argv[]) {
    __block int a = 100;
    void(^blockTest)(void) = ^{
        NSLog(@"Chieh: %d",a);
    };
    blockTest();
}
```

通过`xcrun -sdk iphoneos clang -arch arm64 -rewrite-objc main.m -o mainBlock.cpp`将代码转换为底层c++实现的代码

```
int main(int argc, char * argv[]) {
    int a = 100;
    void(*blockTest)(void) = ((void (*)())&__main_block_impl_0((void *)__main_block_func_0, &__main_block_desc_0_DATA, (__Block_byref_a_0 *)&a, 570425344));
    // 相当于block等于__main_block_impl_0，是一个函数。查看__main_block_impl_0，是一个结构体，同时可以说明block是一个__main_block_impl_0类型的对象，这也是为什么block能够%@打印的原因。
    ((void (*)(__block_impl *))((__block_impl *)blockTest)->FuncPtr)((__block_impl *)blockTest);
}

struct __main_block_impl_0 {
  struct __block_impl impl;
  struct __main_block_desc_0* Desc;
  int a; //编译时就自动生成了相应的变量
  __main_block_impl_0(void *fp, struct __main_block_desc_0 *desc, __Block_byref_a_0 *_a, int flags=0) : a(_a->__forwarding) {
    impl.isa = &_NSConcreteStackBlock; // block的isa默认是stackBlock
    impl.Flags = flags;
    impl.FuncPtr = fp;
    Desc = desc;
  }
};

//block的结构
struct __block_impl {
  void *isa; // block在内存中的存放位置，即区别栈/堆/全局block
  int Flags; // 标示位，在初始化时被默认置为0
  int Reserved; // 留存位，留待备用
  void *FuncPtr; // 函数指针，在初始化时block要执行的代码块的指针被赋予FuncPtr
};

//block的信息
static struct __main_block_desc_0 {
  size_t reserved; // 待用值
  size_t Block_size; // block的大小
} __main_block_desc_0_DATA = { 0, sizeof(struct __main_block_impl_0)};

static void __main_block_func_0(struct __main_block_impl_0 *__cself) {
  int a = __cself->a; // bound by copy 值拷贝，即 a = 100，此时的a与传入的__cself的a并不是同一个
  NSLog((NSString *)&__NSConstantStringImpl__var_folders_8x_c_h1616j0gb82hh0m858b5gr0000gn_T_main_301f65_mi_0,a);
}
```

## 总结

`block的本质是对象、函数、结构体，由于block函数没有名称，也被称为匿名函数`

问题：

1.block为什么需要调用？
```
在底层block的类型__main_block_impl_0结构体，通过其同名构造函数创建，第一个传入的block的内部实现代码块，即__main_block_func_0，用fp表示，然后赋值给impl的FuncPtr属性，然后在main中进行了调用，这也是block为什么需要调用的原因。
```

2.block是如何获取外界变量的？
```
block捕获外界变量时，在内部会自动生成同一个属性来保存。
```

3.__block的原理：外界变量会生成__Block_byref_a_0结构体，用来保存原始变量的指针和值。将变量生成的结构体对象的指针地址 传递给block，然后在block内部就可以对外界变量进行操作了。
```
// oc代码
int main(int argc, char * argv[]) {
    __block int a = 100;
    void(^blockTest)(void) = ^{
        a++;
        NSLog(@"Chieh: %d",a);
    };
    blockTest();
}
// 转源码⬇️
int main(int argc, char * argv[]) {
   // __Block_byref_a_0 是结构体，a 等于 结构体的赋值，即将外界变量a 封装成对象。
   // forwording指向自己
__attribute__((__blocks__(byref))) __Block_byref_a_0 a = {(void*)0,(__Block_byref_a_0 *)&a, 0, sizeof(__Block_byref_a_0), 100};
   //__main_block_impl_0中的第三个参数&a，是封装的对象a的地址，并不是我们在代码中定义的a变量，而是已经被封装成了__Block_byref_a_0类型的a，所以在这里传入的是该结构体的地址。
    void(*blockTest)(void) = ((void (*)())&__main_block_impl_0((void *)__main_block_func_0, &__main_block_desc_0_DATA, (__Block_byref_a_0 *)&a, 570425344));
    ((void (*)(__block_impl *))((__block_impl *)blockTest)->FuncPtr)((__block_impl *)blockTest);
}

//__block修饰的外界变量的结构体
struct __Block_byref_a_0 {
 void *__isa; // 该值在初始化时被置为0的指针
// 在初始化时，被__block修饰的变量的地址被强转成__Block_byref_a_0,赋给了__forwarding,通过在此处by ref的注释我们知道，block在捕获该变量时是通过捕获地址的方式，所以才可以在block内部修改它的内容。
__Block_byref_a_0 *__forwarding; 
 int __flags; // 标示位
 int __size; // 占用大小
 int a; // 存放被修饰的变量的真实的值
};

static void __main_block_func_0(struct __main_block_impl_0 *__cself) {
  __Block_byref_a_0 *a = __cself->a; // bound by ref 。指针拷贝，此时的对象a 与 __cself对象的a 指向同一片地址空间
        // 等同于 外界的 a++
        (a->__forwarding->a)++;
        NSLog((NSString *)&__NSConstantStringImpl__var_folders_8x_c_h1616j0gb82hh0m858b5gr0000gn_T_main_d52a25_mi_0,(a->__forwarding->a));
 }
    
struct __main_block_impl_0 {
  struct __block_impl impl;
  struct __main_block_desc_0* Desc;
  __Block_byref_a_0 *a; // by ref
  __main_block_impl_0(void *fp, struct __main_block_desc_0 *desc, __Block_byref_a_0 *_a, int flags=0) : a(_a->__forwarding) {
    impl.isa = &_NSConcreteStackBlock;
    impl.Flags = flags;
    impl.FuncPtr = fp;
    Desc = desc;
  }
};

struct __block_impl {
  void *isa;
  int Flags;
  int Reserved;
  void *FuncPtr;
};

static struct __main_block_desc_0 {
  size_t reserved;
  size_t Block_size;
  // 下面两个函数与堆block的内存管理有关
  void (*copy)(struct __main_block_impl_0*, struct __main_block_impl_0*);
  void (*dispose)(struct __main_block_impl_0*);
}
static void __main_block_copy_0(struct __main_block_impl_0*dst, struct __main_block_impl_0*src) {
    _Block_object_assign((void*)&dst->a, (void*)src->a, 8/*BLOCK_FIELD_IS_BYREF*/);
}

static void __main_block_dispose_0(struct __main_block_impl_0*src) {
    _Block_object_dispose((void*)src->a, 8/*BLOCK_FIELD_IS_BYREF*/);
}

__main_block_desc_0_DATA = { 0, sizeof(struct __main_block_impl_0), __main_block_copy_0, __main_block_dispose_0};

```
