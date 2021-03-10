import React, { Suspense } from 'react'
import { Route, HashRouter as Router, Switch } from 'react-router-dom'
import ReactDOM from 'react-dom'
import flowFactory from 'promiseflow'
import getConfig from './getConfig'

const runFlow = flowFactory(Promise)
const DEFAULT_OPTIONS = {
  locale: 'en',
  theme: 'default',
  container: '#container'
}

export default class RBCore {
  constructor (options = {}) {
    this._options = Object.assign({}, DEFAULT_OPTIONS, options)
    this._modules = {}
    this._i18ns = {}
    this._themes = {}
    this._packedModules = {}
    this._modulesConfig = getConfig(this._options)
    this._routes = this.createRoute()
  }

  static create (options) {
    return new RBCore(options)
  }

  getContext () {
    return {
      options: this._options,
      modules: this._modules,
      i18ns: this._i18ns,
      themes: this._themes,
      packedModules: this._packedModules,
      modulesConfig: this._modulesConfig,
      routes: this._routes,
      getModule: this.getModule
    }
  }

  loadI18n (path, name) {
    const { locale } = this._options
    return this.fetchI18n(path, locale).then(i18n => {
      this._i18ns[name] = this._i18ns[name] || {}
      this._i18ns[name][locale] = i18n['default']
      return i18n
    }).catch(() => {
      this._i18ns[name] = this._i18ns[name] || {}
      this._i18ns[name][locale] = {}
      return {}
    })
  }

  // support json or js i18n file
  fetchI18n (path, locale) {
    path = path.replace(/^\.\//, '')
    const moduleSetRegex = /[/\\]\+[^+]+$/
    if (moduleSetRegex.test(path)) {
      // it's module set, fetch js file
      return this.fetchI18nJS(path, locale)
    }

    return this.fetchI18nJSON(path, locale).catch(() => {
      return this.fetchI18nJS(path, locale)
    })
  }

  fetchI18nJSON (path, locale) {
    return import(
      /* webpackExclude: /[/\\]\+[^+/\\]+[/\\]((?!i18n)[^+/\\])+[/\\]/ */
      /* webpackInclude: /[/\\]i18n[/\\][^+/\\]+\.json$/ */
      `~/modules/${path}/i18n/${locale}.json`
    )
  }

  fetchI18nJS (path, locale) {
    return import(
      /* webpackExclude: /[/\\]\+[^+/\\]+[/\\]((?!i18n)[^+/\\])+[/\\]/ */
      /* webpackInclude: /[/\\]i18n[/\\][^+/\\]+\.js$/ */
      `~/modules/${path}/i18n/${locale}.js`
    )
  }

  checkModuleSetI18nJson (path) {
    // +moduleSet/i18n/en.json will be bunndled
    // +moduleSet/xxx/i18n/en.json will be skipped.
    const excludeRegex = /[/\\]\+[^+/\\]+[/\\]((?!i18n)[^+/\\])+[/\\]/
    const includeRegex = /[/\\]i18n[/\\][^+/\\]+\.json$/

    if (!excludeRegex.test(path)) {
      if (includeRegex.test(path)) {
        return true
      }
    }

    return false
  }

  checkModuleSetI18nJs (path) {
    // +moduleSet/i18n/en.js will be bunndled
    // +moduleSet/xxx/i18n/en.js will be skipped.
    const excludeRegex = /[/\\]\+[^+/\\]+[/\\]((?!i18n)[^+/\\])+[/\\]/
    const includeRegex = /[/\\]i18n[/\\][^+/\\]+\.js$/

    if (!excludeRegex.test(path)) {
      if (includeRegex.test(path)) {
        return true
      }
    }

    return false
  }

  loadTheme (path, name) {
    const { theme } = this._options
    return this.fetchTheme(path, theme).then(themeObj => {
      this._themes[name] = this._themes[name] || {}
      this._themes[name][theme] = themeObj['default']
      return themeObj
    })
  }

  fetchTheme (path, theme) {
    path = path.replace(/^\.\//, '')
    const moduleSetRegex = /[/\\]\+[^+]+$/

    if (moduleSetRegex.test(path)) {
      // it's module set, fetch js file
      return Promise.all([
        this.fetchModuleSetLocalTheme(path, theme),
        this.fetchGlobalTheme(path, theme)
      ]).then(res => {
        return res && res[0]
      })
    }

    return Promise.all([
      this.fetchLocalTheme(path, theme),
      this.fetchGlobalTheme(path, theme)
    ]).then(res => {
      return res && res[0]
    })
  }

  fetchLocalTheme (path, theme) {
    return this.fetchLocalThemeCss(path, theme).catch(() => {
      return this.fetchLocalThemeCss(path, 'default').catch(() => {
        const res = {}
        res['default'] = {}
        return res
      })
    })
  }

  fetchGlobalTheme (path, theme) {
    return this.fetchGlobalCss(path, theme).catch(() => {
      return this.fetchGlobalCss(path, 'default').catch(() => {
        return {}
      })
    })
  }

  fetchModuleSetLocalTheme (path, theme) {
    return this.fetchLocalThemeJs(path, theme).catch(() => {
      return this.fetchLocalThemeJs(path, 'default').catch(() => {
        const res = {}
        res['default'] = {}
        return res
      })
    })
  }

  fetchLocalThemeCss (path, theme) {
    return import(
      /* webpackExclude: /[/\\]\+[^+/\\]+[/\\]((?!themes)[^+/\\])+[/\\]/ */
      /* webpackInclude: /[/\\]themes[/\\][^+/\\]+[/\\]index\.css$/ */
      `~/modules/${path}/themes/${theme}/index.css`
    )
  }

  fetchLocalThemeJs (path, theme) {
    return import(
      /* webpackExclude: /[/\\]\+[^+/\\]+[/\\]((?!themes)[^+/\\])+[/\\]/ */
      /* webpackInclude: /[/\\]themes[/\\][^+/\\]+[/\\]index\.js$/ */
      `~/modules/${path}/themes/${theme}/index.js`
    )
  }

  fetchGlobalCss (path, theme) {
    return import(
      /* webpackExclude: /[/\\]\+[^+/\\]+[/\\]((?!themes)[^+/\\])+[/\\]/ */
      /* webpackInclude: /[/\\]themes[/\\][^+/\\]+[/\\]index\.global\.css$/ */
      `~/modules/${path}/themes/${theme}/index.global.css`
    ).catch(() => {
      return {}
    })
  }

  checkModuleSetLocalThemeCss (path) {
    // +moduleSet/themes/default/index.css will be bunndled
    // +moduleSet/xxx/themes/default/index.css will be skipped.
    const excludeRegex = /[/\\]\+[^+/\\]+[/\\]((?!themes)[^+/\\])+[/\\]/
    const includeRegex = /[/\\]themes[/\\][^+/\\]+[/\\]index\.css$/

    if (!excludeRegex.test(path)) {
      if (includeRegex.test(path)) {
        return true
      }
    }

    return false
  }

  checkModuleSetThemeJs (path) {
    // +moduleSet/themes/default/index.js will be bunndled
    // +moduleSet/xxx/themes/default/index.js will be skipped.
    const excludeRegex = /[/\\]\+[^+/\\]+[/\\]((?!themes)[^+/\\])+[/\\]/
    const includeRegex = /[/\\]themes[/\\][^+/\\]+[/\\]index\.js$/

    if (!excludeRegex.test(path)) {
      if (includeRegex.test(path)) {
        return true
      }
    }

    return false
  }

  checkModuleSetThemeGlobalCss (path) {
    // +moduleSet/themes/default/index.global.css will be bunndled
    // +moduleSet/xxx/themes/default/index.global.css will be skipped.
    const excludeRegex = /[/\\]\+[^+/\\]+[/\\]((?!themes)[^+/\\])+[/\\]/
    const includeRegex = /[/\\]themes[/\\][^+/\\]+[/\\]index\.global\.css$/

    if (!excludeRegex.test(path)) {
      if (includeRegex.test(path)) {
        return true
      }
    }

    return false
  }

  fetchModule (path) {
    path = path.replace(/^\.\//, '')
    return import(
      /* webpackExclude: /[/\\]\+[^+/\\]+[/\\][^+/\\]+[/\\]/ */
      /* webpackInclude: /index\.entry\.(js|jsx)$/ */
      `~/modules/${path}/index.entry`
    )
  }

  checkModuleSetEntry (path) {
    // +moduleSet/index.entry.jsx will be bunndled
    // +moduleSet/xxx/index.entry.jsx will be skipped.
    const excludeRegex = /[/\\]\+[^+/\\]+[/\\][^+/\\]+[/\\]/
    const includeRegex = /index\.entry\.(js|jsx)$/

    if (!excludeRegex.test(path)) {
      if (includeRegex.test(path)) {
        return true
      }
    }

    return false
  }

  async loadModule (path, name, config) {
    if (config.set) {
      // if the target module is in a module set.
      // load the module set instead.
      const setName = config.set
      const ret = {}
      await this.getModule(setName)
      ret['default'] = this._packedModules[name]

      return ret
    }

    const ret = {}
    try {
      // load i18n
      const i18nPromise = this.loadI18n(path, name)
      // load theme
      const themePromise = this.loadTheme(path, name)
      // load module
      const modulePromise = this.fetchModule(path)

      const res = await Promise.all([modulePromise, i18nPromise, themePromise])
      const moduleFactory = res[0]['default']
      const RB_CONTEXT = this.getContext()
      this._modules[name].value = await moduleFactory(RB_CONTEXT)

      ret['default'] = await this.packModule(name)
      this._modules[name].trigger[0]()
    } catch (err) {
      this._modules[name].trigger[1](err)
      throw err
    }

    return ret
  }

  async packModule (name) {
    const { locale, theme } = this._options
    let module = this._modules[name].value
    const i18n = this._i18ns[name][locale]
    const themeObj = this._themes[name][theme]
    const RB_CONTEXT = this.getContext()

    const config = this._modulesConfig[name]
    if (config.type !== 'decorator' && config.type !== 'set') {
      // it's component type
      // get decorators from config
      const { decorators = [] } = config
      for (let i = 0; i < decorators.length; i++) {
        const deco = decorators[i]
        const decoModule = await this.getModule(deco)
        const decoConfig = this._modulesConfig[deco]
        const decoI18n = this._i18ns[deco][locale]
        const decoThemeObj = this._themes[deco][theme]
        if (decoModule) {
          module = await decoModule({
            ...config,
            i18n,
            theme: themeObj
          }, {
            ...decoConfig,
            i18n: decoI18n,
            theme: decoThemeObj
          }, RB_CONTEXT)(module)
        }
      }
    } else if (config.type === 'set') {
      // register real modules of the set module
      const moduleNames = Object.keys(module)
      for (let i = 0; i < moduleNames.length; i++) {
        const moduleName = moduleNames[i]
        const moduleFactory = module[moduleName]
        const subModule = await moduleFactory(RB_CONTEXT)
        if (!this._modules[moduleName]) {
          this.initInnerModule({ name: moduleName, value: subModule })
        } else {
          this._modules[moduleName].value = subModule
        }
        this._i18ns[moduleName] = this._i18ns[moduleName] || {}
        this._i18ns[moduleName][locale] = i18n[moduleName]
        this._themes[moduleName] = this._themes[moduleName] || {}
        this._themes[moduleName][theme] = themeObj[moduleName]
        try {
          await this.packModule(moduleName)
          this._modules[moduleName].trigger[0]()
        } catch (err) {
          this._modules[moduleName].trigger[1]()
          throw err
        }
      }
    }

    this._packedModules[name] = module

    return module
  }

  getModule = async (name, wrapped = false) => {
    const _getModule = async () => {
      const config = this._modulesConfig[name]
      if (!config) {
        return
      }

      if (this._packedModules[name]) {
        return this._packedModules[name]
      } else {
        if (this._modules[name] && this._modules[name].waittingPromise) {
          await this._modules[name].waittingPromise
          return this._packedModules[name]
        } else {
          this.initInnerModule({ name })
        }
      }

      await this.loadModule(config.key, name, config)
      return this._packedModules[name]
    }

    const m = await _getModule({
      name
    })

    return wrapped ? {
      default: m
    } : m
  }

  initInnerModule ({ name, status = 'pending', value = null } = {}) {
    const ret = {
      status,
      value
    }
    let trigger
    const waittingPromise = new Promise((resolve, reject) => {
      trigger = [resolve, reject]
    }).then((res) => {
      this._modules[name]['status'] = 'done'
      delete ret.trigger
      delete ret.waittingPromise
      return res
    }).catch(err => {
      this._modules[name]['status'] = 'failed'
      delete ret.trigger
      delete ret.waittingPromise
      throw err
    })

    ret.trigger = trigger
    ret.waittingPromise = waittingPromise

    this._modules[name] = ret

    return ret
  }

  createRoute () {
    const modulesConfig = this._modulesConfig
    let homeConfig
    let notFoundConfig
    Object.keys(modulesConfig).forEach(name => {
      const config = modulesConfig[name]
      const { route } = config
      if (route && route.path === '/') {
        homeConfig = config
      } else if (route && route.path === undefined) {
        notFoundConfig = config
      }
    })

    const routes = Object.keys(modulesConfig).map(name => modulesConfig[name]).filter(config => {
      if (!config.route) {
        return false
      }

      if (config.route && config.route.path === '/') {
        return false
      }

      if (config.route && config.route.path === undefined) {
        return false
      }

      return true
    })

    if (homeConfig) {
      routes.unshift(homeConfig)
    }
    if (notFoundConfig) {
      routes.push(notFoundConfig)
    }

    this._routes = routes

    return routes
  }

  async loadSyncModule () {
    const modulesConfig = this._modulesConfig
    // load not lazy modules
    await runFlow(modulesConfig, undefined, (value, key) => {
      if (value.lazy === false) {
        return this.getModule(value.name, true)
      }
    })
  }

  async mount () {
    const { container } = this._options
    const routes = this._routes
    await this.loadSyncModule()
    const Loading = this._packedModules['loading']
    const App = this._packedModules['app']
    const Comp = () => {
      return (
        <Router>
          <Suspense fallback={<Loading />}>
            <Switch>
              {
                routes.map(config => {
                  return this.asyncRoute(config)
                })
              }
            </Switch>
          </Suspense>
        </Router>
      )
    }
    const Container = () => {
      return App ? <App>
        <Comp />
      </App> : <Comp />
    }

    ReactDOM.render(<Container />, typeof container === 'string' ? document.querySelector(container) : container)

    // for unit test
    return Container
  }

  asyncRoute (config) {
    const { name, route = {}, lazy } = config
    let component
    if (lazy === false) {
      component = this._packedModules[name]
    } else {
      component = (
        React.lazy(() => (
          this.getModule(name, true)
        ))
      )
    }

    return <Route key={name} {...route} component={component} />
  }
}
