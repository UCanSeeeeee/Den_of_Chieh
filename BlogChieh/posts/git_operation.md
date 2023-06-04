---
title: Git 常用
publish_date: 2022-12-25
---

Git!

![](/i/gitfoundation.png)

```
Workspace：工作区
Index / Stage：暂存区
Repository：仓库区（或本地仓库）
Remote：远程仓库
```

### 更新系统git报错:
xcode-select --install

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

### 配置git
```
# 配置全局用户
git config --global user.name "用户名" 
git config --global user.email "git账号"
# 这里只是美化 log 的输出，实际使用时可以在 git lg 后面加命令参数，如： git lg -10 显示最近10条提交
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```

---

### 查看git信息
```
# 查看用户配置
cat ~/.gitconfig  // 'cat'命令用于连接文件并将其打印到终端，'~'表示当前用户的主目录。
# 查看本地 git 命令历史
git reflog // 不会永远保持，Git 会定期清理那些 “用不到的” 对象，不要指望几个月前的提交还一直在那里。
# 查看所有 git 命令
git --help -a
# 列出当前git存储库中已跟踪的文件
git ls-files
# 查看提交历史
$ git log --oneline  
          --grep="关键字"
          --graph 
          --all      
          --author "username"     
          --reverse 
          -num
          -p
          --before=  1  day/1  week/1  "2019-06-06" 
          --after= "2019-06-06"
          --stat 
          --abbrev-commit 
          --pretty=format:"xxx"
          
# oneline -> 将日志记录一行一行的显示
# grep="关键字" -> 查找日志记录中(commit提交时的注释)与关键字有关的记录
# graph -> 记录图形化显示 ！！！    
# all -> 将所有记录都详细的显示出来
# author "username" -> 查找这个作者提交的记录
# reverse -> commit 提交记录顺序翻转      
# before -> 查找规定的时间(如:1天/1周)之前的记录   
# num -> git log -10 显示最近10次提交 ！！！    
# stat -> 显示每次更新的文件修改统计信息，会列出具体文件列表 ！！！
# abbrev-commit -> 仅显示 SHA-1 的前几个字符，而非所有的 40 个字符 ！！！
# pretty=format:"xxx" ->  可以定制要显示的记录格式 ！！！
# p -> 显示每次提交所引入的差异（按 补丁 的格式输出）！！！
```

---

### 符号解释
```
git log --graph 点线图
*	表示一个 commit
|	表示分支前进
/	表示分叉
\	表示合入
|/	表示新分支
```
---
# Git手册

参考资料：

[清华硕士谭新宇](https://github.com/OneSizeFitsQuorum/git-tips)

[Git使用心得](https://juejin.cn/post/6844904191203213326)

[廖雪峰：Python、区块链、Git学习](https://www.liaoxuefeng.com/wiki/896043488029600)

### 常用命令:
```
- git status                   // 查看状态
- git add .                    // 将工作区的文件提交到暂存区
- git commit -m "本次提交说明"   // 将暂存区内容添加到local区的当前分支中
- git commit -am "本次提交说明"  // add和commit的合并，便捷写法（未追踪的文件无法直接提交到暂存区/本地仓库）
- git push -u <远程仓库名> <本地分支名> // 将本地分支和远程分支进行关联
- git push                     // 将本地仓库的文件推送到远程分支
- git pull <远程仓库名> <远程分支名>    // 拉取远程分支的代码
- git diff                     // 查看暂存区与disk区文件的差异。
- git branch                   // 查看本地拥有哪些分支
- git branch -a                // 查看所有分支（包括远程分支和本地分支）
- git branch -D xxx            // 不加-D表示创建新local分支xxx，加-D表示强制删除local分支xxx。
- git checkout branchName      // 切换分支
- git checkout -b xxx          // git checkout xxx是指切换到xxx（用local区的xxx替换disk区文件），-b意味着branch，即创建新分支，这条指令合起来意思是创建并切换到xxx。
- git stash                    // 临时将工作区文件的修改保存至堆栈中
- git stash pop                // 将之前保存至堆栈中的文件取出来
- git reset xxx                // changes -> untracked files
- git log                      // 查看历史日志 - ‘利用好commit’
- git merge branchName         // 合并分支
- git rebase xxx               // 假设当前分支与xxx分支存在共同部分common，该指令用xxx分支包括common在内的整体替换当前分支的common部分（原先xxx分支内容为common->diversityA，当前分支内容为common->diversityB，执行完该指令后当前分支内容为common->diversityA->diversityB）。
```

---

### add

将工作区的文件添加到暂存区
```
git add [file1] [file2] ...           // 添加指定文件到暂存区（追踪新增的指定文件）
git add [dir]                         // 添加指定目录到暂存区，包括子目录
git rm [file1] [file2] ...            // 删除工作区/暂存区的文件
git rm --cached [file]                // 停止追踪指定文件，但该文件会保留在工作区
git mv [file-original] [file-renamed] // 改名工作区/暂存区的文件
git add . == git add -A               // 作用于文件的增删改
gti add -u                            // 只作用于文件的修改和删除
```
---

### status

```
git status      // 查看工作区和暂存区的状态
```
---

### commit

将暂存区的文件提交到本地仓库
```
git commit -m "本次提交的说明"    // 将暂存区的文件提交到本地仓库并添加提交说明
git commit -am "本次提交的说明"   // add 和 commit 的合并，便捷写法，和 git add -u 命令一样，未跟踪的文件是无法提交上去的
git commit --amend              // 编辑器会弹出上一次提交的信息，可以在这里修改提交信息
git commit --amend -m "本次提交的说明"  // 修改提交，同时修改提交信息
```
---

### push&pull

将本地分支的提交推送到远程仓库
```
git push -u <远程仓库名> <本地分支名> // 建立当前分支和远程分支的追踪关系
git push                          // 如果当前分支与远程分支之间存在追踪关系，则可以省略分支和 -u 
git push --all <远程仓库名>         // 不管是否存在对应的远程分支，将本地的所有分支都推送到远程主机
git push <远程主机名> <本地分支名>:<远程分支名> // 将本地仓库的文件推送到远程分支，如果远程仓库没有这个分支，会新建一个同名的远程分支，如果省略远程分支名，则表示两者同名。
git push <远程仓库名> :<远程分支名>           // 如果省略本地分支名，则表示删除指定的远程分支，因为这等同于推送一个空的本地分支到远程分支。等同于 git push origin --delete master。
```

从远程仓库拉取文件到本地
```
git pull                        // 从远程仓库获取最新的提交并合并到本地当前分支
git pull <远程仓库名> <远程分支名> // 拉取远程分支的代码
git fetch <远程仓库名> <远程分支名> && git merge <远程仓库名>/<远程分支名> // 等同于 fetch + merge
```
---

### remote

通常用来管理上游仓库，可以通过git remote -v来查看相关信息，其相关命令如下：
```
git remote add <远程主机名> <url>                // 添加远程仓库关联
git remote remove <远程主机名>                   // 删除远程仓库关联
git remote rename <old远程主机名> <new远程主机名>  // 更名远程仓库关联
git remote show <远程主机名>                     // 显示某个远程仓库的信息
git remote set-url <远程主机名> <new_url>        // 更新远程仓库 url
```

### 创建仓库 && 第一次提交:

```
// cd -> init -> add -> commit -> remote -> push  
cd 根目录  
git init  //建立仓库  
git add . //这个命令会把当前路径下的所有文件添加到待上传的文件列表中。如果想添加某个特定的文件，只需把 . 换成特定的文件名即可  
git commit -m "这里写上提交的注释"  
git remote add <name> <url>
git push -u <name> <branch>  
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

### Git命令大全

![](/i/git速查表.jpg)