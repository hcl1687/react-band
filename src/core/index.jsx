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
    this._comps = {}
    this._i18ns = {}
    this._themes = {}
    this._packedComps = {}
    this._compsConfig = getConfig(this._options)
    this._routes = this.createRoute()
  }

  static create (options) {
    return new RBCore(options)
  }

  getContext () {
    return {
      options: this._options,
      comps: this._comps,
      i18ns: this._i18ns,
      themes: this._themes,
      packedComps: this._packedComps,
      compsConfig: this._compsConfig,
      routes: this._routes,
      getComponent: this.getComponent
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

  fetchI18n (path, locale) {
    path = path.replace(/^\.\//, '')
    return import(`~/components/${path}/i18n/${locale}.json`)
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
    return Promise.all([
      this.fetchLocalTheme(path, theme),
      this.fetchGlobalTheme(path, theme)
    ]).then(res => {
      return res && res[0]
    })
  }

  fetchLocalTheme (path, theme) {
    return import(`~/components/${path}/themes/${theme}/index.css`).catch(() => {
      const res = {}
      res['default'] = {}
      return res
    })
  }

  fetchGlobalTheme (path, theme) {
    return import(`~/components/${path}/themes/${theme}/index.global.css`).catch(() => {
      return {}
    })
  }

  async loadComponent (path, name) {
    // load i18n
    const i18nPromise = this.loadI18n(path, name)
    // load theme
    const themePromise = this.loadTheme(path, name)
    // load component
    const compPromise = this.fetchComponent(path)

    const res = await Promise.all([compPromise, i18nPromise, themePromise])
    const module = res[0]
    const comp = module['default']
    const RB_CONTEXT = this.getContext()
    this._comps[name] = await comp(RB_CONTEXT)

    const ret = []
    ret['default'] = await this.packComponent(name)
    return ret
  }

  fetchComponent (path) {
    path = path.replace(/^\.\//, '')
    return import(
      `~/components/${path}/index.entry`
    )
  }

  async packComponent (name) {
    const { locale, theme } = this._options
    let comp = this._comps[name]
    const i18n = this._i18ns[name][locale]
    const themeObj = this._themes[name][theme]
    const RB_CONTEXT = this.getContext()

    const config = this._compsConfig[name]
    if (config.type !== 'decorator') {
      // get decorators from config
      const { decorators = [] } = config
      for (let i = 0; i < decorators.length; i++) {
        const deco = decorators[i]
        const decoComp = await this.getComponent(deco)
        const decoConfig = this._compsConfig[deco]
        const decoI18n = this._i18ns[deco][locale]
        const decoThemeObj = this._themes[deco][theme]
        if (decoComp) {
          comp = await decoComp({
            ...config,
            i18n,
            theme: themeObj
          }, {
            ...decoConfig,
            i18n: decoI18n,
            theme: decoThemeObj
          }, RB_CONTEXT)(comp)
        }
      }
    }

    this._packedComps[name] = comp

    return comp
  }

  getComponent = async (name) => {
    const config = this._compsConfig[name]
    if (!config) {
      return
    }

    if (this._packedComps[name]) {
      return this._packedComps[name]
    }

    await this.loadComponent(config.key, name)
    return this._packedComps[name]
  }

  createRoute () {
    const compsConfig = this._compsConfig
    let homeConfig = {}
    let notFoundConfig = {}
    Object.keys(compsConfig).forEach(name => {
      const config = compsConfig[name]
      const { route } = config
      if (route && route.path === '/') {
        homeConfig = config
      } else if (route && route.path === undefined) {
        notFoundConfig = config
      }
    })

    const routes = Object.keys(compsConfig).map(name => compsConfig[name]).filter(config => {
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
    routes.unshift(homeConfig)
    routes.push(notFoundConfig)

    this._routes = routes

    return routes
  }

  async loadSyncComponent () {
    const compsConfig = this._compsConfig
    // load not lazy components
    await runFlow(compsConfig, undefined, (value, key) => {
      if (value.lazy === false) {
        return this.loadComponent(value.key, value.name)
      }
    })
  }

  async mount () {
    const { container } = this._options
    const routes = this._routes
    await this.loadSyncComponent()
    const Loading = this._packedComps['loading']
    const App = this._packedComps['app']
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
  }

  asyncRoute (config) {
    const { name, route = {}, lazy, key } = config
    let component
    if (lazy === false) {
      component = this._packedComps[name]
    } else {
      component = (
        React.lazy(() => (
          this.loadComponent(key, name)
        ), 'default')
      )
    }

    return <Route key={name} {...route} component={component} />
  }
}
