import { render, shallow } from 'enzyme'
import React from 'react'
import notFoundFactory from '../index.entry'

const NotFound = notFoundFactory()

describe('common/notFound', () => {
  it('should render correctly', () => {
    const __ = key => key
    const wrapper = render(<NotFound __={__} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should invoke i18n translator', () => {
    const __ = jest.fn()
    const wrapper = shallow(
      <NotFound __={__} />
    )
    expect(wrapper.find('div').length).toBe(1)
    expect(__).toHaveBeenCalled()
  })
})
