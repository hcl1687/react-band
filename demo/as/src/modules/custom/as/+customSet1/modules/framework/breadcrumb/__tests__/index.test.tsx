import React from 'react'
import module from '../index.entry'
import { mount } from 'enzyme'

const breadcrumbFactory = module.entry
const mockHistoryPush = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush
  })
}))

describe('custom/as/framework/breadcrumb', () => {
  it('should render correctly', async () => {
    const Breadcrumb = await breadcrumbFactory()
    const props = {
      theme: {
        item: 'item',
        sep: 'sep',
        breadcrumb: 'breadcrumb-1'
      },
      BREADCRUMBS: [{ name: 'test1' }, { name: 'test2' }]
    }
    const wrapper = mount(<Breadcrumb {...props} />)

    expect(wrapper.find('.breadcrumb').length).toBe(1)
    expect(wrapper.find('.item').length).toBe(2)
    expect(wrapper.find('.sep').length).toBe(1)
    expect(wrapper.find('.item:first-child').text()).toBe('test1')
    expect(wrapper.find('.item:last-child').text()).toBe('test2')
  })

  it('do not show breadcrumb if items length is less than 2', async () => {
    const Breadcrumb = await breadcrumbFactory()
    const props = {
      theme: {
        item: 'item',
        sep: 'sep',
        breadcrumb: 'breadcrumb-1'
      },
      BREADCRUMBS: [{ name: 'test1' }]
    }
    const wrapper = mount(<Breadcrumb {...props} />)

    expect(wrapper.find('.breadcrumb').length).toBe(0)
    expect(wrapper.find('.item').length).toBe(0)
    expect(wrapper.find('.sep').length).toBe(0)
  })

  it('check onClick with path', async () => {
    const Breadcrumb = await breadcrumbFactory()
    const props = {
      theme: {
        item: 'item',
        sep: 'sep',
        breadcrumb: 'breadcrumb-1'
      },
      BREADCRUMBS: [{
        name: 'test1',
        path: '/test'
      }, {
        name: 'test2'
      }]
    }
    const wrapper = mount(<Breadcrumb {...props} />)

    expect(wrapper.find('.breadcrumb').length).toBe(1)
    expect(wrapper.find('.item').length).toBe(2)
    expect(wrapper.find('.sep').length).toBe(1)
    expect(wrapper.find('.item:first-child').text()).toBe('test1')
    expect(wrapper.find('.item:last-child').text()).toBe('test2')
    wrapper.find('.item:first-child').simulate('click')
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/test')
  })

  it('check onClick with onClick', async () => {
    const Breadcrumb = await breadcrumbFactory()
    const test1Click = jest.fn()
    const test2Click = jest.fn()
    const props = {
      theme: {
        item: 'item',
        sep: 'sep',
        breadcrumb: 'breadcrumb-1'
      },
      BREADCRUMBS: [{
        name: 'test1',
        onClick: test1Click
      }, {
        name: 'test2',
        onClick: test2Click
      }]
    }
    const wrapper = mount(<Breadcrumb {...props} />)

    expect(wrapper.find('.breadcrumb').length).toBe(1)
    expect(wrapper.find('.item').length).toBe(2)
    expect(wrapper.find('.sep').length).toBe(1)
    expect(wrapper.find('.item:first-child').text()).toBe('test1')
    expect(wrapper.find('.item:last-child').text()).toBe('test2')
    wrapper.find('.item:last-child').simulate('click')
    wrapper.find('.item:first-child').simulate('click')
    expect(test2Click.mock.calls.length).toBe(0)
    expect(test1Click.mock.calls.length).toBe(1)
  })
})
