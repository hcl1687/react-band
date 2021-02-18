// mock context in test env
if (process.env.NODE_ENV === 'test') {
  require.context = function () {
    return {} as __WebpackModuleApi.RequireContext
  }
}

const configReq = require && require.context('../modules', true, /^(.*)\/config.js$/)
let CONFIGS: IRBConfigFunctionMap = {}
let MERGED_CONFIGS: IRBConfigMap = {}

// for unit test
export function createCONFIGS (configReq: IRBConfigReq): IRBConfigFunctionMap {
  CONFIGS = {}
  MERGED_CONFIGS = {}
  configReq && configReq.keys && configReq.keys().forEach((key: string) => {
    const name = key.replace('config.js', '').replace(/\/$/, '')
    if (!name) {
      return
    }

    const module = configReq(key)
    CONFIGS[name] = module['default']
  })

  return CONFIGS
}

// init
createCONFIGS(<IRBConfigReq>configReq)

function isExclude (key: string, options: IRBOptions = {}): boolean {
  const { exclude } = options
  if (!exclude) {
    return false
  }

  if (typeof exclude === 'function') {
    return exclude(key)
  }

  if (Object.prototype.toString.call(exclude) === '[object RegExp]') {
    return (<RegExp>exclude).test(key)
  }
}

export default function getConfig (options: IRBOptions): IRBConfigMap {
  const parentKeys = {}
  // merge configs
  Object.keys(CONFIGS).forEach(key => {
    if (key === '.') {
      MERGED_CONFIGS[key] = CONFIGS[key]
      parentKeys[key] = 1
      return
    }

    // items like: ['.', 'common', 'home']
    const items: Array<string> = key.split('/')
    const category = items.length > 1 ? items[1] : ''
    let config: (IRBConfig | any) = {}
    let id: string = key
    config = items.reverse().reduce((obj, item) => {
      let ret: IRBConfig
      if (CONFIGS[id]) {
        ret = CONFIGS[id](options)
      }
      // id !== key is parent, id === key is tail
      // parent config has lower priority
      config = id !== key ? Object.assign({}, ret, obj)
        : Object.assign({}, obj, ret)
      id = id.replace(`/${item}`, '')
      parentKeys[id] = 1
      return config
    }, config)

    config.category = category

    MERGED_CONFIGS[key] = config
  })

  // remove parent config, only need leaf config
  Object.keys(parentKeys).forEach(key => {
    delete MERGED_CONFIGS[key]
  })

  const NAME_BASED_CONFIG: IRBConfigMap = {}
  Object.keys(MERGED_CONFIGS).forEach(key => {
    const config = MERGED_CONFIGS[key]
    config.key = key
    const name = config.name
    if (name && !config.disabled && !isExclude(key, options)) {
      NAME_BASED_CONFIG[name] = MERGED_CONFIGS[key]
    }
  })

  return NAME_BASED_CONFIG
}
