import React, { Component } from 'react'
import { mount, render } from 'enzyme'
import { ReactReduxContext } from 'react-redux'
import providerDecoFactory from '../index.entry'
import utils from '~/../tests/utils/mockUtils'

const context = {
  getComponent: async (key) => {
    if (key === 'utils') {
      return utils
    }
  }
}
class Test extends Component {
  static contextType = ReactReduxContext

  render () {
    const storeState = this.context.store.getState()
    const keys = Object.keys(storeState)
    return <div>{keys[0]}</div>
  }
}

describe('common/redux/provider', () => {
  it('should render correctly', async () => {
    const ProviderDeco = await providerDecoFactory(context)
    const TestWithProviderDeco = await ProviderDeco({})(Test)
    const wrapper = render(<TestWithProviderDeco />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should translate i18n correctly', async () => {
    const ProviderDeco = await providerDecoFactory(context)
    const TestWithProviderDeco = await ProviderDeco({})(Test)
    const wrapper = mount(
      <TestWithProviderDeco />
    )
    expect(wrapper.text()).toEqual('@ini')
  })
})

describe('common/redux/provider/production', () => {
  const NODE_ENV = process.env.NODE_ENV
  beforeAll(() => {
    process.env.NODE_ENV = 'production'
  })
  afterAll(() => {
    process.env.NODE_ENV = NODE_ENV
  })
  it('should render correctly in production env', async () => {
    const ProviderDeco = await providerDecoFactory(context)
    const TestWithProviderDeco = await ProviderDeco({})(Test)
    const wrapper = render(<TestWithProviderDeco />)
    expect(wrapper).toMatchSnapshot()
  })
})
