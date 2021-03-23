import { render, shallow } from 'enzyme'
import React from 'react'
import module from '../index.entry'

const homeFactory = module.entry
const Home = homeFactory()

describe('common/home', () => {
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
})
