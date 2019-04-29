# 维消宝 Docker 部署

> 前端项目的 Docker 化

[[toc]]

## 起步

::: tip 初衷
快速部署前端项目，当进行打包后，可以及时更改 API 配置，部署到不同的 IP 或者域名下
:::

## 安装 docker

- [x] 官网：[https://hub.docker.com/](https://hub.docker.com/)
- [x] 安装地址：[https://yeasy.gitbooks.io/docker_practice/install/](https://yeasy.gitbooks.io/docker_practice/install/)

## 前端打包

> 目前为止已有的打包命令
> ::: warning 注意
> 但需要部署 docker 时，需要运行命令[[npm run build:config]]
> :::

- [x] 打包到测试环境

```bash
npm run build
```

- [x] 打包到杭州环境

```bash
npm run build:hz
```

- [x] 打包到正式环境

```bash
npm run build:prod
```

- [x] 打包到 mock 环境

```bash
npm run build:mock
```

- [x] 打包到 config 环境

```bash
npm run build:config
```

## 新建写 dockerfile 配置文件

### 在项目根目录新建 dockerfile

```bash
FROM centos:7
RUN yum makecache && yum update -y && yum install -y zsh git wget htop telnet git zip unzip && sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

RUN wget -q https://hekr-files.oss-cn-shanghai.aliyuncs.com/soft/armor_0.4.12_linux_64-bit.rpm && rpm -ih armor_0.4.12_linux_64-bit.rpm

ENV uaa_URL "https://test-uaa-openapi.hekr.me"
ENV fire_URL "https://test-product-fire-api.hekr.me"
ENV console_URL "https://test-console-openapi.hekr.me"
ENV websocket_URL wss://test-hub.hekr.me
EXPOSE 8080

WORKDIR /app

COPY dist ./
COPY docker-server-run.sh /app/

# 先删除，启动的时候，如果不存在则创建，否则要读取旧的
RUN rm -rf configServer.js

CMD  ["sh","/app/docker-server-run.sh" ]
```

## 部署

将项目移动到部署的系统中（以 linux 为例）,并进入到项目根目录中。

将项目打包成 docker 镜像。镜像名称为 demo,版本号为 1.0

```bash
docker build -t smartmatrix-console-front:0.0.1 .
```

> -t <镜像名称>:<版本号>

创建容器并运行

```bash
docker run -d -p 1012:8080 -e uaa_URL=https://baidu.com --name smartmatrix-console-front smartmatrix-console-front:0.0.1
```
