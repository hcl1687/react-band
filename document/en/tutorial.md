# Motivation

When we develop a new project, we basically develop it on the basis of tailoring other people's project code.
In this way, mature code can be reused, which facilitates rapid project prototyping and reduces development risks.
When porting the code of other people's projects to my own project, or even porting the code of my 
previous project to a new project, I found the migration process very painful.
The modules in the project depend on each other and are complicated. It is usually necessary to read 
the source code in detail before deciding which codes to keep and which codes to delete.
Therefore, I hope there is a very simple way to transplant project code.

We always emphasize the need to abstract common components for reuse. But in actual development, 
abstraction is a gradual and iterative process. This is because our business needs are constantly iterative, 
so the abstraction of components cannot be achieved in one step. Therefore, I want to be able to 
distinguish between common and non-common components, and it can easily convert non-common components 
into common components. At the same time, it is also allowed to convert common components to non-common 
components to meet customized requirements.

With the continuous iteration of the project, there are more and more business codes, and the packaged 
js files are getting bigger and bigger, causing problems such as slow page loading. Therefore, I hope 
to have a unified asynchronous loading scheme to realize the on-demand loading of module code, style files, 
and international resources, and improve the loading speed of the page.

# Concept

## How to achieve portability?

The key to portability is decoupling. react-band realizes the decoupling of modules through componentization 
and asynchronous loading.

### Componentization

A front-end module usually includes business logic, styles and pictures, internationalized resources, etc. 
Generally speaking, we are accustomed to store business logic, styles and internationalized resources 
separately. For example: business logic is placed in the js folder, styles are placed in the themes folder, 
and internationalized resources are placed in the locale folder. Something like this:

```bash
|-src
  |-js
    |-module1
      |-index.ts
    |-module2
      |-index.ts
  |-themes
    |-module1
    |-module2
  |-locale
    |-module1
    |-module2
```

This kind of file organization is not conducive to the migration of modules. Imagine that if we want 
to port module1 to a new project, we need to operate the js, themes and locale directories separately. 
If we divide these files into modules, we only need to manipulate the module1 directory. The directory 
structure is as follows:

```bash
|-src
  |-modules
    |-custom
      |-module1
        |-config.ts
        |-index.entry.ts
        |-themes
        |-i18n
        |-document
        |-__test__
      |-module2
        |-config.ts
        |-index.entry.ts
        |-themes
        |-i18n
        |-document
        |-__test__
```

### Asynchronous loading

Although we organize files according to modules and improve the cohesion of modules, the coupling 
between modules still exists. For example: module1 depends on module2, then module2 needs to be directly 
referenced in the index.ts file of module1, Something like this:

```javascript
// moduel1/index.tsx
import Module2 from '../module2/index.tsx'
```

In this case, when porting module1, also need to port module2, and at the same time should ensure that 
the path of module1 and module2 is consistent. react-band removes the path restriction between modules 
through asynchronous loading. As follows:

```javascript
// react-band
// src/modules/custom/module1/index.entry.tsx
export default async ({ getModule }) => {
  const Module2 = await getModule('module2')

  return function Module1 {
    return <Module2 />
  }
}
```

react-band will collect the config.ts file under each module and maintain a list of modules for the 
current project. Each module uses the getModule function to load other modules asynchronously. In this way, the path dependence between modules is cancelled, and because it is asynchronously loaded on demand, the page loading speed is also improved.

## How to achieve progressive component development?

react-band provides common and custom directories under the modules directory. Among them, the common 
directory is used to store common modules, and the custom directory is used to store non-common modules. 
In order to facilitate the movement of the modules in the two directories without affecting the business logic, 
the module names in the common and custom directories can be the same. If there is a duplicate name, 
then in the module list of react-band, the module in custom will overwrite the module with the same name in common.

### Component promotion

If the developer feels that a custom module can be used as a common module after multiple iterations, 
just move the module directly to common.

### Component customization

If the developer feel that a common module does not meet business needs, he need to customize it. 
Then copy the module directly to custom, and then customize it.

## How to implement asynchronous loading?

A module usually includes js code, styles and internationalized resources. react-band implements code 
splitting for these three types of files through webpack's dynamic import, and use React.lazy to achieve 
asynchronous loading.

# Project structure

The initial directory structure of the react-band project is as follows:

```bash
|-server/
|-src
  |-modules
    |-common/
    |-custom/
  |-config/
  |-core/
  |-index.tsx
|-static/
|-template/
|-tests/
```

The functions of each directory file are as follows:

* server: store the data file of json-server. When run 'npm run start:mock', json-server will read these files before starting server.
* src: store source code.
   * modules: store business source code, including common modules and custom modules。
      * common: store common modules code.
      * custom: store custom modules code.
   * config: store configuration of react-band.
   * core: core code of react-band. It is mainly responsible for asynchronously loading the modules in the modules folder, and creating routes through React-Router, and finally rendering the modules through React.
   * index.tsx: Project's entry file. It creates an RBCore object through the RBCore.create method, and calls the mount method of the RBCore object to render the page.
* static: store static resources. These files will be copied to the dist folder after building.
* template: template of index.html
* tests: store configuration for testing and e2e test cases。

# Module
The module in react-band refers to a collection of independent code and resource files. These files are 
stored in the same folder and have no explicit dependencies with other modules. All business logic is 
carried and implemented by the module. react-band is responsible for collecting modules, and organizing 
and running modules according to certain rules. react-band implements code migration, progressive component 
development and asynchronous loading through modules.

In the basic example, two pages are implemented: the home page and the test page. Click the button on 
each page to jump to another page. There are 2 modules under src/modules/custom/basic, home and test. 
The home directory contains the code and resources necessary to run the home module, including js and 
css code, internationalized resources, etc.

```bash
|-src
  |-modules
    |-custom
      |-basic
        |-home
          |-__test__/
          |-i18n/
          |-themes/
          |-config.ts
          |-index.entry.tsx
        |-test
          |-__test__/
          |-i18n/
          |-themes/
          |-config.ts
          |-index.entry.tsx
        |-config.ts
```

Modules in react-band usually include configuration files (config.ts), entry files (index.entry.tsx), theme files (themes/), internationalized resource files (i18n/), unit test files (\_\_test\_\_/) etc.

## Type
There are two types of modules in react-band: component and decorator. Specify the type of the module 
by setting type=component|decorator in the configuration file. The default is the component type. Shown 
below is the configuration file of the i18n module in react-band. The type field is set to decorator.

> ***Convention: The name of the module of the decorator type must start with'@'***

```javascript
// src/modules/common/i18n/config.ts
export default (): RB.IRBLeafConfig => {
  return {
    name: '@i18n',
    type: 'decorator'
  }
}
```

The decorator type module is used to decorate the component type module. Specify the decorators to be 
applied by setting the decoratorsConfig and decorators fields in the configuration file of the component 
type module. During the runtime, react-band is responsible for loading related modules and assembling them.

## Configuration file (config.ts)
Each module must have a config.ts file. When react-band is building, it will traverse the src/modules directory, 
collect all the configuration information in the config.ts file and save it. During the runtime, react-band 
dynamically loads and assembles modules through these configuration information.

> ***The config.ts file is inherited. After react-band collects config.ts, it will merge the configuration information in config.ts in a directory with the configuration information in the parent directory of the directory to form the final configuration information.***

Shown below is the configuration information of the home module.

```javascript
// demo: basic
// src/modules/custom/basic/home/config.ts
export default (): RB.IRBLeafConfig => {
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
// src/modules/custom/as/pages/assignment/config.ts
export default (): RB.IRBLeafConfig => {
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

Configuration field description:
| field | description | example |
| -              | -                                          | -                 |
| name | Module name. Required. react-band gets the module by the module name. Module name can be duplicated. If there are modules with the same name in the common and custom directories, the custom module will overwrite the common module with the same name. | { name: 'home' } |
| lazy | Whether lazy loading. Optional. The default is true. If false, react-band will first load the corresponding module synchronously when opening the page. | { lazy: true } |
| disabled | Whether the module is disabled. Optional. The default is false. If true, react-band will not collect information about the module, and will not load the module during runtime. | { disabled: true } |
| route | Route information. Optional. The configuration information of react-router. it is used to set up route for the module. | { route: { path: 'test' }} |
| decoratorsConfig | Decorator configuration information. Optional. Some decorators may need to specify configuration information. In the configuration file of the decorator module, this field is invalid. |  |
| decorators | List of decorators. Optional. Declare the decorator that the module needs to apply. In the configuration file of the decorator module, this field is invalid. |  |

## Entry file (index.entry.tsx)
Each module must have an index.entry.tsx or index.entry.ts file. react-band uses this file to split the code into modules.

```javascript
// demo: basic
// src/modules/custom/basic/home/index.entry.tsx
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'

export default (): RB.IRBComponent => {
  function Home (props: InferProps<typeof Home.propTypes>) {
    const handleClick = () => {
      const history = props.history as RB.IRBHistory
      history.push('/test')
    }

    const { __ } = props
    const theme = props.theme as RB.IRBTheme
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
```

During the runtime of react-band, after the module is dynamically loaded, the code in index.entry.tsx is 
executed and the RB_CONTEXT object is passed in to create the React Component object corresponding to 
the module. The RB_CONTEXT object fields are as follows:

| field | description | example |
| -              | -                                          | -                 |
| options | The configuration information passed in when creating a react-band instance. | { locale: 'en', theme: 'default' } |
| modules | The list of React Component objects returned after index.entry.tsx is executed. |  |
| i18ns | Store i18n resources of each module. |  |
| themes | Store the theme resources of each module. |  |
| packedModules | The React Component object list generated after add their decorators according to the configuration file. |  |
| modulesConfig | The config.ts configuration information list of each module. |  |
| routes | Config.ts configuration information list with route information. |  |
| getModule | Get modules asynchronously | const Test = await getModule('test')  |

react-band provides getModule method to get module object asynchronously. Thereby reducing the strong 
dependence between modules. As follows:

```javascript
// moduel1/index.ts
import Module2 from '../module2/index.ts'
```

```javascript
// react-band
// src/modules/custom/module1/index.entry.ts
export default async ({ getModule }) => {
  const Module2 = await getModule('module2')

  return function Module1 {
    return <Module2 />
  }
}
```

## Theme file (themes/)
The themes directory is used to store module-related style files. react-band supports dynamic switching 
of multiple sets of themes. There must be a default folder in the directory to store the default theme files. 
In order to support the on-demand loading of module themes, it is agreed that the entry file of the theme 
is index.css or index.global.css. react-band will split the code based on these two files. react-band uses 
less-loader and css-loader to load style files, so the module style files support less syntax. When react-band 
loads index.css, it uses the local mode of css-loader. When loading index.global.css, the global mode of css-loader is adopted.

We recommend using local scope, so usually just create the index.css file. To use local scope, we need to 
use the @theme decorator. After referencing the @theme decorator, the theme attribute will be injected into 
the module object. As follows:

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
// src/modules/custom/basic/home/config.ts
export default (): RB.IRBLeafConfig => {
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
// src/modules/custom/basic/home/index.entry.tsx
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'

export default (): RB.IRBComponent => {
  function Home (props: InferProps<typeof Home.propTypes>) {
    const handleClick = () => {
      const history = props.history as RB.IRBHistory
      history.push('/test')
    }

    const { __ } = props
    const theme = props.theme as RB.IRBTheme
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
```

Sometimes you need to refer to the style file of a third-party library, this time you need to use the 
global scope. As follows:

```css
/* src/modules/common/antd/components/themes/default/index.global.css */
@import "~antd/dist/antd.css";
```

## Internationalized resource files (i18n/)
The i18n directory is used to store internationalized resource files in json format. react-band supports 
dynamic switching of multiple languages and on-demand loading of internationalized resources. To obtain 
internationalized resources, we need to use the @i18n decorator. After referencing the @i18n decorator, 
the __ attribute will be injected into the module object. The @i18n decorator uses intl-messageformat 
to parse internationalized resources. As follows:

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
// src/modules/custom/basic/home/config.ts
export default (): RB.IRBLeafConfig => {
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
// src/modules/custom/basic/home/index.entry.tsx
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'

export default (): RB.IRBComponent => {
  function Home (props: InferProps<typeof Home.propTypes>) {
    const handleClick = () => {
      const history = props.history as RB.IRBHistory
      history.push('/test')
    }

    const { __ } = props
    const theme = props.theme as RB.IRBTheme
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
```

## Unit test file(\_\_test\_\_/)
\_\_test\_\_/ directory is used to store unit test files. react-band uses jest+enzyme to perform unit tests.
