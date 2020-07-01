# 项目结构

react-band项目初始目录结构如下所示：

```bash
|-server
|-src
  |-components
    |-common
    |-custom
  |-config
  |-core
  |-index.jsx
|-static
|-template
|-tests
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

## 如何实现可移植？

可移植的关键是解耦。react-band通过组件化和异步加载实现模块的解耦。

### 组件化

一个前端模块，通常会包括业务逻辑，样式和图片，国际化资源等。一般来说，我们习惯于把项目中的业务逻辑、
样式和国际化资源分开存放。比如：业务逻辑放在js文件夹中，样式放在themes文件夹中，国际化资源放在locale
文件夹中。类似这样：

```bash
|-src
  |-js
    |-module1
      |-index.js
    |-module2
      |-index.js
  |-themes
    |-module1
    |-module2
  |-locale
    |-module1
    |-module2
```

这种文件组织方式不利于模块的移植。想象一下，如果我们要把module1移植到新项目中，我们需要分别操作js、themes
和locale目录。如果我们把这些文件按照模块划分，则只需要操作module1目录就可以。react-band对应的目录结构
如下：

```bash
|-src
  |-components
    |-custom
      |-module1
        |-config.js
        |-index.entry.js
        |-themes
        |-i18n
        |-document
        |-__test__
      |-module2
        |-config.js
        |-index.entry.js
        |-themes
        |-i18n
        |-document
        |-__test__
```

### 异步加载

虽然我们按照模块组织文件，提高了模块的内聚性，但是模块与模块间的耦合还存在。比如：module1依赖module2，
那么在module1的index.js文件中，需要直接引用module2，类似这样：

```javascript
// moduel1/index.js
import Module2 from '../module2/index.js'
```

这样的话，在移植module1的时候也要移植module2，同时还要确保module1和module2路径保持一致。react-band通过
异步加载，去除了module间的路径限制。如下所示：

```javascript
// react-band
// src/components/custom/module1/index.entry.js
export default async ({ getComponent }) => {
  const Module2 = await getComponent('module2')

  return class Module1 extends Component {
    render () {
      return <Module2 />
    }
  }
}
```

react-band会搜集每个模块下的config.js文件，维护一个当前项目的模块列表。各模块通过getComponent函数，
异步加载其他模块。通过这种方式取消了模块间的路径依赖，并且由于是异步按需加载，也提升了页面的加载速度。

## 如何实现渐进式组件开发？

react-band在components目录下提供common和custom目录。其中，common目录用于存放通用模块，custom目录用于
存放非通用模块。为了方便两个目录中的组件互相移动，且不影响业务逻辑，common和custom目录中的组件名可以
重名。如果出现重名，那么react-band的组件列表中，custom中的组件会覆盖common中的同名组件。

### 组件提升

如果一个组件通过多次迭代后，觉得可以作为通用组件，那么直接把该组件移动到common中即可。

### 组件定制

如果觉得某个通用组件不满足业务需求，需要定制。那么直接把该组件复制到custom中，再进行定制开发。

## 如何实现异步加载？

一个模块通常包括js代码、样式和国际化资源。react-band通过webpack的dynamic import实现这三类文件的代码
分割，并利用React.lazy实现异步加载。