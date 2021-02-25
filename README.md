# react-band
A portable react scaffold with webpack, babel, less, eslint, stylelint, jest and enzyme.

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

# Demo

<a href="https://www.hcl1687.com/react-band-as" target="_blank">as - a backstage management system</a>

# Document

[en](./document/en/tutorial.md)

[zh-CN](./document/zh-CN/tutorial.md)

# Typescript

[react-band with Typescript](https://github.com/hcl1687/react-band/tree/release/typescript)

# Quick Start

## Install react-band-cli

```bash
npm install react-band-cli -g
```

## Initiate project

```bash
react-band-cli init my-app -d as
```

init my-app: create my-app folder in the current directory, and initiate project.

-d as: add as demo after initiate the project. Currently, react-band provide these demos：

* as: a real backstage management system. Based on react+react-router+redux+antd, using json-server to mock server api.
* basic: a basic react+react-router demo, providing a custom homepage and a test page, the two pages can jump to each other.
* basic_menu: a react+react-router demo with left menu bar.
* basic_menu_antd: a react+react-router+antd demo with left menu bar.
* default: the simplest demo. Only provides a default home page and a test page.
* redux_menu_antd: a react+react-router+redux+antd demo with left menu bar.

If init with the basic demo. After the initialization is complete, a basic folder will be added under the src/modules/custom directory. The directory structure is similar to this:

```bash
|-src
  |-modules
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

## Run

```bash
npm run start
```

If using json-server to mock server api, such as the as demo, the following code needs to be executed:

```bash
npm run start:mock
```

Open a browser and visit http://localhost:3000.

## Lint

### javascript lint

```bash
npm run lint
```

### css lint

```bash
npm run stylelint
```


## Test

### Update snapshot

```bash
npm run test:update
```

### Run test

```bash
npm run test
```

### Generate coverage report

```bash
npm run test:coverage
```

### Debug test case

```bash
npm run test:debug
```

## Build

```bash
npm run build
```

## License
[MIT](https://opensource.org/licenses/mit-license.php)
