import { render, shallow } from 'enzyme'
import React from 'react'
import module from '../index.entry'

const App = module.entry()

describe('common/app', () => {
  it('should render correctly', () => {
    const wrapper = render(<App>hello</App>)
    expect(wrapper).toMatchSnapshot()
  })

  it('should has app class', () => {
    const wrapper = shallow(
      <App>hello</App>
    )
    expect(wrapper.find('.app').length).toBe(1)
  })
})
