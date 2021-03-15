import React, { ReactNode, Suspense } from 'react'
import { Route, HashRouter as Router, Switch } from 'react-router-dom'
import ReactDOM from 'react-dom'
import flowFactory from 'promiseflow'
import getConfig from './getConfig'

const runFlow = flowFactory(Promise)
const DEFAULT_OPTIONS: RB.IRBOptions = {
  locale: 'en',
  theme: 'default',
  container: '#container'
}

export default class RBCore {
  private _options: RB.IRBOptions

  private _modules: RB.IRBInnerModulesMap

  private _i18ns: RB.IRBI18nsMap

  private _themes: RB.IRBThemesMap

  private _packedModules: RB.IRBModulesMap

  private _modulesConfig: RB.IRBConfigMap

  private _routes: Array<RB.IRBConfig>

  constructor (options: RB.IRBOptions = {}) {
    this._options = Object.assign({}, DEFAULT_OPTIONS, options)
    this._modules = {}
    this._i18ns = {}
    this._themes = {}
    this._packedModules = {}
    this._modulesConfig = getConfig(this._options)
    this._routes = this.createRoute()
  }

  static create (options: RB.IRBOptions): RB.IRBCore {
    return new RBCore(options)
  }

  public getContext (): RB.IRBContext {
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

  private loadI18n (path: string, name: string): Promise<RB.IRBI18nRaw | unknown> {
    const { locale } = this._options
    return this.fetchI18n(path, locale).then((i18n:RB.IRBI18nRaw) => {
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
  private fetchI18n (path: string, locale: string): Promise<RB.IRBI18nRaw> {
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

  private fetchI18nJSON (path: string, locale: string): Promise<RB.IRBI18nRaw> {
    return import(
      /* webpackExclude: /[/\\]\+[^+/\\]+[/\\]((?!i18n)[^+/\\])+[/\\]/ */
      /* webpackInclude: /[/\\]i18n[/\\][^+/\\]+\.json$/ */
      `~/modules/${path}/i18n/${locale}.json`
    )
  }

  private fetchI18nJS (path: string, locale: string): Promise<RB.IRBI18nRaw> {
    return import(
      /* webpackExclude: /[/\\]\+[^+/\\]+[/\\]((?!i18n)[^+/\\])+[/\\]/ */
      /* webpackInclude: /[/\\]i18n[/\\][^+/\\]+\.ts$/ */
      `~/modules/${path}/i18n/${locale}.ts`
    )
  }

  private checkModuleSetI18nJson (path: string) {
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

  private checkModuleSetI18nJs (path: string) {
    // +moduleSet/i18n/en.ts will be bunndled
    // +moduleSet/xxx/i18n/en.ts will be skipped.
    const excludeRegex = /[/\\]\+[^+/\\]+[/\\]((?!i18n)[^+/\\])+[/\\]/
    const includeRegex = /[/\\]i18n[/\\][^+/\\]+\.ts$/

    if (!excludeRegex.test(path)) {
      if (includeRegex.test(path)) {
        return true
      }
    }

    return false
  }

  private loadTheme (path: string, name: string): Promise<RB.IRBThemeRaw | unknown> {
    const { theme } = this._options
    return this.fetchTheme(path, theme).then((themeObj: RB.IRBThemeRaw) => {
      this._themes[name] = this._themes[name] || {}
      this._themes[name][theme] = themeObj['default']
      return themeObj
    })
  }

  private fetchTheme (path: string, theme: string): Promise<RB.IRBThemeRaw> {
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

  private fetchLocalTheme (path: string, theme: string): Promise<RB.IRBThemeRaw> {
    return this.fetchLocalThemeCss(path, theme).catch(() => {
      return this.fetchLocalThemeCss(path, 'default').catch(() => {
        const res = {}
        res['default'] = {}
        return res
      })
    })
  }

  private fetchGlobalTheme (path: string, theme: string): Promise<unknown> {
    return this.fetchGlobalCss(path, theme).catch(() => {
      return this.fetchGlobalCss(path, 'default').catch(() => {
        return {}
      })
    })
  }

  private fetchModuleSetLocalTheme (path, theme) {
    return this.fetchLocalThemeJs(path, theme).catch(() => {
      return this.fetchLocalThemeJs(path, 'default').catch(() => {
        const res = {}
        res['default'] = {}
        return res
      })
    })
  }

  private fetchLocalThemeCss (path, theme) {
    return import(
      /* webpackExclude: /[/\\]\+[^+/\\]+[/\\]((?!themes)[^+/\\])+[/\\]/ */
      /* webpackInclude: /[/\\]themes[/\\][^+/\\]+[/\\]index\.css$/ */
      `~/modules/${path}/themes/${theme}/index.css`
    )
  }

  private fetchLocalThemeJs (path, theme) {
    return import(
      /* webpackExclude: /[/\\]\+[^+/\\]+[/\\]((?!themes)[^+/\\])+[/\\]/ */
      /* webpackInclude: /[/\\]themes[/\\][^+/\\]+[/\\]index\.ts$/ */
      `~/modules/${path}/themes/${theme}/index.ts`
    )
  }

  private fetchGlobalCss (path, theme) {
    return import(
      /* webpackExclude: /[/\\]\+[^+/\\]+[/\\]((?!themes)[^+/\\])+[/\\]/ */
      /* webpackInclude: /[/\\]themes[/\\][^+/\\]+[/\\]index\.global\.css$/ */
      `~/modules/${path}/themes/${theme}/index.global.css`
    ).catch(() => {
      return {}
    })
  }

  private checkModuleSetLocalThemeCss (path) {
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

  private checkModuleSetThemeJs (path) {
    // +moduleSet/themes/default/index.ts will be bunndled
    // +moduleSet/xxx/themes/default/index.ts will be skipped.
    const excludeRegex = /[/\\]\+[^+/\\]+[/\\]((?!themes)[^+/\\])+[/\\]/
    const includeRegex = /[/\\]themes[/\\][^+/\\]+[/\\]index\.ts$/

    if (!excludeRegex.test(path)) {
      if (includeRegex.test(path)) {
        return true
      }
    }

    return false
  }

  private checkModuleSetThemeGlobalCss (path) {
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

  private fetchModule (path) {
    path = path.replace(/^\.\//, '')
    return import(
      /* webpackExclude: /[/\\]\+[^+/\\]+[/\\][^+/\\]+[/\\]/ */
      /* webpackInclude: /index\.entry\.(ts|tsx)$/ */
      `~/modules/${path}/index.entry`
    )
  }

  private checkModuleSetEntry (path) {
    // +moduleSet/index.entry.tsx will be bunndled
    // +moduleSet/xxx/index.entry.tsx will be skipped.
    const excludeRegex = /[/\\]\+[^+/\\]+[/\\][^+/\\]+[/\\]/
    const includeRegex = /index\.entry\.(ts|tsx)$/

    if (!excludeRegex.test(path)) {
      if (includeRegex.test(path)) {
        return true
      }
    }

    return false
  }

  private async loadModule (path: string, name: string, config: RB.IRBConfig): Promise<{ default: RB.IRBModule }> {
    const ret = {
      default: null
    }

    try {
      let moduleFactory: RB.IRBModuleFactory
      if (config.set) {
        // if the target module is in a module set.
        // load the module set instead.
        const setName = config.set
        await this.getModule(setName)

        const setModule = this._modules[setName].value
        const { locale, theme } = this._options

        // set i18n
        const i18n = this._i18ns[setName][locale] as RB.IRBSetI18n
        this._i18ns[name] = this._i18ns[name] || {}
        this._i18ns[name][locale] = i18n[name]
        // set theme
        const themeObj = this._themes[setName][theme] as RB.IRBSetTheme
        this._themes[name] = this._themes[name] || {}
        this._themes[name][theme] = themeObj[name]

        moduleFactory = setModule[name]
      } else {
        // load i18n
        const i18nPromise = this.loadI18n(path, name)
        // load theme
        const themePromise = this.loadTheme(path, name)
        // load module
        const modulePromise = this.fetchModule(path)

        const res = await Promise.all([modulePromise, i18nPromise, themePromise])
        moduleFactory = res[0]['default']
      }

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

  private async packModule (name: string): Promise<RB.IRBModule> {
    const { locale, theme } = this._options
    let module = this._modules[name].value
    const i18n: RB.IRBI18n = this._i18ns[name][locale] as RB.IRBI18n
    const themeObj: RB.IRBTheme = this._themes[name][theme] as RB.IRBTheme
    const RB_CONTEXT = this.getContext()

    const config: RB.IRBConfig = this._modulesConfig[name]
    if (config.type !== 'decorator' && config.type !== 'set') {
      // it's component type
      // get decorators from config
      const { decorators = [] } = config
      for (let i = 0; i < decorators.length; i++) {
        const deco = decorators[i]
        const decoModule = await this.getModule(deco)
        const decoConfig = this._modulesConfig[deco]
        const decoI18n = this._i18ns[deco][locale] as RB.IRBI18n
        const decoThemeObj = this._themes[deco][theme] as RB.IRBTheme
        const moduleCompConfig: RB.IRBModuleConfig = {
          ...config,
          i18n,
          theme: themeObj
        }
        const moduleDecoConfig: RB.IRBModuleConfig = {
          ...decoConfig,
          i18n: decoI18n,
          theme: decoThemeObj
        }
        if (decoModule) {
          module = await (decoModule as RB.IRBDecoModule)(moduleCompConfig, moduleDecoConfig, RB_CONTEXT)(module as RB.IRBCompModule)
        }
      }
    }

    this._packedModules[name] = module

    return module
  }

  public getModule = async (name: string, wrapped = false): Promise<RB.IRBModule | undefined> => {
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

    const m = await _getModule()

    return wrapped ? {
      default: m
    } : m
  }

  private initInnerModule ({ name, status = 'pending', value = null }: RB.IRBInnerModuleParams) {
    const ret: RB.IRBInnerModule = {
      status,
      value
    }
    let trigger: [RB.IRBResovle, RB.IRBReject]
    const waittingPromise = new Promise<undefined>((resolve, reject) => {
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

  private createRoute (): Array<RB.IRBConfig> {
    const modulesConfig = this._modulesConfig
    let homeConfig: RB.IRBConfig
    let notFoundConfig: RB.IRBConfig
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

  private async loadSyncModule (): Promise<void> {
    const modulesConfig = this._modulesConfig
    // load not lazy modules
    await runFlow(modulesConfig, undefined, (value: RB.IRBConfig) => {
      if (value.lazy === false) {
        return this.getModule(value.name, true)
      }
    })
  }

  async mount (): Promise<React.FC> {
    const { container } = this._options
    const routes = this._routes
    await this.loadSyncModule()
    const Loading = this._packedModules['loading'] as RB.IRBCompModule
    const App = this._packedModules['app'] as RB.IRBCompModule
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

  private async lazyLoadModule (name: string): Promise<{ default: React.FC }> {
    const Comp = await this.getModule(name)
    return {
      default: Comp as React.FC
    }
  }

  private asyncRoute (config: RB.IRBConfig): ReactNode {
    const { name, route = {}, lazy } = config
    let component: RB.IRBCompModule
    if (lazy === false) {
      component = this._packedModules[name] as RB.IRBCompModule
    } else {
      component = (
        React.lazy(() => (
          this.lazyLoadModule(name)
        ))
      )
    }

    return <Route key={name} {...route} component={component} />
  }
}
