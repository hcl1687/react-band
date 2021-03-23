# 动机

我们在开发一个新项目的时候，基本上都是通过裁剪别人的项目代码，在这基础上进行开发。这样可以复用已有成熟
的代码，有利于项目快速成型，降低开发风险。在将别人项目的代码移植到自己的项目中，甚至在将自己上一个项目
的代码移植到新项目中的时候，我发现移植过程很痛苦。项目中各模块互相依赖，错综复杂，通常需要详细阅读源码
后，才能决定哪些代码要保留，哪些代码要删除。因此，我希望有一个很简单的方式移植项目代码。

我们总是强调要抽象出通用组件，以便复用。但在实际开发的时候，抽象是一个渐进的，迭代的过程。这是由于我们
的业务需求是不断迭代的，导致对组件的抽象也不可能一步到位。因此，我希望能够区分通用组件和非通用组件，
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
  |-modules
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
// src/modules/custom/module1/index.entry.js
export default async ({ getModule }) => {
  const Module2 = await getModule('module2')

  return function Module1 {
    return <Module2 />
  }
}
```

react-band会搜集每个模块下的config.js文件，维护一个当前项目的模块列表。各模块通过getModule函数，
异步加载其他模块。通过这种方式取消了模块间的路径依赖，并且由于是异步按需加载，也提升了页面的加载速度。

## 如何实现渐进式组件开发？

react-band在modules目录下提供common和custom目录。其中，common目录用于存放通用模块，custom目录用于
存放非通用模块。为了方便两个目录中的模块互相移动，且不影响业务逻辑，common和custom目录中的模块名可以
重名。如果出现重名，那么react-band的模块列表中，custom中的模块会覆盖common中的同名模块。

### 组件提升

如果一个模块通过多次迭代后，觉得可以作为通用模块，那么直接把该模块移动到common中即可。

### 组件定制

如果觉得某个通用模块不满足业务需求，需要定制。那么直接把该模块复制到custom中，再进行定制开发。

## 如何实现异步加载？

一个模块通常包括js代码、样式和国际化资源。react-band通过webpack的dynamic import实现代码
分割，并利用React.lazy实现异步加载。

# 项目结构

react-band项目初始目录结构如下所示：

```bash
|-server/
|-src
  |-modules
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
   * modules: 存放业务代码，分为通用模块和非通用模块。
      * common: 存放通用模块代码。
      * custom: 存放非通用模块代码。
   * config: 存放react-band通用配置信息。
   * core: react-band核心代码，主要负责异步加载modules中的模块，并通过React-route创建路由，最终通过React渲染出页面。
   * index.jsx: 项目入口文件，通过创建RBCore.create方法创建RBCore对象，并调用RBCore对象的mount方法渲染页面。
* static: 存放静态资源，构建的时候该目录下的资源文件将会被复制到dist目录下。
* template: 首页模板
* tests: 存放测试相关配置文件，以及e2e测试用例。

# 模块
react-band中的模块是指：一个独立的代码和资源的文件集合，这些文件存放在同一个文件夹中，与其他模块没有显式依赖。所有的业务逻辑都由模块承载和实现。react-band负责收集模块，并按照一定的规则组织和运行模块。react-band通过模块来实现代码移植、渐进式组件开发和异步加载的。

在basic示例中，实现了两个页面：主页和test页。分别点击各页面的按钮可以跳转到另一个页面。在src/modules/custom/basic下有2个模块，分别是home和test。home目录中包含了运行home模块所必须的代码和资源，包括js和css代码，国际化资源等。

```bash
|-src
  |-modules
    |-custom
      |-basic
        |-home
          |-__test__/
          |-i18n/
          |-themes/
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

react-band中的模块，通常包含配置文件（config.js）、入口文件（index.entry.jsx）、主题文件（themes/）、国际化资源文件（i18n/）、单元测试文件（\_\_test\_\_/）等。

## 类型
react-band中的模块有三种类型：组件型、装饰器型和集合型。通过在配置文件中设置type=component|decorator|set来指定模块的类型， 默认是component类型。下面展示的是react-band中i18n模块的配置文件。其中type字段设置为decorator。

> ***约定：装饰器类型的模块，其名字必须以'@'开头***

```javascript
// src/modules/common/+commonSet1/modules/decorators/i18n/config.js
export default () => {
  return {
    name: '@i18n',
    type: 'decorator'
  }
}
```

装饰器模块用于装饰component类型的模块。通过在component类型模块的配置文件中设置decoratorsConfig和decorators字段，来指定需要应用的装饰器。在运行期，react-band负责加载相关模块并组装。

下面展示的是react-band中+commonSet2模块的配置文件。其中type字段设置为set。

> ***约定：集合类型的模块，其文件夹名字必须以'+'开头***

```javascript
// src/modules/common/+commonSet2/config.js
export default (config) => {
  return {
    name: '+commonSet2',
    type: 'set'
  }
}
```

集合模块用于将多个模块合并成一个bundle文件。这样可以灵活的调整bundle文件的大小。react-band会忽略集合模块中所有子模块的index.entry.js文件，不会将其打包成独立的bundle文件。在集合模块的index.entry.js中，需要显式导入集合中各子模块的index.entry.js文件。通过这种方式，react-band将集合中的所有子模块资源都合并到一个bundle文件中。

下面展示的是react-band中+commonSet2模块的index.entry.js文件。

```javascript
// src/modules/common/+commonSet2/index.entry.js
import antd from './modules/antd/components/index.entry'
import antdProviderDeco from './modules/antd/decorators/provider/index.entry'

const entry = () => {
  return {
    antd,
    '@antdProvider': antdProviderDeco
  }
}

export default {
  entry
}
```

## 配置文件（config.js）
每个模块都必须要有一个config.js文件。react-band在构建的时候，会遍历src/modules目录，搜集所有的config.js文件中的配置信息并保存起来。在运行期，react-band通过这些配置信息，动态加载和组装各模块。

> ***config.js文件具有继承性质，react-band在搜集config.js后，会将某个目录下的config.js中的配置信息和该目录的父目录中的配置信息合并，构成最终的配置信息。***

下面展示的是home模块的配置信息。

```javascript
// demo: basic
// src/modules/custom/basic/home/config.js
export default (config) => {
  return {
    name: 'home',
    route: {
      path: '/',
      exact: true
    },
    decorators: ['@i18n', '@theme', '@layout']
  }
}
```

```javascript
// demo: as
// src/modules/custom/as/+customSet2/modules/assignment/config.js
export default (config) => {
  return {
    name: 'assignment',
    route: {
      path: '/assignment'
    },
    // auth: {},
    decoratorsConfig: {
      '@reduxStore': {
        assignmentStore: {
          actions: ['getAssignmentList'],
          state: ['assignments', 'total']
        }
      }
    },
    decorators: ['@i18n', '@theme', '@reduxStore', '@layout']
  }
}
```

配置字段说明：
| field | description | example |
| -              | -                                          | -                 |
| name | 模块名称。必填。react-band通过模块名获取模块。模块名可以重复。如果common和custom目录中有同名的模块，那么custom的模块会覆盖common的同名模块。 | { name: 'home' } |
| lazy | 是否懒加载。选填。默认为true。如果为false, react-band在打开页面时会先同步加载对应的模块。 | { lazy: true } |
| disabled | 模块是否禁用。选填。默认为false。如果为true，react-band不会收集该模块的信息，运行期也不会加载该模块 | { disabled: true } |
| route | 路由信息。选填。react-router的配置信息，用于给模块设置路由。 | { route: { path: 'test' }} |
| decoratorsConfig | 装饰器配置信息。选填。有些装饰器可能需要指定配置信息。装饰器模块的配置文件中，该字段无效。 |  |
| decorators | 装饰器列表。选填。声明该模块需要应用的装饰器。装饰器模块的配置文件中，该字段无效。 |  |

## 入口文件（index.entry.jsx）
每个模块都必须有一个index.entry.jsx或index.entry.js文件。react-band通过该文件实现代码按模块分割。

```javascript
// demo: basic
// src/modules/custom/basic/home/index.entry.jsx
import PropTypes from 'prop-types'
import React from 'react'
import darkgray from './themes/darkgray/index.css'
import defaultTheme from './themes/default/index.css'
import en from './i18n/en.json'
import zhCN from './i18n/zh-CN.json'

const entry = (RB_CONTEXT) => {
  function Home (props) {
    const handleClick = () => {
      const { history } = props
      history.push('/test')
    }

    const { __, theme } = props
    return <div className={theme.home}>
      <div className={theme.content}>{__('home')}</div>
      <button onClick={handleClick}>{__('toTest')}</button>
    </div>
  }

  Home.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  return Home
}

const i18n = (RB_CONTEXT) => {
  const { locale } = RB_CONTEXT.options
  const i18ns = {
    en,
    'zh-CN': zhCN
  }

  return i18ns[locale]
}

const theme = (RB_CONTEXT) => {
  const { theme } = RB_CONTEXT.options
  const themes = {
    default: defaultTheme,
    darkgray
  }

  return themes[theme] || defaultTheme
}

export default {
  entry,
  i18n,
  theme
}
```

react-band在运行期，动态加载模块后，执行index.entry.jsx中的代码，并传入RB_CONTEXT对象，创建模块对应的React Component对象。RB_CONTEXT对象字段如下：

| field | description | example |
| -              | -                                          | -                 |
| options | 创建react-band时，传入的配置信息。 | { locale: 'en', theme: 'default' } |
| modules | 执行index.entry.jsx后返回的React Component对象列表。 |  |
| i18ns | 保存各模块的i18n资源。 |  |
| themes | 保存各模块的主题资源。 |  |
| packedModules | 各模块根据配置文件添加装饰器后生成的React Component对象列表。 |  |
| modulesConfig | 各模块的config.js配置信息列表。 |  |
| routes | 带有路由信息的config.js配置信息列表。 |  |
| getModule | 异步获取模块 | const Test = await getModule('test')  |

react-band提供getModule方法来异步获取模块对象。从而降低了模块间的强依赖。如下所示：

```javascript
// moduel1/index.js
import Module2 from '../module2/index.js'
```

```javascript
// react-band
// src/modules/custom/module1/index.entry.js
const entry = async ({ getModule }) => {
  const Module2 = await getModule('module2')

  return function Module1 {
    return <Module2 />
  }
}

export default {
  entry
}
```

## 主题文件（themes/）
themes目录用于存放模块相关的样式文件。react-band支持多套主题动态切换。目录下必须有一个default文件夹，用于存放默认的主题文件。约定主题文件为index.css或者index.global.css。react-band采用less-loader和css-loader加载样式文件，所以模块的样式文件支持less语法。react-band加载index.css的时候，采用css-loader的local模式。在加载index.global.css的时候，采用css-loader的global模式。

我们推荐使用局部作用域，所以通常只要创建index.css文件就行。使用局部作用域的话，我们需要使用@theme装饰器。引用@theme装饰器后，会向模块对象注入theme属性。如下所示：

```css
/* src/modules/custom/basic/home/themes/default/index.css */
.home {
  background-color: white;
}

.content {
  color: red;
}
```

```javascript
// demo: basic
// src/modules/custom/basic/home/config.js
export default (config) => {
  return {
    name: 'home',
    route: {
      path: '/',
      exact: true
    },
    decorators: ['@i18n', '@theme', '@layout']
  }
}
```

```javascript
// demo: basic
// src/modules/custom/basic/home/index.entry.jsx
import PropTypes from 'prop-types'
import React from 'react'
import darkgray from './themes/darkgray/index.css'
import defaultTheme from './themes/default/index.css'
import en from './i18n/en.json'
import zhCN from './i18n/zh-CN.json'

const entry = (RB_CONTEXT) => {
  function Home (props) {
    const handleClick = () => {
      const { history } = props
      history.push('/test')
    }

    const { __, theme } = props
    return <div className={theme.home}>
      <div className={theme.content}>{__('home')}</div>
      <button onClick={handleClick}>{__('toTest')}</button>
    </div>
  }

  Home.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  return Home
}

const i18n = (RB_CONTEXT) => {
  const { locale } = RB_CONTEXT.options
  const i18ns = {
    en,
    'zh-CN': zhCN
  }

  return i18ns[locale]
}

const theme = (RB_CONTEXT) => {
  const { theme } = RB_CONTEXT.options
  const themes = {
    default: defaultTheme,
    darkgray
  }

  return themes[theme] || defaultTheme
}

export default {
  entry,
  i18n,
  theme
}
```

有的时候需要引用第三方库的样式文件，这个时候就要用到全局作用域。如下所示：

```css
/* src/modules/common/commonSet2/modules/antd/components/themes/default/index.global.css */
@import "~antd/dist/antd.css";
```

## 国际化资源文件（i18n/）
i18n目录用于存放json格式的国际化资源文件。react-band支持多语言动态切换，支持国际化资源的按需加载。要获取国际化资源，我们需要使用@i18n装饰器。引用@i18n装饰器后，会向模块对象注入__属性。@i18n装饰器使用intl-messageformat解析国际化资源。如下所示：

```json
// demo: basic
// src/modules/custom/basic/home/i18n/en.json
{
  "home": "This is Home Page",
  "toTest": "Go to Test Page"
}
```

```javascript
// demo: basic
// src/modules/custom/basic/home/config.js
export default (config) => {
  return {
    name: 'home',
    route: {
      path: '/',
      exact: true
    },
    decorators: ['@i18n', '@theme', '@layout']
  }
}
```

```javascript
// demo: basic
// src/modules/custom/basic/home/index.entry.jsx
import PropTypes from 'prop-types'
import React from 'react'
import darkgray from './themes/darkgray/index.css'
import defaultTheme from './themes/default/index.css'
import en from './i18n/en.json'
import zhCN from './i18n/zh-CN.json'

const entry = (RB_CONTEXT) => {
  function Home (props) {
    const handleClick = () => {
      const { history } = props
      history.push('/test')
    }

    const { __, theme } = props
    return <div className={theme.home}>
      <div className={theme.content}>{__('home')}</div>
      <button onClick={handleClick}>{__('toTest')}</button>
    </div>
  }

  Home.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  return Home
}

const i18n = (RB_CONTEXT) => {
  const { locale } = RB_CONTEXT.options
  const i18ns = {
    en,
    'zh-CN': zhCN
  }

  return i18ns[locale]
}

const theme = (RB_CONTEXT) => {
  const { theme } = RB_CONTEXT.options
  const themes = {
    default: defaultTheme,
    darkgray
  }

  return themes[theme] || defaultTheme
}

export default {
  entry,
  i18n,
  theme
}
```

## 单元测试文件（\_\_test\_\_/）
\_\_test\_\_/目录用于存放单元测试文件。react-band采用jest+enzyme执行单元测试。
