---
title: 面向对象
publish_date: 2022-11-01
---

面向对象的三大特征：封装、继承、多态

面向过程：程序 = 算法 + 数据结构

面向对象：程序 = 对象 + 交互

## 封装
封装数据的主要原因是“保护隐私”；封装方法的主要原因是“隔离复杂度”。

```
顾客付钱给收银员的例子:
public class Person {  
  
    private String _name;    //姓名  
    private Integer _money;  //金钱  
      
    public String getName() {  
        return _name;  
    }  
  
    public Boolean pay(Integer money){  
        //付款的逻辑由Person自己控制，例如判断当前的钱是否够支付  
        if( money > _money ){  
            return false;  
        }  
          
        _money -= money;  
        return true;  
    }  
} 

public class Cashier {  
  
    public Boolean get(Person person, Integer money){  
        Boolean result = person.pay(money);  //收银员只需要调用Person的pay方法，无需知道Person当前有多少钱  
        if( result ){  
            System.out.println(person.getName() + " 付款成功，共  " + money +" 块");  
        }  
        else{  
            System.out.println(person.getName() + " 付款失败");  
        }  
          
        return result;  
    }  
} 
```

## 继承
一般我们理解“继承”，都是理解为继承产业、继承财产，例如李泽钜继承李嘉诚的事业。但在面向对象的领域里面，并不是“子类”继承了“父类”的产业，而是继承了“父类”的特点，具体来说就是继承了“属性和方法”。
![](/i/4de5191b-9756-4cf2-a8ce-90a39ccaefa6.jpg)

## 多态
多态不是指“多种形态”，可以理解为“多胎”。其真正含义是：使用指向父类的指针或者引用，能够调用子类的对象。

```
public abstract class Animal {
    abstract String talk();
}

public class Dog extends Animal {
    public Dog() {
    }
    @Override
    String talk() {   
        return "Dog......wang wang";
    }
}

public class Test1 {
    //@param a Animal  这个参数就是“多态”的具体表现形式
    public static void write(Animal a) {
        //在调用a.talk()的时候, 函数并不知道a究竟是Pig，Dog，还是Cat，只知道是一个Animal
        System.out.println(a.talk()); 
    }
    public static void main(String[] args) {
        //在调用write函数的时候，可以传入Cat/Dog/Pig对象，并且输出也不一样
        write(new Cat()); //传入Cat，输出"Cat......miao miao"
        write(new Dog()); //传入Dog，输出"Dog......wang wang"
        write(new Pig()); //传入Pig，输出"Pig......ao ao"
    }
}
```