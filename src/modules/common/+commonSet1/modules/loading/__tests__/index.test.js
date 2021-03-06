import { mount, shallow } from 'enzyme'
import React from 'react'
import module from '../index.entry'

const loadingFactory = module.entry
const Loading = loadingFactory()

describe('common/loading', () => {
  it('should render correctly', () => {
    const __ = key => key
    const theme = {
      loading: 'abc'
    }
    const wrapper = shallow(<Loading __={__} theme={theme} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should invoke i18n translator', () => {
    const __ = jest.fn()
    const theme = {
      loading: 'abc'
    }
    const wrapper = mount(
      <Loading __={__} theme={theme} />
    )
    expect(wrapper.find('div').length).toBe(1)
    expect(__).toHaveBeenCalled()
  })
})
