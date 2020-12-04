import getConfig, { createCONFIGS } from '../getConfig'

const configReq = function (key) {
  const factory = {
    './common/antd/components/config.js': {
      default: () => {}
    },
    './common/antd/decorators/provider/config.js': {
      default: () => {}
    },
    './common/app/config.js': {
      default: () => {}
    },
    './common/config.js': {
      default: () => {}
    },
    './common/constants/config.js': {
      default: () => {}
    },
    './common/decorators/config.js': {
      default: () => {}
    },
    './common/decorators/i18n/config.js': {
      default: () => {}
    },
    './common/decorators/layout/config.js': {
      default: () => {}
    },
    './common/decorators/localStore/config.js': {
      default: () => {}
    },
    './common/decorators/notice/config.js': {
      default: () => {}
    },
    './common/decorators/theme/config.js': {
      default: () => {}
    },
    './common/home/config.js': {
      default: () => {}
    },
    './common/layout/config.js': {
      default: () => {}
    },
    './common/loading/config.js': {
      default: () => {}
    },
    './common/notFound/config.js': {
      default: () => {}
    },
    './common/redux/provider/config.js': {
      default: () => {}
    },
    './common/redux/store/config.js': {
      default: () => {}
    },
    './common/redux/utils/config.js': {
      default: () => {}
    },
    './common/utils/config.js': {
      default: () => {}
    }
  }

  return factory[key]
}

configReq.keys = () => ([
  './common/antd/components/config.js',
  './common/antd/decorators/provider/config.js',
  './common/app/config.js',
  './common/config.js',
  './common/constants/config.js',
  './common/decorators/config.js',
  './common/decorators/i18n/config.js',
  './common/decorators/layout/config.js',
  './common/decorators/localStore/config.js',
  './common/decorators/notice/config.js',
  './common/decorators/theme/config.js',
  './common/home/config.js',
  './common/layout/config.js',
  './common/loading/config.js',
  './common/notFound/config.js',
  './common/redux/provider/config.js',
  './common/redux/store/config.js',
  './common/redux/utils/config.js',
  './common/utils/config.js'
])

describe('core/getConfig', () => {
  it('should render correctly', () => {
    createCONFIGS(configReq)
    const config = getConfig()
    expect(config).toMatchSnapshot()
  })

  it('only show leaf config', () => {
    const configReq1 = function (key) {
      const factory = {
        './common/config.js': {
          default: () => ({ name: 'common' })
        },
        './common/home/config.js': {
          default: () => ({ name: 'home' })
        }
      }

      return factory[key]
    }
    configReq1.keys = () => ([
      './common/config.js',
      './common/home/config.js'
    ])
    createCONFIGS(configReq1)
    const config = getConfig()
    expect(config.common).toBe(undefined)
    expect(config.home).toBeDefined()
  })

  it('support exclude option by function', () => {
    const configReq1 = function (key) {
      const factory = {
        './common/config.js': {
          default: () => ({ name: 'common' })
        },
        './common/home/config.js': {
          default: () => ({ name: 'home' })
        }
      }

      return factory[key]
    }
    configReq1.keys = () => ([
      './common/config.js',
      './common/home/config.js'
    ])
    createCONFIGS(configReq1)
    const config = getConfig({
      exclude: function (key) {
        return key === './common'
      }
    })
    expect(config.home).toBeDefined()
    expect(config.common).toBe(undefined)
  })

  it('support exclude option by regular expression', () => {
    const configReq1 = function (key) {
      const factory = {
        './common/config.js': {
          default: () => ({ name: 'common' })
        },
        './common/home/config.js': {
          default: () => ({ name: 'home' })
        }
      }

      return factory[key]
    }
    configReq1.keys = () => ([
      './common/config.js',
      './common/home/config.js'
    ])
    createCONFIGS(configReq1)
    const config = getConfig({
      exclude: /home/
    })
    expect(config.common).toBe(undefined)
    expect(config.home).toBe(undefined)
  })

  it('should not return root config', () => {
    const configReq1 = function (key) {
      const factory = {
        './config.js': {
          default: () => ({ name: 'root' })
        }
      }

      return factory[key]
    }
    configReq1.keys = () => ([
      './config.js'
    ])
    createCONFIGS(configReq1)
    const config = getConfig()
    expect(config.root).toBe(undefined)
  })

  it('should inherit config', () => {
    const configReq1 = function (key) {
      const factory = {
        './config.js': {
          default: () => ({ name: 'root', a: 1 })
        },
        './common/config.js': {
          default: () => ({ name: 'common', b: 2 })
        },
        './common/home/config.js': {
          default: () => ({ name: 'home' })
        }
      }

      return factory[key]
    }
    configReq1.keys = () => ([
      './config.js',
      './common/config.js',
      './common/home/config.js'
    ])
    createCONFIGS(configReq1)
    const config = getConfig()
    expect(config.home).toBeDefined()
    expect(config.home).toEqual({
      a: 1,
      b: 2,
      category: 'common',
      key: './common/home',
      name: 'home'
    })
  })

  it('support disable module', () => {
    const configReq1 = function (key) {
      const factory = {
        './common/config.js': {
          default: () => ({ disabled: true })
        },
        './common/home/config.js': {
          default: () => ({ name: 'home' })
        }
      }

      return factory[key]
    }
    configReq1.keys = () => ([
      './common/config.js',
      './common/home/config.js'
    ])
    createCONFIGS(configReq1)
    const config = getConfig()
    expect(config.home).toBe(undefined)
  })
})
