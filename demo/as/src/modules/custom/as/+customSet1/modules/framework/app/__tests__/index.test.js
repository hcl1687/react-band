import { mount, shallow } from 'enzyme'
import React from 'react'
import module from '../index.entry'

const appFactory = module.entry
const App = appFactory()

describe('custom/as/framework/app', () => {
  it('should render correctly', () => {
    const wrapper = shallow(<App>hello</App>)
    expect(wrapper).toMatchSnapshot()
  })

  it('should has app class', () => {
    const wrapper = mount(
      <App>hello</App>
    )
    expect(wrapper.find('.app').length).toBe(1)
  })
})
