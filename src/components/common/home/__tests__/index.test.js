import { mount, render } from 'enzyme'
import React from 'react'
import homeFactory from '../index.entry'

const Home = homeFactory()

describe('common/home', () => {
  it('should render correctly', () => {
    const __ = key => key
    const wrapper = render(<Home __={__} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should invoke i18n translator', () => {
    const __ = jest.fn()
    const wrapper = mount(
      <Home __={__} />
    )
    expect(wrapper.find('div').length).toBe(1)
    expect(__).toHaveBeenCalled()
  })
})
