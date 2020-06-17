import { mount, render } from 'enzyme'
import React from 'react'
import homeFactory from '../index.entry'

const Home = homeFactory()

describe('demo/basic/home', () => {
  it('should render correctly', () => {
    const __ = key => key
    const his = {
      push: key => key
    }
    const wrapper = render(<Home __={__} history={his} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should invoke i18n translator', () => {
    const __ = jest.fn()
    const his = {
      push: jest.fn()
    }
    const wrapper = mount(
      <Home __={__} history={his} />
    )
    expect(wrapper.find('div').length).toBe(2)
    expect(wrapper.find('button').length).toBe(1)
    expect(__).toHaveBeenCalled()
    wrapper.find('button').simulate('click')
    expect(his.push).toHaveBeenCalled()
  })
})
