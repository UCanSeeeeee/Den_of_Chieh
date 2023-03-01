---
title: iOS NSObject
publish_date: 2022-12-27
---


# NSObject

一、🌟 Objective-C 语言历史

![](/i/d591a03c-5d14-4e34-aa1f-dfdd5cfb9308.jpg)

OC代码

```
int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSObject *obj = [[NSObject alloc] init];
    }
    return NSApplicationMain(argc, argv);
}
```

使用clang将上述oc代码编译成c++代码，这就是NSObject的底层实现，它就是一个结构体，这个结构体里只有一个类型为Class的成员变量isa。⬇️

```
struct NSObject_IMPL {
         Class isa; 
} // 这就是NSObject的底层实现，它就是一个结构体，这个结构体里只有一个类型为Class的成员变量isa。
```

Class是什么呢？点进去看它的内部，是一个指针。⬇️

```
typedef struct objc_class *Class; //即实际占用了一个指针大小，为8个字节。但分配了16个字节。原因如下代码块：
```

至于为什么是分配了16字节，可以去看alloc流程的源码在申请内存的过程中进行了十六字节对齐。ide默认8字节对齐（对象申请的内存空间），而系统开辟内存空间是以16字节对齐方式。对于一个对象来说，其真正的对齐方式 是 8字节对齐，8字节对齐已经足够满足对象的需求了，apple系统为了防止一切的容错，采用的是16字节对齐的内存，主要是因为采用8字节对齐时，两个对象的内存会紧挨着，显得比较紧凑，而16字节比较宽松，利于苹果以后的扩展。⬇️

```
    size_t instanceSize(size_t extraBytes) {
        size_t size = alignedInstanceSize() + extraBytes;
        // CF requires all objects be at least 16 bytes.
        if (size < 16) size = 16;
        return size;
    }
```

刚刚看到NSObject的底层实现是个结构体，且只有一个类型为Class的成员变量isa，又看到Class是一个指针，指向结构体objc_class，所以去寻找一下结构体objc_class就能完整了解到NSObject的本质了。⬇️

```
struct objc_class : objc_object {
    Class superclass; // 父类
    const char *name; // 类名
    uint32_t version; // 类的版本信息，默认为0
    uint32_t info; // 类信息，供运行期使用的一些位标识
    uint32_t instance_size; // 该类的实例变量大小
    struct old_ivar_list *ivars; // 该类的成员变量链表
    struct old_method_list **methodLists;  // 方法定义的链表
    Cache cache; // 方法缓存
    struct old_protocol_list *protocols; // 协议链表
    // CLS_EXT only 
    const uint8_t *ivar_layout; //记录了哪些是 strong 的 ivar
    struct old_class_ext *ext;
    ......
}
```

⚠️注意：NSObject 类是由 C 语言实现的，但它不是由结构体实现的。它(objc_class)包含了一些 C 语言的数据结构和函数，用来实现 NSObject 类的功能。NSObject 类的实例是存储在堆上的。
