import { RouteProps } from 'react-router-dom'

export interface IRBOptions {
  locale?: string
  theme?: string
  container?: string
  exclude?: boolean | RegExp | ((key: string) => boolean)
}

export type IRBConfig = IRBInnerConfig & IRBRootConfig & IRBLeafConfig

export interface IRBInnerConfig {
  key?: string
  category?: string
}
export type IRBLeafConfig = {
  name: string
  type?: string
  route?: RouteProps
  [propName: string]: any
} & IRBRootConfig

export interface IRBRootConfig {
  disabled?: boolean
  lazy?: boolean
  decorators?: Array<string>
  decoratorsConfig?: {
    [propName: string]: any
  }
}

export type IRBModuleConfig = {
  i18n?: IRBI18n
  theme?: IRBTheme
} & IRBConfig

export interface IRBConfigMap {
  [propName: string]: IRBConfig
}

export interface IRBConfigFunctionMap {
  [propName: string]: (RB_OPTIONS: IRBOptions) => IRBConfig
}

export interface IRBConfigReq {
  (key: string): {
    default: (RB_OPTIONS: IRBOptions) => IRBConfig
  }
  keys: () => Array<string>
}

export interface IRBModulesMap {
  [propName: string]: IRBModule
}

export interface IRBI18n {
  [key: string]: string
}

export interface IRBI18nRaw {
  default: IRBI18n
}

export interface IRBI18nsMap {
  [moduleName: string]: {
    [localeName: string]: IRBI18n
  }
}

export interface IRBTheme {
  [key: string]: string
}

export interface IRBThemeRaw {
  default: IRBTheme
}

export interface IRBThemesMap {
  [moduleName: string]: {
    [themeName: string]: IRBTheme
  }
}

export interface IRBCore {
  getContext: () => IRBContext
  getModule: (name: string) => Promise<IRBModule | undefined>
  mount: () => Promise<IRBComponent>
}

export interface IRBDecoModule {
  (config: IRBModuleConfig, decoConfig: IRBModuleConfig, RB_CONTEXT: IRBContext): IRBDecoFactory
}

export type IRBCompModule = IRBComponent
export interface IRBDecoFactory {
  (WrappedComponent: IRBComponent): IRBComponent | Promise<IRBComponent>
}

export type IRBComponent = React.FC | React.ComponentClass

export interface IRBContext {
  options: IRBOptions
  modules: IRBModulesMap
  i18ns: IRBI18nsMap
  themes: IRBThemesMap
  packedModules: IRBModulesMap
  modulesConfig: IRBConfigMap
  routes: Array<IRBConfig>
  getModule: (name: string) => Promise<IRBModule | undefined>
}

export interface IRBObject {
  [propName: string]: any
}

export type IRBModule = IRBCompModule | IRBDecoModule | IRBObject

export interface IRBModuleFactory {
  (RB_CONTEXT: IRBContext): IRBModule
}
