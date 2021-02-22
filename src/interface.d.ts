// https://stackoverflow.com/questions/45099605/ambient-declaration-with-an-imported-type-in-typescript
import { RouteProps } from 'react-router-dom'

declare global {
  namespace RB {
    interface IRBOptions {
      locale?: string
      theme?: string
      container?: string
      exclude?: boolean | RegExp | ((key: string) => boolean)
    }

    type IRBConfig = IRBInnerConfig & IRBRootConfig & IRBLeafConfig

    interface IRBInnerConfig {
      key?: string
      category?: string
    }
    type IRBLeafConfig = {
      name: string
      type?: string
      route?: RouteProps
      [propName: string]: any
    } & IRBRootConfig

    interface IRBRootConfig {
      disabled?: boolean
      lazy?: boolean
      decorators?: Array<string>
      decoratorsConfig?: {
        [propName: string]: any
      }
    }

    type IRBModuleConfig = {
      i18n?: IRBI18n
      theme?: IRBTheme
    } & IRBConfig

    interface IRBConfigMap {
      [propName: string]: IRBConfig
    }

    interface IRBConfigFunctionMap {
      [propName: string]: (RB_OPTIONS: IRBOptions) => IRBConfig
    }

    interface IRBConfigReq {
      (key: string): {
        default: (RB_OPTIONS: IRBOptions) => IRBConfig
      }
      keys: () => Array<string>
    }

    interface IRBModulesMap {
      [propName: string]: IRBModule
    }

    interface IRBI18n {
      [key: string]: string
    }

    interface IRBI18nRaw {
      default: IRBI18n
    }

    interface IRBI18nsMap {
      [moduleName: string]: {
        [localeName: string]: IRBI18n
      }
    }

    interface IRBTheme {
      [key: string]: string
    }

    interface IRBThemeRaw {
      default: IRBTheme
    }

    interface IRBThemesMap {
      [moduleName: string]: {
        [themeName: string]: IRBTheme
      }
    }

    interface IRBCore {
      getContext: () => IRBContext
      getModule: (name: string) => Promise<IRBModule | undefined>
      mount: () => Promise<IRBComponent>
    }

    interface IRBDecoModule {
      (config: IRBModuleConfig, decoConfig: IRBModuleConfig, RB_CONTEXT: IRBContext): IRBDecoFactory
    }

    type IRBCompModule = IRBComponent
    interface IRBDecoFactory {
      (WrappedComponent: IRBComponent): IRBComponent | Promise<IRBComponent>
    }

    type IRBComponent = React.FC | React.ComponentClass

    interface IRBContext {
      options: IRBOptions
      modules: IRBModulesMap
      i18ns: IRBI18nsMap
      themes: IRBThemesMap
      packedModules: IRBModulesMap
      modulesConfig: IRBConfigMap
      routes: Array<IRBConfig>
      getModule: (name: string) => Promise<IRBModule | undefined>
    }

    interface IRBObject {
      [propName: string]: any
    }

    type IRBModule = IRBCompModule | IRBDecoModule | IRBObject

    interface IRBModuleFactory {
      (RB_CONTEXT: IRBContext): IRBModule
    }
  }
}
