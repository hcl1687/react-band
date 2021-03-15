import { mount, render } from 'enzyme'
import PropTypes from 'prop-types'
import React from 'react'
import themeDecoFactory from '../index.entry'
import utils from '~/../tests/utils/mockUtils'

const context = {
  getModule: async (key) => {
    if (key === 'utils') {
      return utils
    }
  }
}
function Test ({ theme }) {
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
    const TestWithThemeDeco = themeDeco({ theme })(Test)
    const wrapper = render(<TestWithThemeDeco />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should add theme correctly', async () => {
    const themeDeco = await themeDecoFactory(context)
    const theme = {
      test: 'test'
    }
    const TestWithThemeDeco = themeDeco({ theme })(Test)
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
    const TestWithThemeDeco = themeDeco({ theme })(Test)
    const wrapper = render(<TestWithThemeDeco />)
    expect(wrapper).toMatchSnapshot()
  })
})
