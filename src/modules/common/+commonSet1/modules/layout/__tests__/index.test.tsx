import { render, shallow } from 'enzyme'
import React from 'react'
import module from '../index.entry'

const Layout = module.entry()

describe('common/layout', () => {
  it('should render correctly', () => {
    const theme = { layout: 'test' }
    const wrapper = render(<Layout theme={theme}>hello</Layout>)
    expect(wrapper).toMatchSnapshot()
  })

  it('should has test class', () => {
    const theme = { layout: 'test' }
    const wrapper = shallow(
      <Layout theme={theme}>hello</Layout>
    )
    expect(wrapper.find('.test').length).toBe(1)
    expect(wrapper.text()).toEqual('hello')
  })
})
