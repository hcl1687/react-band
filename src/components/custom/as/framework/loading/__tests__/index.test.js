import { render, shallow } from 'enzyme'
import React from 'react'
import loadingFactory from '../index.entry'

const Loading = loadingFactory()

describe('common/loading', () => {
  it('should render correctly', () => {
    const __ = key => key
    const wrapper = render(<Loading __={__} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should invoke i18n translator', () => {
    const __ = jest.fn()
    const wrapper = shallow(
      <Loading __={__} />
    )
    expect(wrapper.find('div').length).toBe(1)
    expect(__).toHaveBeenCalled()
  })
})
