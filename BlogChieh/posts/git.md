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

#### tag // 版本控制,相当于commit id

```
(1)  
git tag 2.0.0 -m ''  
(2)  
git log  
git checkout xxx // commit id  
git tag 2.0.0 -m ''  
```

---

### 解决冲突  // 结果是两次commit.  

```
// git push 未成功后  
git pull // 提示出现冲突  
解冲突  
git add .  
git commit -m ''  
git push  
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
