import { mount, shallow } from 'enzyme'
import React from 'react'
import module from '../index.entry'
import tools from '~/../tests/utils/index'

const loadingFactory = module.entry
describe('common/loading', () => {
  it('should render correctly', async () => {
    const context = {
      getModule: (type) => {
        if (type === 'lottie') {
          return {
            loadAnimation: () => {}
          }
        }
      }
    }
    const Loading = await loadingFactory(context)
    const __ = key => key
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
      getModule: (type) => {
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
