import PropTypes, { InferProps } from 'prop-types'
import { mount, render } from 'enzyme'
import React from 'react'
import module from '../index.entry'
import utils from '~/../tests/utils/mockUtils'

const layoutDecoFactory = module.entry
function Test () {
  return <div>test</div>
}

function TestWrapper ({ children }: InferProps<typeof TestWrapper.propTypes>) {
  return <div className='test-wrapper'>{children}</div>
}
TestWrapper.propTypes = {
  children: PropTypes.any
}

const context: RB.IRBContext = {
  options: {},
  modules: {},
  i18ns: {},
  themes: {},
  packedModules: {},
  modulesConfig: {},
  routes: [],
  getModule: async (key) => {
    if (key === 'utils') {
      return utils
    } else if (key === 'testWrapper') {
      return TestWrapper
    }
  }
}

describe('common/decorators/layout', () => {
  it('should render correctly', async () => {
    const LayoutDeco = await layoutDecoFactory(context)
    const targetConfig = {
      name: 'test',
      decoratorsConfig: {
        '@layout': {
          component: 'testWrapper'
        }
      }
    }

    const TestWithLayoutDeco = await LayoutDeco(targetConfig, { name: '@layout' }, context)(Test)
    const wrapper = render(<TestWithLayoutDeco />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should mount correctly', async () => {
    const LayoutDeco = await layoutDecoFactory(context)
    const targetConfig = {
      name: 'test',
      decoratorsConfig: {
        '@layout': {
          component: 'testWrapper'
        }
      }
    }

    const TestWithLayoutDeco = await LayoutDeco(targetConfig, { name: '@layout' }, context)(Test)
    const wrapper = mount(
      <TestWithLayoutDeco />
    )
    expect(wrapper.find('.test-wrapper').text()).toEqual('test')
    expect(wrapper.find('.test-wrapper').length).toBe(1)
  })
})

describe('common/decorators/layout/production', () => {
  const NODE_ENV = process.env.NODE_ENV
  beforeAll(() => {
    process.env.NODE_ENV = 'production'
  })
  afterAll(() => {
    process.env.NODE_ENV = NODE_ENV
  })
  it('should render correctly in production env', async () => {
    const LayoutDeco = await layoutDecoFactory(context)
    const targetConfig = {
      name: 'test',
      decoratorsConfig: {
        '@layout': {
          component: 'testWrapper'
        }
      }
    }

    const TestWithLayoutDeco = await LayoutDeco(targetConfig, { name: '@layout' }, context)(Test)
    const wrapper = render(<TestWithLayoutDeco />)
    expect(wrapper).toMatchSnapshot()
  })
})
