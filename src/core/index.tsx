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

  private async loadI18n (name: string, factory: RB.IRBI18nFactory, RB_CONTEXT: RB.IRBContext): Promise<RB.IRBI18n> {
    const { locale } = RB_CONTEXT.options
    try {
      let i18n = await factory(RB_CONTEXT)
      i18n = i18n || {}
      this._i18ns[name] = this._i18ns[name] || {}
      this._i18ns[name][locale] = i18n
      return i18n
    } catch {
      this._i18ns[name] = this._i18ns[name] || {}
      this._i18ns[name][locale] = {}
      return {}
    }
  }

  private async loadTheme (name: string, factory: RB.IRBThemeFactory, RB_CONTEXT: RB.IRBContext): Promise<RB.IRBTheme> {
    const { theme } = RB_CONTEXT.options
    try {
      let themeObj = await factory(RB_CONTEXT)
      themeObj = themeObj || {}
      this._themes[name] = this._themes[name] || {}
      this._themes[name][theme] = themeObj
      return themeObj
    } catch {
      this._themes[name] = this._themes[name] || {}
      this._themes[name][theme] = {}
      return {}
    }
  }

  private async fetchModule (path: string): Promise<{ default: RB.IRBModuleRaw }> {
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
      let module: RB.IRBModuleRaw
      if (config.set) {
        // if the target module is in a module set.
        // load the module set instead.
        const setName = config.set
        await this.getModule(setName)

        const setModule = this._packedModules[setName]
        module = setModule[name]
      } else {
        // load module
        const res = await this.fetchModule(path)
        module = res['default']
      }

      this._modules[name].value = module

      const entryFactory: RB.IRBModuleFactory = module.entry
      const i18nFactory: RB.IRBI18nFactory = module.i18n
      const themeFactory: RB.IRBThemeFactory = module.theme

      const RB_CONTEXT = this.getContext()
      // load entry
      const entryPromise = entryFactory(RB_CONTEXT)
      // load i18n
      const i18nPromise = this.loadI18n(name, i18nFactory, RB_CONTEXT)
      // load theme
      const themePromise = this.loadTheme(name, themeFactory, RB_CONTEXT)
      const res = await Promise.all([entryPromise, i18nPromise, themePromise])
      const entry = res[0]

      ret['default'] = await this.packModule(name, entry)
      this._modules[name].trigger[0]()
    } catch (err) {
      this._modules[name].trigger[1](err)
      throw err
    }

    return ret
  }

  private async packModule (name: string, module: RB.IRBModule): Promise<RB.IRBModule> {
    const { locale, theme } = this._options
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
