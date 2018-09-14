# hekr-cli

> 为氦氪前端们开发的命令行工具

## 安装

要求 [Node.js](https://nodejs.org/) 7.6 以上版本，以及 [Git](https://git-scm.com/)。

``` bash
# 更改 npm 源
$ npm config set registry http://npm.hekr.me

# 全局安装
$ npm install --global @hekr/hekr-cli
```

## 环境切换

所有子命令都支持切换到测试环境，使用示例如下

```bash
$ hekr [cmd] -t
# 或者
$ hekr [cmd] --test
```

## 使用

运行使用帮助来查看所有命令。

``` bash
$ hekr --help

Usage: hekr [command] [option]

For web developers of Hekr

Options:

  -h, --help     output usage information
  -V, --version  output the version number

Commands:

  run|r        run hekr
  init|i       generate project
  key|k        get console key
  page|p       manage H5 pages
  user|u       manage users
  virtual|v    run virtual device
  refresh|re   refresh access token
  upload|up    upload new page
  help [cmd]   display help for [cmd]
```

## 功能

### hekr/hekr run

直接运行程序，以交互式的方式在菜单中进行操作。

另外，主菜单中每个选项都有对应的 Git 风格的子命令。

``` bash
$ hekr
# or
$ hekr run

? Select next step: (Use arrow keys)
  ──────────────
> Generate project
  Get console keys
  Manage H5 pages
  Get protocol template
  Manage accounts
  Run virtual device
  ──────────────
  Exit
```

当项目中已有 `keys.json`，`hekr-cli` 会读取其中的信息，主菜单中可能会有额外选项。

``` bash
  Account: ting.shen@hekr.me 测试
  Product: ting.shen@hekr.me

? Select next step: (Use arrow keys)
  ──────────────
> Generate project
  Get console keys
  Manage H5 pages
  Get protocol template
  Manage accounts
  Run virtual device
  ──────────────
  Refresh access token
  Upload new page
  ──────────────
  Exit
```

### hekr init

即主菜单中的 `Generate project`，从项目模板中生成一个新项目。

``` bash
$ hekr init --help

Usage: hekr-init [template-name] [project-name]

Generate project

Options:

  -t, --test     set env for testing
  -h, --help     output usage information
  -o, --offline  use cached template
```

#### 模板选择

支持的模板有：

1. 官方模板([Vue](http://gitlab.hekr.me/front-end/hekr-vue-template), [React](http://gitlab.hekr.me/front-end/hekr-react-template), [HTML](http://gitlab.hekr.me/front-end/hekr-html-template))
2. 氦氪 gitlab 模板
3. github 模板
4. 本地模板

``` bash
# 直接运行，以交互式的方式从选项中挑选模板
$ hekr init

# 官方模板
$ hekr init vue hello-hekr
$ hekr init react hello-hekr

# 氦氪 gitlab 模板，可选择分支
$ hekr init username/repo#branch hello-hekr

# github 模板, 可选择分支
$ hekr init github:username/repo hello-hekr

# 本地模板
$ hekr init ./path/to/local-template my-projec
```

#### 自定义模板

项目模板可自定义，存放在氦氪 gitlab、github 和本地中。

* 模板引擎**必须**使用 [Handlebars](http://handlebarsjs.com/)
* 项目文件**必须**放在 `template` 文件夹中

模板也可自定义抉择条件，最终根据不同的条件成生成不同配置的项目。

* 抉择条件**必须**放在 `meta.json` 或 `meta.js` 文件中，且有以下属性：

  * prompts: 用于记录用户的抉择，详见 [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)
  * filters: 用于过滤用户抉择后的文件

``` js
// meta.json
{
  "prompts": {
    "name": {
      "type": "input",
      "message": "Project name:"
    },

    "lint": {
      "type": "confirm",
      "message": "Use ESLint to lint code?"
    }
  },

  "filters": {
    ".+(eslintrc)": "data.lint"
  }
}

```

``` bash
# 项目模板结构参考
App
├── template
│   ├── src
│   │   └── main.js
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── webpack.config.js
├── meta.json
├── package.json
└── README.md
```

#### 离线模式

对于同一模板，首次下载后会缓存在 `~/.hekr`，之后运行命令时如果有 `offline` 参数，会从本地缓存中读取模板，节约下载时间。

``` bash
$ hekr init vue hello-hekr --offline
```

### hekr key

即主菜单中的 `Get console keys`，获取一体化项目开发时所需的调试参数。

``` bash
$ hekr key

? Select next step: Choose account
? Account index: 1

      Device

  1.  透传测试用例 virtual device
  2.  主控测试用例 virtual device

? Select next step: Choose device
? Device index: 1

{
  "account": "...",
  "query": "...",
  "accessToken": "..."
}

? Generate keys.json in current directory? (y/N)
```

运行后，依次选择 `用户-设备-(子设备)`，最后可选择是否在当前目录下生成 `keys.json`， 用于存储设备信息。

生成 `keys.json` 后，可与项目中的 `webpack` 配合，提高开发效率，详见 [前端一体化开发建议](http://gitlab.hekr.me/HEKR-Cloud/HEKR-INTERNAL-DOCUMENTS/blob/master/UED/%E5%89%8D%E7%AB%AF%E4%B8%80%E4%BD%93%E5%8C%96%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E5%BB%BA%E8%AE%AE.md)。

此外，`hekr-cli` 运行时会尝试读取项目中 `keys.json` 的参数，从而省略程序的某些重复操作。

``` js
// keys.json
{
  "account": {
    "username": "...",
    "password": "...",
    "description": "..."
  },
  "query": {
    "devTid": "...",
    "ctrlKey": "...",
    "ppk": "..."
  },
  "accessToken": "..."
}
```

### hekr page

即主菜单中的 `Manage H5 pages`, 管理设备产品下的 H5 页面。

``` bash
$ hekr page

? Select next step: Choose account
? Account index: 1

      Product       Category

  1.  透传测试用例  家居家装/开发板
  2.  主控测试用例  家居家装/开发板

? Select next step: Choose product
? Product index: 1

      Filename  Date

  1.  test.zip  2017-04-25 11:30:05
  2.  test.zip  2017-04-24 14:06:06

? Select next step: (Use arrow keys)
  ──────────────
> Upload new page
  Upgrade priority
  Remove page
  Download page
  ──────────────
  Main menu
  ──────────────
  Exit
```

运行后，依次选择 `用户-产品-(子产品)`，最后可选择是否在当前目录下生成 `keys.json`，用于存储产品信息（注意，产品账户和设备账户可能是不同的）。

之后，会显示云端已有的页面和时间信息，之后可对所有页面进行上传、提升优先级、删除、下载的操作，与 [console](https://console.hekr.me/) 平台中一致。

#### 页面上传

选择 `Upload new page` 后，会搜索项目根目录和 `dist` 下的 `zip` 文件。

``` bash
? Select next step: Upload new page

      Filename  Path

  1.  test.zip  ./
  2.  test.zip  ./dist

? Select next step: (Use arrow keys)
  ──────────────
> Choose zip file
  ──────────────
  Back
  Main menu
  ──────────────
  Exit
```

### hekr protocol

即主菜单中的 `Get protocol template`，获取设备产品的协议模板。

操作与 `hekr page` 相同，最后可选择是否在当前目录下生成 `protocol.json`， 用于存储协议模板。

生成的 `protocol.json` 用于开发具有局域网功能的一体化项目，SDK 在局域网下利用该文件编解码，而非实时从云端获取。

### hekr user

即主菜单中的 `Manage accounts`，管理多个不同项目的账户。

``` bash
$ hekr uesr

    Username              Password  Description  PID

1.  ting.shen@hekr.me     ********  测试
2.  hekr.product@hekr.me  ********  公版
3.  feedback@hekr.me      ********  云知屋
4.  18767123590           ********  云知屋设备   01015362077
    --------------
5.  example@gmail.com     ********  一体化项目   00000000000

? Select next step: (Use arrow keys)
  ──────────────
> Change account
  Add account
  Delete account
  Show password
  ──────────────
  Main menu
  ──────────────
  Exit
```

运行后，会显示两个部分的账户，分别是：

* 测试与公用账户: 预设账户，无法删除或更改
* 自定义账户: 可进行增删改查的操作，适用于各类一体化项目

### hekr refresh

即主菜单中的 `Refresh access token`，刷新 `keys.json` 中的 `accessToken`。

此命令只是一个快捷方式，因此请先确保 `keys.json` 中有 `account`，否则会提示错误。

``` bash
$ hekr refresh

{
  "account": "...",
  "query": "...",
  "accessToken": "..."
}

# 错误提示
Warning: No account in keys.json
```

### hekr upload

即主菜单中的 `Upload new page`，直接上传项目 `dist` 目录下的第一个 `zip` 文件。

此命令只是一个快捷方式，因此请先确保 `keys.json` 中有 `productAccount`，否则会提示错误。

``` bash
$ hekr upload

      Filename  Date

  1.  test.zip  2017-04-25 11:30:05
  2.  test.zip  2017-04-24 14:06:06

# 错误提示
Warning: No product in keys.json
```

#### hekr upload --all

在命令中加入 `--all` 参数，表示对多个项目进行批量处理。

``` bash
$ hekr upload --help

Usage: hekr-upload

Upload H5 page or map command

Options:

  -t, --test           set env for testing
  -h, --help           output usage information
  -a, --all [prefix]   upload all H5 pages with prefix, default "cloud-house"
  -m, --map <command>  run command before uploading

Examples:

  # quick start
  $ hekr upload

  # upload all projects of Cloud House
  $ hekr upload -a cloud-house

  # run command in each project
  $ hekr upload -am "yarn install"
```

例如，运行 `hekr up -a` 后，会检测 `hekr-cli` 当前运行目录下，名称中包含 `cloud-house` 的项目，进行批量上传。

或者，运行 `hekr up -am "yarn upgrade"`，后，会对相应文件夹进行批量的更新依赖包的处理，但**不会**进项批量上传。

### hekr virtual

即主菜单中的 `Run virtual device`，启动一个虚拟设备。

``` bash
$ hekr virtual

Usage: hekr-virtual

Run virtual device

Options:

  -t, --test          set env for testing
  -d, --debug         Virtual device for test(debug option is true)
  -h, --help          output usage information
```

具有以下功能:

1. 支持接收到下发帧时，根据协议自动返回对应的上报帧
2. 支持预约任务，包括自动接收、主动触发等
3. 支持 `JSON透传协议不校验raw` 协议的设备
4. 支持网关及子设备，但目前多人开发同一网关下的不同子设备时，存在冲突，待解决
5. 当虚拟设备为`test`结尾的设备是，要加上参数`--debug`

``` bash
# 直接运行
$ hekr virtual

# 模拟真实设备，所有上报帧会延迟相应时间后发送
$ hekr virtual -d 1000

# 运行名称包含test的设备
$ hekr virtual -b
```
