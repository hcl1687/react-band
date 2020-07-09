import { mount, render } from 'enzyme'
import PropTypes from 'prop-types'
import React from 'react'
import layoutDecoFactory from '../index.entry'
import utils from '~/../tests/utils/mockUtils'

function Test () {
  return <div>test</div>
}

function TestWrapper ({ children }) {
  return <div className='test-wrapper'>{children}</div>
}
TestWrapper.propTypes = {
  children: PropTypes.any
}

const context = {
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
      decoratorsConfig: {
        '@layout': {
          component: 'testWrapper'
        }
      }
    }

    const TestWithLayoutDeco = await LayoutDeco(targetConfig)(Test)
    const wrapper = render(<TestWithLayoutDeco />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should mount correctly', async () => {
    const LayoutDeco = await layoutDecoFactory(context)
    const targetConfig = {
      decoratorsConfig: {
        '@layout': {
          component: 'testWrapper'
        }
      }
    }

    const TestWithLayoutDeco = await LayoutDeco(targetConfig)(Test)
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
      decoratorsConfig: {
        '@layout': {
          component: 'testWrapper'
        }
      }
    }

    const TestWithLayoutDeco = await LayoutDeco(targetConfig)(Test)
    const wrapper = render(<TestWithLayoutDeco />)
    expect(wrapper).toMatchSnapshot()
  })
})
