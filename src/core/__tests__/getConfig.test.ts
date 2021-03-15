import getConfig, { createCONFIGS } from '../getConfig'

const configReq = function (key: string) {
  const factory = {
    './common/antd/components/config.ts': {
      default: () => {}
    },
    './common/antd/decorators/provider/config.ts': {
      default: () => {}
    },
    './common/app/config.ts': {
      default: () => {}
    },
    './common/config.ts': {
      default: () => {}
    },
    './common/constants/config.ts': {
      default: () => {}
    },
    './common/decorators/config.ts': {
      default: () => {}
    },
    './common/decorators/i18n/config.ts': {
      default: () => {}
    },
    './common/decorators/layout/config.ts': {
      default: () => {}
    },
    './common/decorators/localStore/config.ts': {
      default: () => {}
    },
    './common/decorators/notice/config.ts': {
      default: () => {}
    },
    './common/decorators/theme/config.ts': {
      default: () => {}
    },
    './common/home/config.ts': {
      default: () => {}
    },
    './common/layout/config.ts': {
      default: () => {}
    },
    './common/loading/config.ts': {
      default: () => {}
    },
    './common/notFound/config.ts': {
      default: () => {}
    },
    './common/redux/provider/config.ts': {
      default: () => {}
    },
    './common/redux/store/config.ts': {
      default: () => {}
    },
    './common/redux/utils/config.ts': {
      default: () => {}
    },
    './common/utils/config.ts': {
      default: () => {}
    }
  }

  return factory[key]
}

configReq.keys = () => ([
  './common/antd/components/config.ts',
  './common/antd/decorators/provider/config.ts',
  './common/app/config.ts',
  './common/config.ts',
  './common/constants/config.ts',
  './common/decorators/config.ts',
  './common/decorators/i18n/config.ts',
  './common/decorators/layout/config.ts',
  './common/decorators/localStore/config.ts',
  './common/decorators/notice/config.ts',
  './common/decorators/theme/config.ts',
  './common/home/config.ts',
  './common/layout/config.ts',
  './common/loading/config.ts',
  './common/notFound/config.ts',
  './common/redux/provider/config.ts',
  './common/redux/store/config.ts',
  './common/redux/utils/config.ts',
  './common/utils/config.ts'
])

describe('core/getConfig', () => {
  it('should render correctly', () => {
    createCONFIGS(configReq)
    const config = getConfig({})
    expect(config).toMatchSnapshot()
  })

  it('only show leaf config', () => {
    const configReq1 = function (key: string) {
      const factory = {
        './common/config.ts': {
          default: () => ({ name: 'common' })
        },
        './common/home/config.ts': {
          default: () => ({ name: 'home' })
        }
      }

      return factory[key]
    }
    configReq1.keys = () => ([
      './common/config.ts',
      './common/home/config.ts'
    ])
    createCONFIGS(configReq1)
    const config = getConfig({})
    expect(config.common).toBe(undefined)
    expect(config.home).toBeDefined()
  })

  it('support exclude option by function', () => {
    const configReq1 = function (key: string) {
      const factory = {
        './common/config.ts': {
          default: () => ({ name: 'common' })
        },
        './common/home/config.ts': {
          default: () => ({ name: 'home' })
        }
      }

      return factory[key]
    }
    configReq1.keys = () => ([
      './common/config.ts',
      './common/home/config.ts'
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
        './common/config.ts': {
          default: () => ({ name: 'common' })
        },
        './common/home/config.ts': {
          default: () => ({ name: 'home' })
        }
      }

      return factory[key]
    }
    configReq1.keys = () => ([
      './common/config.ts',
      './common/home/config.ts'
    ])
    createCONFIGS(configReq1)
    const config = getConfig({
      exclude: /home/
    })
    expect(config.common).toBe(undefined)
    expect(config.home).toBe(undefined)
  })

  it('should not return root config', () => {
    const configReq1 = function (key: string) {
      const factory = {
        './config.ts': {
          default: () => ({ name: 'root' })
        }
      }

      return factory[key]
    }
    configReq1.keys = () => ([
      './config.ts'
    ])
    createCONFIGS(configReq1)
    const config = getConfig({})
    expect(config.root).toBe(undefined)
  })

  it('should inherit config', () => {
    const configReq1 = function (key) {
      const factory = {
        './config.ts': {
          default: () => ({ name: 'root', a: 1 })
        },
        './common/config.ts': {
          default: () => ({ name: 'common', b: 2 })
        },
        './common/home/config.ts': {
          default: () => ({ name: 'home' })
        }
      }

      return factory[key]
    }
    configReq1.keys = () => ([
      './config.ts',
      './common/config.ts',
      './common/home/config.ts'
    ])
    createCONFIGS(configReq1)
    const config = getConfig({})
    expect(config.home).toBeDefined()
    expect(config.home).toEqual({
      a: 1,
      b: 2,
      category: 'common',
      key: './common/home',
      name: 'home',
      type: 'component'
    })
  })

  it('support disable module', () => {
    const configReq1 = function (key: string) {
      const factory = {
        './common/config.ts': {
          default: () => ({ disabled: true })
        },
        './common/home/config.ts': {
          default: () => ({ name: 'home' })
        }
      }

      return factory[key]
    }
    configReq1.keys = () => ([
      './common/config.ts',
      './common/home/config.ts'
    ])
    createCONFIGS(configReq1)
    const config = getConfig({})
    expect(config.home).toBe(undefined)
  })
})
