---
title: iOS Category
publish_date: 2022-12-27
---

Category

# Category

特性：

```
1.分类只能增加方法，不能增加成员变量。
2.分类方法实现中可以访问原来类中声明的成员变量。
3.分类可以重新实现原来类中的方法，但是会覆盖掉原来的方法，会导致原来的方法没法再使用（实际上并没有真的替换，而是Category的方法被放到了新方法列表的前面，而原来类的方法被放到了新方法列表的后面，这也就是我们平常所说的Category的方法会“覆盖”掉原来类的同名方法，这是因为运行时在查找方法的时候是顺着方法列表的顺序查找的，它只要一找到对应名字的方法，就会罢休，殊不知后面可能还有一样名字的方法）。
4.当分类、原来类、原来类的父类中有相同方法时，方法调用的优先级：分类(最后参与编译的分类优先) –> 原来类  –> 父类，即先去调用分类中的方法，分类中没这个方法再去原来类中找，原来类中没有再去父类中找。
5.Category是在runtime时候加载，而不是在编译的时候。
```

实现category的结构体⬇️

```
struct category_t { 
    const char *name; //分类的name
    classref_t cls; //对应的class
    WrappedPtr<method_list_t, method_list_t::Ptrauth> instanceMethods; //实例方法列表
    WrappedPtr<method_list_t, method_list_t::Ptrauth> classMethods; //类方法列表
    struct protocol_list_t *protocols; // 协议列表
    struct property_list_t *instanceProperties; // 实例属性
    // Fields below this point are not always present on disk.
    struct property_list_t *_classProperties; // 类属性
    ......
    }
```

category注册：在程序启动后，dyld绑定了runtime，当dyld将二进制image载入后会通知runtime的回调进行image的mapping，这时runtime才会将category注册到对应的类中。⬇️

```

load_images(const char *path __unused, const struct mach_header *mh)
{
    if (!didInitialAttachCategories && didCallDyldNotifyRegister) {
        didInitialAttachCategories = true;
        loadAllCategories(); // 注册分类
    }
    ......
}

```

函数体内先申请runtimeLock，之后就遍历header调用load_categories_nolock()函数来加载category。⬇️

```

static void loadAllCategories() {
    mutex_locker_t lock(runtimeLock);
    for (auto *hi = FirstHeader; hi != NULL; hi = hi->getNext()) {
        load_categories_nolock(hi);
    }
}

```

接着看看load_categories_nolock()函数内做了什么。⬇️

```

static void load_categories_nolock(header_info *hi) {
       ......
       // 首先，将category注册到它的目标类。
       // 然后，如果类已经实现，则重新构建类的方法列表(等等)。
       if (cat->instanceMethods ||  cat->protocols
           ||  cat->instanceProperties)
       {
           if (cls->isRealized()) {
               attachCategories(cls, &lc, 1, ATTACH_EXISTING);
           } else {
               objc::unattachedCategories.addForClass(lc, cls);
           }
       }
       ......
}

```

接着看attachCategories()函数，看runtime是怎样将category中添加的函数添加到Class中的。⬇️

```

static void attachCategories(Class cls, const locstamped_category_t *cats_list, uint32_t cats_count, int flags) {
    ......
    constexpr uint32_t ATTACH_BUFSIZ = 64;     //只有少数职业在启动时拥有64个以上的类别。This uses a little stack, and avoids malloc.
    method_list_t   *mlists[ATTACH_BUFSIZ];      //声明
    uint32_t mcount = 0;
    
    bool fromBundle = NO;
    bool isMeta = (flags & ATTACH_METACLASS);
    auto rwe = cls->data()->extAllocIfNeeded();

    for (uint32_t i = 0; i < cats_count; i++) {
        auto& entry = cats_list[i];
        method_list_t *mlist = entry.cat->methodsForMeta(isMeta);
        if (mlist) {
            if (mcount == ATTACH_BUFSIZ) {
                prepareMethodLists(cls, mlists, mcount, NO, fromBundle, __func__);
                rwe->methods.attachLists(mlists, mcount); // 在这里进行连接列表
                mcount = 0;
            }
            mlists[ATTACH_BUFSIZ - ++mcount] = mlist;
            fromBundle |= entry.hi->isBundle();
        }
    }
     ......
}
```

将method注册到类中的关键函数就是attachLists()⬇️

```

    void attachLists(List* const * addedLists, uint32_t addedCount) {
        if (addedCount == 0) return;
        if (hasArray()) {
            // many lists -> many lists
            uint32_t oldCount = array()->count; // class.method.list.count
            uint32_t newCount = oldCount + addedCount; // class.method.list.count + category.method.list,count
            array_t *newArray = (array_t *)malloc(array_t::byteSize(newCount)); // 开辟空间
            newArray->count = newCount;  // tempClass.method.list.count
            array()->count = newCount; //  class.method.list 扩容等待...

            for (int i = oldCount - 1; i >= 0; i--)
                newArray->lists[i + addedCount] = array()->lists[i]; // 将class.methon.list拷贝到tempClass.method.list尾部
            for (unsigned i = 0; i < addedCount; i++)
                newArray->lists[i] = addedLists[i]; // 将category.method.list拷贝tempClass.method.list首部
            free(array()); // 释放class.method.list
            setArray(newArray); // class.method.list = tempClass.method.list
            validate();  // 验证生效！
        }
    }
    
```

总结：

category为开发者提供了在runtime时向Class中添加协议、方法、属性的能力，但`由于它是在运行时注册的，所以添加的属性无法直接使用`，需要使用关联对象和自行实现setter、getter方法。同时，多个categories在注册时的顺序跟编译顺序息息相关，在最终后添加的方法在method list中会在先添加的方法前面，所以`后编译的category中的同名方法有更高的优先级，会被调用。`