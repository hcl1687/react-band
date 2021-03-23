import { render, shallow } from 'enzyme'
import React from 'react'
import module from '../index.entry'

const homeFactory = module.entry
const Home = homeFactory()

describe('custom/as/pages/home', () => {
  it('should render correctly', () => {
    const __ = key => key
    const theme = {
      home: 'abc'
    }
    const wrapper = render(<Home __={__} theme={theme} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should invoke i18n translator', () => {
    const __ = jest.fn()
    const theme = {
      home: 'abc'
    }
    const wrapper = shallow(
      <Home __={__} theme={theme} />
    )
    expect(wrapper.find('div').length).toBe(1)
    expect(__).toHaveBeenCalled()
  })

  it('should invoke i18n translator in production env', () => {
    const NODE_ENV = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
    const __ = jest.fn()
    const theme = {
      home: 'abc'
    }
    const wrapper = shallow(
      <Home __={__} theme={theme} />
    )
    expect(wrapper.find('div').length).toBe(1)
    expect(__.mock.calls.length).toBe(2)
    expect(__.mock.calls[1][0]).toBe('jsonplaceholderTip')
    process.env.NODE_ENV = NODE_ENV
  })
})
