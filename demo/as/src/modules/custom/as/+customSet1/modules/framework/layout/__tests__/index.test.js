import React from 'react'
import layoutFactory from '../index.entry'
import { mount } from 'enzyme'

const RB_CONTEXT = {
  getModule: (type) => {
    if (type === 'menu') {
      return (props) => <div className='menu-comp' data-props={props} />
    } else if (type === 'header') {
      return (props) => <div className='header-comp' data-props={props} />
    } else if (type === 'breadcrumb') {
      return (props) => <div className='breadcrumb-comp' data-props={props} />
    }
  }
}

const DEFAULT_PROPS = {
  theme: {
    collapsed: 'collapsed',
    expand: 'expand'
  },
  LEFT_STATUS: true,
  LAYOUT_MODE: 'left'
}

describe('custom/as/framework/layout', () => {
  it('should render correctly', async () => {
    const Layout = await layoutFactory(RB_CONTEXT)
    const props = {
      ...DEFAULT_PROPS
    }

    const wrapper = mount(<Layout {...props}><div className='test'>test</div></Layout>)

    expect(wrapper.find('.layout').length).toBe(1)
    expect(wrapper.find('.header').length).toBe(1)
    expect(wrapper.find('.nav').length).toBe(0)
    expect(wrapper.find('.content').length).toBe(1)
    expect(wrapper.find('.left').length).toBe(1)
    expect(wrapper.find('.right').length).toBe(1)
    expect(wrapper.find('.main').length).toBe(1)
    expect(wrapper.find('.test').length).toBe(1)

    expect(wrapper.find('.layout').prop('className')).toBe('layout')
    expect(wrapper.find('.left').prop('className')).toBe('left')
    expect(wrapper.find('.right').prop('className')).toBe('right')
    expect(wrapper.find('.menu-comp').prop('data-props').expand).toBe(true)
  })

  it('should render top mode correctly', async () => {
    const Layout = await layoutFactory(RB_CONTEXT)
    const props = {
      ...DEFAULT_PROPS,
      LAYOUT_MODE: 'top'
    }

    const wrapper = mount(<Layout {...props}><div className='test'>test</div></Layout>)

    expect(wrapper.find('.layout').length).toBe(1)
    expect(wrapper.find('.header').length).toBe(1)
    expect(wrapper.find('.nav').length).toBe(1)
    expect(wrapper.find('.nav-inner').length).toBe(1)
    expect(wrapper.find('.content').length).toBe(1)
    expect(wrapper.find('.left').length).toBe(0)
    expect(wrapper.find('.right').length).toBe(0)
    expect(wrapper.find('.middle').length).toBe(1)
    expect(wrapper.find('.main').length).toBe(1)
    expect(wrapper.find('.test').length).toBe(1)

    expect(wrapper.find('.layout').prop('className')).toBe('layout top-mode')
    expect(wrapper.find('.menu-comp').prop('data-props').expand).toBe(true)
    expect(wrapper.find('.menu-comp').prop('data-props').mode).toBe('horizontal')
  })

  it('should render top mode correctly', async () => {
    const Layout = await layoutFactory(RB_CONTEXT)
    const props = {
      ...DEFAULT_PROPS,
      LAYOUT_MODE: 'top'
    }

    const wrapper = mount(<Layout {...props}><div className='test'>test</div></Layout>)

    expect(wrapper.find('.layout').length).toBe(1)
    expect(wrapper.find('.header').length).toBe(1)
    expect(wrapper.find('.nav').length).toBe(1)
    expect(wrapper.find('.nav-inner').length).toBe(1)
    expect(wrapper.find('.content').length).toBe(1)
    expect(wrapper.find('.left').length).toBe(0)
    expect(wrapper.find('.right').length).toBe(0)
    expect(wrapper.find('.middle').length).toBe(1)
    expect(wrapper.find('.main').length).toBe(1)
    expect(wrapper.find('.test').length).toBe(1)

    expect(wrapper.find('.layout').prop('className')).toBe('layout top-mode')
    expect(wrapper.find('.menu-comp').prop('data-props').expand).toBe(true)
    expect(wrapper.find('.menu-comp').prop('data-props').mode).toBe('horizontal')
  })
})
