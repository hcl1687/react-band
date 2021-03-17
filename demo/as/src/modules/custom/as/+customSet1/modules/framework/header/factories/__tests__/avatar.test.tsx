import React from 'react'
import avatarFactory from '../avatar'
import { mount } from 'enzyme'

describe('custom/as/framework/header/factories/avatar', () => {
  it('should render correctly', async () => {
    const RB_CONTEXT: RB.IRBContext = {
      modules: {},
      i18ns: {},
      themes: {},
      packedModules: {},
      modulesConfig: {},
      routes: [],
      options: {
        theme: 'default'
      },
      getModule: async (type: string) => {
        if (type === 'asUtils') {
          return {
            getUrlByKey: (key) => {
              return `https://img.hcl1687.com/${key}`
            }
          }
        }
      }
    }
    const Avatar = await avatarFactory(RB_CONTEXT)
    const props = {
      theme: {
        avatar: 'avatar1'
      },
      user: {
        userType: 'Teacher',
        avatar: '1.png'
      }
    }

    const wrapper = mount(<Avatar {...props} />)

    expect(wrapper.find('.avatar1').length).toBe(1)
    expect(wrapper.find('.avatar1').prop('src')).toBe('https://img.hcl1687.com/1.png')
  })

  it('should show default teacher image', async () => {
    const RB_CONTEXT = {
      modules: {},
      i18ns: {},
      themes: {},
      packedModules: {},
      modulesConfig: {},
      routes: [],
      options: {
        theme: 'default'
      },
      getModule: async (type: string) => {
        if (type === 'asUtils') {
          return {
            getUrlByKey: (key) => {
              return `https://img.hcl1687.com/${key}`
            }
          }
        }
      }
    }
    const Avatar = await avatarFactory(RB_CONTEXT)
    const props = {
      theme: {
        avatar: 'avatar1'
      },
      user: {
        userType: 'Teacher',
        avatar: ''
      }
    }

    const wrapper = mount(<Avatar {...props} />)

    expect(wrapper.find('.avatar1').length).toBe(1)
    expect(wrapper.find('.avatar1').prop('src')).toBe('themes/default/img_Teacher.png')
  })

  it('should show default student image', async () => {
    const RB_CONTEXT = {
      modules: {},
      i18ns: {},
      themes: {},
      packedModules: {},
      modulesConfig: {},
      routes: [],
      options: {
        theme: 'default'
      },
      getModule: async (type: string) => {
        if (type === 'asUtils') {
          return {
            getUrlByKey: (key) => {
              return `https://img.hcl1687.com/${key}`
            }
          }
        }
      }
    }
    const Avatar = await avatarFactory(RB_CONTEXT)
    const props = {
      theme: {
        avatar: 'avatar1'
      },
      user: {
        userType: 'Student',
        avatar: ''
      }
    }

    const wrapper = mount(<Avatar {...props} />)

    expect(wrapper.find('.avatar1').length).toBe(1)
    expect(wrapper.find('.avatar1').prop('src')).toBe('themes/default/img_Student.png')
    expect(typeof wrapper.find('.avatar1').prop('onError')).toBe('function')
    const handleError = wrapper.find('.avatar1').prop('onError')
    const fakeE = {
      target: {
        src: ''
      }
    }
    handleError(fakeE as unknown as React.SyntheticEvent<HTMLImageElement, Event>)
    expect(fakeE.target.src).toBe('themes/default/img_Student.png')
  })
})
