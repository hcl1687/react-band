import React, { Component } from 'react'
import { mount, render } from 'enzyme'
import { ConfigContext } from 'antd/lib/config-provider'
import module from '../index.entry'
import utils from '~/../tests/utils/mockUtils'

const providerDecoFactory = module.entry
const context: RB.IRBContext = {
  options: {},
  modules: {},
  i18ns: {},
  themes: {},
  packedModules: {},
  modulesConfig: {},
  routes: [],
  getModule: async (key: string) => {
    if (key === 'utils') {
      return Promise.resolve(utils)
    } else if (key === 'antd') {
      return Promise.resolve({})
    }
  }
}

class Test extends Component {
  static contextType = ConfigContext

  render () {
    const context = this.context
    return <div>{context.locale.test}</div>
  }
}

describe('common/antd/provider', () => {
  it('should render correctly', async () => {
    const ProviderDeco = await providerDecoFactory(context)
    const RB_CONTEXT = {
      options: {
        locale: 'en'
      },
      i18ns: {
        antd: {
          en: {
            test: 'Test'
          }
        }
      },
      modules: {},
      themes: {},
      packedModules: {},
      modulesConfig: {},
      routes: [],
      getModule: async () => {
        return Promise.resolve({})
      }
    }
    const TestWithProviderDeco = await ProviderDeco(undefined, undefined, RB_CONTEXT)(Test)
    const wrapper = render(<TestWithProviderDeco />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should mount correctly', async () => {
    const ProviderDeco = await providerDecoFactory(context)
    const RB_CONTEXT = {
      options: {
        locale: 'en'
      },
      i18ns: {
        antd: {
          en: {
            test: 'Test'
          }
        }
      },
      modules: {},
      themes: {},
      packedModules: {},
      modulesConfig: {},
      routes: [],
      getModule: async () => {
        return Promise.resolve({})
      }
    }
    const TestWithProviderDeco = await ProviderDeco(undefined, undefined, RB_CONTEXT)(Test)
    const wrapper = mount(
      <TestWithProviderDeco />
    )
    expect(wrapper.text()).toEqual('Test')
  })
})

describe('common/antd/provider/production', () => {
  const NODE_ENV = process.env.NODE_ENV
  beforeAll(() => {
    process.env.NODE_ENV = 'production'
  })
  afterAll(() => {
    process.env.NODE_ENV = NODE_ENV
  })
  it('should render correctly in production env', async () => {
    const ProviderDeco = await providerDecoFactory(context)
    const RB_CONTEXT = {
      options: {
        locale: 'en'
      },
      i18ns: {
        antd: {
          en: {
            test: 'Test'
          }
        }
      },
      modules: {},
      themes: {},
      packedModules: {},
      modulesConfig: {},
      routes: [],
      getModule: async () => {
        return Promise.resolve({})
      }
    }
    const TestWithProviderDeco = await ProviderDeco(undefined, undefined, RB_CONTEXT)(Test)
    const wrapper = mount(
      <TestWithProviderDeco />
    )
    expect(wrapper.text()).toEqual('Test')
  })
})
