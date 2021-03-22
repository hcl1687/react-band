import PropTypes, { InferProps } from 'prop-types'
import { mount, render } from 'enzyme'
import React from 'react'
import module from '../index.entry'
import utils from '~/../tests/utils/mockUtils'

const themeDecoFactory = module.entry
const context = {
  options: {},
  modules: {},
  i18ns: {},
  themes: {},
  packedModules: {},
  modulesConfig: {},
  routes: [],
  getModule: async (key: string) => {
    if (key === 'utils') {
      return utils
    }
  }
}

interface ITheme {
  [propName: string]: string
}

function Test (props: InferProps<typeof Test.propTypes>) {
  const theme = props.theme as ITheme
  return <div className={theme.test}>test</div>
}
Test.propTypes = {
  theme: PropTypes.object.isRequired
}

describe('common/decorators/theme', () => {
  it('should render correctly', async () => {
    const themeDeco = await themeDecoFactory(context)
    const theme = {
      test: 'test'
    }
    const TestWithThemeDeco = await themeDeco({ theme, name: 'test' }, { name: '@theme' }, context)(Test)
    const wrapper = render(<TestWithThemeDeco />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should add theme correctly', async () => {
    const themeDeco = await themeDecoFactory(context)
    const theme = {
      test: 'test'
    }
    const TestWithThemeDeco = await themeDeco({ theme, name: 'test' }, { name: '@theme' }, context)(Test)
    const wrapper = mount(
      <TestWithThemeDeco />
    )
    expect(wrapper.find('.test').length).toBe(1)
  })
})

describe('common/decorators/theme/production', () => {
  const NODE_ENV = process.env.NODE_ENV
  beforeAll(() => {
    process.env.NODE_ENV = 'production'
  })
  afterAll(() => {
    process.env.NODE_ENV = NODE_ENV
  })
  it('should render correctly in production env', async () => {
    const themeDeco = await themeDecoFactory(context)
    const theme = {
      test: 'test'
    }
    const TestWithThemeDeco = await themeDeco({ theme, name: 'test' }, { name: '@theme' }, context)(Test)
    const wrapper = render(<TestWithThemeDeco />)
    expect(wrapper).toMatchSnapshot()
  })
})
