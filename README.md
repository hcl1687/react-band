# react-band
A simple react scaffold with webpack, babel, jest, enzyme and puppeteer.

# Quick Start

## Install react-band-cli

```bash
npm install react-band-cli -g
```

## Initiate project

```bash
react-band-cli init test -d basic
```

init test: create test folder in the current directory, and initiate project.

-d basic: add basic demo after initiate the project. Currently, react-band provide these demos：

* as: a real backstage management system. Based on react+react-router+redux+antd, using json-server to mock server api.
* basic: a basic react+react-router demo, providing a custom homepage and a test page, the two pages can jump to each other.
* basic_menu: a react+react-router demo with left menu bar.
* basic_menu_antd: a react+react-router+antd demo with left menu bar.
* default: the simplest demo. Only provides a default home page and a test page.
* redux_menu_antd: a react+react-router+redux+antd demo with left menu bar.

After the initialization is complete, a basic folder will be added under the src/components/custom directory. The directory structure is similar to this:

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

## Run

```bash
npm run start
```

If using json-server to mock server api, the following code needs to be executed:

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

# Document

[en](./document/en/tutorial.md)

[zh-CN](./document/zh-CN/tutorial.md)

## License
[MIT](https://opensource.org/licenses/mit-license.php)
