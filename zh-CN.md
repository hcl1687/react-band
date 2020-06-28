# 动机

我们在开发一个新项目的时候，基本上都是通过裁剪别人的项目代码，在这基础上进行开发。这样可以复用已有成熟
的代码，有利于项目快速成型，降低开发风险。在将别人项目的代码移植到自己的项目中，甚至在将自己上一个项目
的代码移植到新项目中的时候，我发现移植过程很痛苦。项目中各模块互相依赖，错综复杂，通常需要详细阅读源码
后，才能决定那些代码要保留，哪些代码要删除。因此，我希望有一个很简单的方式移植项目代码。

我们总是强调要抽象出通用组件，以便复用。但在实际开发的时候，抽象是一个渐进的，迭代的过程。这是由于我们
的业务需求也是不断迭代的，导致对组件的抽象也不可能一步到位。因此，我希望能够区分通用组件和非通用组件，
并且能够较为方便的把非通用组件转为通用组件。同时也要允许把通用组件转为非通用组件，用于满足定制化需求。

随着项目的不断迭代，业务代码越来越多，打包后的js文件也越来越大，导致页面加载慢等问题。因此，我希望能够
有一个统一的异步加载方案，实现模块代码、样式文件、国际化资源按需加载，提升页面的加载速度。

# 核心概念

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