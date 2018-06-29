# NPM源使用

## 一、修改为公司源
公司源主要用途内部发布，上源使用的是淘宝源。

```
#修改源
npm set registry http://npm.hekr.me

#注册用户
#注意，用户名使用公司邮箱前缀，邮件使用公司邮箱!
npm adduser

#登录
npm login

```

## 二、包发布
包名使用scope "@hekr",如下

```
"name": "@hekr/hekr-cli",
"version": "3.6.1",

```

## 四、git分支
分支划分

  + 主分支(master)
  
    稳定版本分支，仅用于项目发布，项目发布之后在此分支上打tag。
    主分支对应包发布后使用"latest"的dist-tag，默认。
    分支保护，不得直接往主分支提交代码，只能从功能分支发起merge request。
    
  + 功能开发(dev\-xxx | bug\-xxx)
  
    做功能开发或bug修复时从`主分支`检出，命名规则 `dev-[功能名称]`， `dev-1.x`。
    功能分支对应包发布后使用"beta"的dist-tag，使用时package.json中如下引用：
    
    ```
    "devDependencies": {
   	    "@hekr/nodetest": "beta",
    }
    ```
    发布命令示例如下：
    
    ```
    npm  publish -tag beta
    ```
    



## 三、其它问题
1，用户密码无法直接重置，如需修改请联系泽洋。    

2，若yarn安装遇到"not allowed"问题，请尝试如下
```shell
npm logout
yarn logout

rm -rf ~/.npmrc
rm -rf ~/.yarnrc

npm set registry http://npm.hekr.me
npm login
yarn login

```