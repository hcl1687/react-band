import { render, shallow } from 'enzyme'
import React from 'react'
import notFoundFactory from '../index.entry'

const NotFound = notFoundFactory()

describe('common/notFound', () => {
  it('should render correctly', () => {
    const __ = key => key
    const theme = {
      notFound: 'abc'
    }
    const wrapper = render(<NotFound __={__} theme={theme} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should invoke i18n translator', () => {
    const __ = jest.fn()
    const theme = {
      notFound: 'abc'
    }
    const wrapper = shallow(
      <NotFound __={__} theme={theme} />
    )
    expect(wrapper.find('div').length).toBe(1)
    expect(__).toHaveBeenCalled()
  })
})
