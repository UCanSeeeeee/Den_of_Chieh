---
title: Git 常用
publish_date: 2022-12-25
---

Git!

### 更新系统git报错:
xcode-select --install

---

### M1 bug Git操作:

```
sudo arch -x86_64 gem install ffi
arch -x86_64 pod install
```

---

### Clash：
```
mixed-port: 7890       （混合代理端口）
socks-port: 7891       （Socks5 代理端口）
port: 7892             （HTTP 代理端口）
```

---

### git设置代理服务器并查看是否设置成功:

```
配置终端代理:
git config  --global http.proxy http://127.0.0.1:xxxx
git config  --global https.proxy http://127.0.0.1:xxxx

查看是否代理成功:
git config --get --global http.proxy

取消代理:
git config --global --unset http.proxy
git config --global --unset https.proxy

验证终端是否走代理:
curl ipinfo.io
```

---

### ClashX设置修改代理端口:

```
mixed-port: 7890             （混合代理端口）
socks-port: 7891              （Socks5 代理端口）
port: 7892                         （HTTP 代理端口）
external-controller: 127.0.0.1:xxxx   （外部控制设置）
allow-lan: false
mode: rule
log-level: warning
```

---

### pod init 模版:

```
platform :ios, '9.0'
target 'XXProject' do
  # Comment the next line if you don't want to use dynamic frameworks
  use_frameworks!
    pod 'SDWebImage'
    pod 'SVGKit', :git => 'https://github.com/SVGKit/SVGKit.git', :branch => '3.x'
    pod 'zhPopupController', '~> 2.0'
  # Pods for BNMemoryCurveProject
end
```
cd 工程目录

pod install

---

# Git手册

参考资料：

[清华硕士谭新宇](https://github.com/OneSizeFitsQuorum/git-tips)

[正确的github工作流](https://www.bilibili.com/video/BV19e4y1q7JJ/?spm_id_from=333.1007.top_right_bar_window_history.content.click&vd_source=64a015eda4e3444c64508773171accf2)

[BBCo](https://www.bilibili.com/video/BV1cS4y1U7uL/?spm_id_from=333.999.0.0&vd_source=64a015eda4e3444c64508773171accf2)

[Git使用心得](https://segmentfault.com/a/1190000023734704)

[廖雪峰：Python、区块链、Git学习](https://www.liaoxuefeng.com/wiki/896043488029600)

### 常用命令:
```
- git checkout -b xxx：git checkout xxx是指切换到xxx（用local区的xxx替换disk区文件），-b意味着branch，即创建新分支，这条指令合起来意思是创建并切换到xxx。
- git diff：查看暂存区与disk区文件的差异。
- git add xxx：将xxx文件添加到暂存区。
- git commit：将暂存区内容添加到local区的当前分支中。
- git push <RemoteHostName> <LocalBranchName>：将local区的LocalBranchName分支推送到RemoteHostName主机的同名分支。（若加-f表示无视本地与远程分支的差异强行push）
- git pull <RemoteHostName> <RemoteBranchName>：同上，不过改成从远程主机下载远程分支并与本地同名分支合并。
- git rebase xxx：假设当前分支与xxx分支存在共同部分common，该指令用xxx分支包括common在内的整体替换当前分支的common部分（原先xxx分支内容为common->diversityA，当前分支内容为common->diversityB，执行完该指令后当前分支内容为common->diversityA->diversityB）。
- git branch -D xxx：不加-D表示创建新local分支xxx，加-D表示强制删除local分支xxx。
- git reset xxx // changes -> untracked files  
- git status // 查看状态  
- git log // 查看历史日志 - ‘利用好commit’  
```

### 创建仓库 && 第一次提交:

```
// cd -> init -> add -> commit -> remote -> push  
cd 根目录  
git init  //建立仓库  
git add . //这个命令会把当前路径下的所有文件添加到待上传的文件列表中。如果想添加某个特定的文件，只需把 . 换成特定的文件名即可  
git commit -m "这里写上提交的注释"  
git remote add origin+你的库链接  
git push -u origin master  
```

---

### 第二次及以后提交:
```
cd 文件  
git add .  
git commit -m ''  
git push   
```

---

### 撤回

```
git reset // 将暂存区的修改移除
git checkout -- . // 将工作区的修改还原到上一次提交的状态，可以将“.”替换为某个文件名

```
---

### 从github拉取仓库: // 本地未init  

```
cd 目录  
git clone xxxxxx // 仓库地址  
```

---

### 从remote拉取仓库: // 本地已init  

```
cd 目录  
// git status  
git pull  
```

---

### 获取历史版本:  

```
git log  
git checkout commit(id)  
// git branch // 检查此时所在分支  
// 若...，则此时获取想要的文件后再回到master即可  
git checkout master  
// 而后操作根据需求进行  
```

---

### 获取误删文件: // master && 未commit  

```
git status  
git restore xxx  
```

---

### 分支  

```
git branch xxx // 分支名字  
...  
git checkout master  
git rebase xxx // 分支名字 merge
```

---

### tag // 版本控制,相当于commit id

```
(1)  
git tag 2.0.0 -m ''  
(2)  
git log  
git checkout xxx // commit id  
git tag 2.0.0 -m ''  
```

---

### 更改仓库名

`git remote set-url origin new_url`

---

---

### 解决冲突  // 结果是两次commit.  

```
// git push 未成功
git pull // 提示出现冲突  
// 解冲突 
git add .  
git commit -m ''  
git push  
```

### 冲突时处理

情况一：git pull时本地分支和远程分支有不同的修改

```
方法一：丢弃本地代码
git reset --hard
git pull
```

```
方法二：先提交修改但不push
git add .
git commit -m "Your commit message"
git pull
// 这个命令会将你的修改添加到暂存区，然后提交一个新的本地提交。接下来，它会尝试将远程分支合并到你的本地分支中。
```

```
方法三：使用git stash
git stash // 将修改存储到一个临时的存储区中
git pull 
git stash pop // 将之前使用git stash命令存储的修改还原回来

/*
git stash list 看本地stash列表
git stash clear 清空stash
*/
```

---

### 未知解决冲突的知识点(先记录一下，用到的时候再重写这一部分)  

```
- 冲突  
git fetch origin main  
git rebase origin main   
- 解决冲突  
git add .  
git rebase --continue  
git push  
```

### git merge 和 git rebase

参考资料：

[JoyoHub博客](https://joyohub.com/2020/04/06/git-rebase/)

[rebase 用法小结](https://www.cnblogs.com/yongdaimi/p/14867227.html)

1.git merge和git rebase都是用于合并两个分支的命令。它们的主要区别在于合并后的提交历史会有所不同：

```
1.git merge会将两个分支的提交历史保留下来，生成一个新的合并提交。优点是不破坏原分支的代码提交记录，缺点就是会产生额外的提交记录并进行两条分支的合并。
2.git rebase会把一个分支上的提交按照时间顺序移动到另一个分支上，并修改为从另一个分支的最新提交开始（合并 commit 记录）。这样，合并后的提交历史会变得更加平滑，但是会丢失一些信息，例如分支的合并时间。合理使用rebase命令可以使我们的提交历史干净、简洁。优点是无须新增提交记录到目标分支，rebase后可以将对象分支的提交历史续上目标分支上，形成线性提交历史记录。（假如我们要启动一个放置了很久的并行工作，现在有时间来继续这件事情，很显然这个分支已经落后了。这时候需要在最新的基准上面开始工作，所以 rebase 是最合适的选择。黄金原则：不能在一个共享的分支上进行git rebase操作。）
```

2.相同分支rebase，不同分支merge：

```
各自的好处取决于你希望达成的目标。如果你希望保留两个分支的完整提交历史，并且需要在合并后清晰地看出两个分支的合并时间，那么git merge是一个更好的选择。如果你希望合并后的提交历史更加平滑，不需要保留太多的信息，那么git rebase会更好。

融合代码到公共分支的时使用`git merge`,而不用`git rebase`，融合代码到个人分支的时候使用`git rebase`，可以不污染分支的提交记录，形成简洁的线性提交历史记录。
```

git merge（merge会形成一个四边形，产生一个新的commit，就是一次新的提交，把develop分支带过来了）

![](/i/663f906e-80b0-437e-bbd3-f0bd70c28bd1.jpg)

git rebase（rebase抛开commit的变化，就相当于develop从没出现过一样，按顺序在master新提交一遍）

![](/i/efabca73-de84-489b-aacb-9c3aa4a7ea5d.jpg)
