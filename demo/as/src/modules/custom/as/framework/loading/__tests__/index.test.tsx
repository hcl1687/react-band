import { mount, shallow } from 'enzyme'
import React from 'react'
import loadingFactory from '../index.entry'
import tools from '~/../tests/utils/index'

describe('common/loading', () => {
  it('should render correctly', async () => {
    const context = {
      options: {},
      modules: {},
      i18ns: {},
      themes: {},
      packedModules: {},
      modulesConfig: {},
      routes: [],
      getModule: async (type: string) => {
        if (type === 'lottie') {
          return {
            loadAnimation: () => {}
          }
        }
      }
    }
    const Loading = await loadingFactory(context)
    const __ = (key: string) => key
    const theme = {
      loading: '',
      lottie: '',
      tip: ''
    }

    const wrapper = shallow(<Loading __={__} theme={theme} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should invoke i18n translator', async () => {
    const loadAnimation = jest.fn()
    const context = {
      options: {},
      modules: {},
      i18ns: {},
      themes: {},
      packedModules: {},
      modulesConfig: {},
      routes: [],
      getModule: async (type: string) => {
        if (type === 'lottie') {
          return {
            loadAnimation
          }
        }
      }
    }
    const Loading = await loadingFactory(context)
    const __ = jest.fn()
    const theme = {
      loading: '',
      lottie: '',
      tip: ''
    }
    const wrapper = mount(
      <Loading __={__} theme={theme} />
    )
    expect(wrapper.find('div').length).toBe(3)
    expect(__).toHaveBeenCalled()

    return tools.delay(() => {
      expect(loadAnimation).toHaveBeenCalled()
    }, 4000)
  })
})