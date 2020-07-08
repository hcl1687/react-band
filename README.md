# react-band
A simple react scaffold with webpack, babel, jest, enzyme and puppeteer.

# 项目结构

react-band项目初始目录结构如下所示：

```bash
|-server/
|-src
  |-components
    |-common/
    |-custom/
  |-config/
  |-core/
  |-index.jsx
|-static/
|-template/
|-tests/
```

各目录文件功能如下：

* server: 存放json-server的数据文件，当运行npm run start:mock的时候，将启动json-server并读取该文件。
* src: 存放代码。
   * components: 存放业务代码，分为通用组件和非通用组件。
      * common: 存放通用组件代码。
      * custom: 存放非通用组件代码。
   * config: 存放react-band通用配置信息。
   * core: react-band核心代码，主要负责异步加载components中的组件，并通过React-route创建路由，最终通过React渲染出页面。
   * index.jsx: 项目入口文件，通过创建RBCore.create方法创建RBCore对象，并调用RBCore对象的mount方法渲染页面。
* static: 存放静态资源，构建的时候该目录下的资源文件将会被复制到dist目录下。
* template: 首页模板
* tests: 存放测试相关配置文件，以及e2e测试用例。


# 第一个例子

## 安装react-band-cli

```bash
npm install react-band-cli -g
```

## 初始化

```bash
react-band-cli init test -d basic
```

init test: 在当前目录下创建test目录，并初始化项目。

-d basic指示react-band-cli在初始化项目的时候，预置react-band的basic示例代码。当前，react-band提供如下几种示例代码：

* as: 一个真实的管理后台示例，基于react+react-router+redux+antd，使用json-server模拟服务端数据。
* basic: 一个基本的react+react-router的示例，提供自定义首页和一个test页面，两个页面可以互相跳转。
* basic_menu: 带有左侧菜单栏的react+react-router的示例。
* basic_menu_antd: 带有左侧菜单栏的react+react-router+antd的示例。
* default: 最简单的示例，只提供默认首页和一个test页面。
* redux_menu_antd: 带有左侧菜单栏的react+react-router+redux+antd的示例。

初始化完成后，在src/components/custom目录下会新增一个basic目录。目录结构类似这样：

```bash
|-src
  |-components
    |-custom
      |-basic
        |-home
          |-__test__
            |-__snapshots__
            |-config.test.js
            |-index.test.js
          |-i18n
            |-en.json
            |-zh-CN.json
          |-themes
            |-darkgray
              |-index.css
            |-default
              |-index.css
          |-config.js
          |-index.entry.jsx
        |-test
          |-__test__/
          |-i18n/
          |-themes/
          |-config.js
          |-index.entry.jsx
        |-config.js
```

## 运行

进入项目所在目录，执行如下代码，在开发模式运行项目：

```bash
npm run start
```

如果项目中有用到json-server模拟服务端数据，需要执行如下代码：

```bash
npm run start:mock
```

打开浏览器，访问http://localhost:3000.

## 代码检查

### javascript lint

```bash
npm run lint
```

### css lint

```bash
npm run stylelint
```


## 测试

### 更新snapshot

```bash
npm run test:update
```

### 执行测试用例

```bash
npm run test
```

### 生成覆盖率报告

```bash
npm run test:coverage
```

### 调试测试用例

```bash
npm run test:debug
```

## 构建

```bash
npm run build
```

# 文档

[en](./document/en/tutorial.md)

[zh-CN](./document/zh-CN/tutorial.md)

## License
[MIT](https://opensource.org/licenses/mit-license.php)
