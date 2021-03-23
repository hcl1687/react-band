import PropTypes, { InferProps } from 'prop-types'
import { mount, render } from 'enzyme'
import React from 'react'
import module from '../index.entry'
import utils from '~/../tests/utils/mockUtils'

const i18nDecoFactory = module.entry
const context: RB.IRBContext = {
  modules: {},
  i18ns: {},
  themes: {},
  packedModules: {},
  modulesConfig: {},
  routes: [],
  getModule: async (key) => {
    if (key === 'utils') {
      return utils
    }
  },
  options: {
    locale: 'en'
  }
}
function Test ({ __ }: InferProps<typeof Test.propTypes>) {
  return <div>{__('test')}</div>
}
Test.propTypes = {
  __: PropTypes.func.isRequired
}

describe('common/decorators/i18n', () => {
  it('should render correctly', async () => {
    const I18nDeco = await i18nDecoFactory(context)
    const i18n = {
      test: 'Test'
    }

    const TestWithI18nDeco = await I18nDeco({ i18n, name: 'test' }, { name: '@i18n' }, context)(Test)
    const wrapper = render(<TestWithI18nDeco />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should translate i18n correctly', async () => {
    const I18nDeco = await i18nDecoFactory(context)
    const i18n = {
      test: 'Test'
    }
    const TestWithI18nDeco = await I18nDeco({ i18n, name: 'test' }, { name: '@i18n' }, context)(Test)
    const wrapper = mount(
      <TestWithI18nDeco />
    )
    expect(wrapper.text()).toEqual('Test')
  })
})

describe('common/decorators/i18n/production', () => {
  const NODE_ENV = process.env.NODE_ENV
  beforeAll(() => {
    process.env.NODE_ENV = 'production'
  })
  afterAll(() => {
    process.env.NODE_ENV = NODE_ENV
  })
  it('should render correctly in production env', async () => {
    const I18nDeco = await i18nDecoFactory(context)
    const i18n = {
      test: 'Test'
    }
    const TestWithI18nDeco = await I18nDeco({ i18n, name: 'test' }, { name: '@i18n' }, context)(Test)
    const wrapper = render(<TestWithI18nDeco />)
    expect(wrapper).toMatchSnapshot()
  })
})
