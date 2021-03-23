import React from 'react'
import module from '../index.entry'
import { mount } from 'enzyme'

const multiViewFactory = module.entry

function getQueryParams (qs = '') {
  qs = qs.split('+').join(' ')

  const params = {}
  const re = /[?&]?([^=]+)=([^&]*)/g
  let tokens = re.exec(qs)

  while (tokens) {
    const key = decodeURIComponent(tokens[1])
    const val = decodeURIComponent(tokens[2])
    params[key] = val
    tokens = re.exec(qs)
  }

  return params
}

const RB_CONTEXT: RB.IRBContext = {
  options: {},
  modules: {},
  i18ns: {},
  themes: {},
  packedModules: {},
  modulesConfig: {},
  routes: [],
  getModule: async (type: string) => {
    if (type === 'asUtils') {
      return {
        getQueryParams
      }
    }
  }
}

describe('custom/as/components/multiView', () => {
  it('should render correctly', async () => {
    const MultiView = await multiViewFactory(RB_CONTEXT)
    const Test = (props) => {
      return <div className='child2' data-props={props}>test</div>
    }
    const fakeLocation = {
      search: ''
    }

    const wrapper = mount(
      <MultiView location={fakeLocation}>
        <div className='child1'>div1</div>
        <Test />
      </MultiView>
    )

    expect(wrapper.find('.multiview').length).toBe(1)
    expect(wrapper.find('.multiview-item').length).toBe(2)
    expect(wrapper.find('.multiview-item:first-child').prop('style').display).toBe('block')
    expect(wrapper.find('.multiview-item:last-child').prop('style').display).toBe('none')
    expect(wrapper.find('.child1').prop('multiview_actived')).toBe('true')
    expect(wrapper.find('.child1').prop('location')).toBe(fakeLocation)
    expect(wrapper.find('.child2').prop('data-props')['location']).toBe(fakeLocation)
    expect(wrapper.find('.child2').prop('data-props')['multiview_actived']).toBe('false')
  })

  it('should render second view correctly', async () => {
    const MultiView = await multiViewFactory(RB_CONTEXT)
    const Test = (props) => {
      return <div className='child2' data-props={props}>test</div>
    }
    const fakeLocation = {
      search: 'view=1'
    }

    const wrapper = mount(
      <MultiView location={fakeLocation}>
        <div className='child1'>div1</div>
        <Test />
      </MultiView>
    )

    expect(wrapper.find('.multiview').length).toBe(1)
    expect(wrapper.find('.multiview-item').length).toBe(2)
    expect(wrapper.find('.multiview-item:first-child').prop('style').display).toBe('none')
    expect(wrapper.find('.multiview-item:last-child').prop('style').display).toBe('block')
    expect(wrapper.find('.child1').prop('multiview_actived')).toBe('false')
    expect(wrapper.find('.child1').prop('location')).toBe(fakeLocation)
    expect(wrapper.find('.child2').prop('data-props')['location']).toBe(fakeLocation)
    expect(wrapper.find('.child2').prop('data-props')['multiview_actived']).toBe('true')
  })

  it('check view name', async () => {
    const MultiView = await multiViewFactory(RB_CONTEXT)
    const Test = (props) => {
      return <div className='child2' data-props={props}>test</div>
    }
    const fakeLocation = {
      search: 'view=test'
    }

    const wrapper = mount(
      <MultiView location={fakeLocation} viewNames={['', 'test']}>
        <div className='child1'>div1</div>
        <Test />
      </MultiView>
    )

    expect(wrapper.find('.multiview').length).toBe(1)
    expect(wrapper.find('.multiview-item').length).toBe(2)
    expect(wrapper.find('.multiview-item:first-child').prop('style').display).toBe('none')
    expect(wrapper.find('.multiview-item:last-child').prop('style').display).toBe('block')
    expect(wrapper.find('.child1').prop('multiview_actived')).toBe('false')
    expect(wrapper.find('.child1').prop('location')).toBe(fakeLocation)
    expect(wrapper.find('.child2').prop('data-props')['location']).toBe(fakeLocation)
    expect(wrapper.find('.child2').prop('data-props')['multiview_actived']).toBe('true')
  })

  it('check not exist view name', async () => {
    const MultiView = await multiViewFactory(RB_CONTEXT)
    const Test = (props) => {
      return <div className='child2' data-props={props}>test</div>
    }
    const fakeLocation = {
      search: 'view=test1'
    }

    const wrapper = mount(
      <MultiView location={fakeLocation} viewNames={['', 'test']}>
        <div className='child1'>div1</div>
        <Test />
      </MultiView>
    )

    expect(wrapper.find('.multiview').length).toBe(1)
    expect(wrapper.find('.multiview-item').length).toBe(2)
    expect(wrapper.find('.multiview-item:first-child').prop('style').display).toBe('block')
    expect(wrapper.find('.multiview-item:last-child').prop('style').display).toBe('none')
    expect(wrapper.find('.child1').prop('multiview_actived')).toBe('true')
    expect(wrapper.find('.child1').prop('location')).toBe(fakeLocation)
    expect(wrapper.find('.child2').prop('data-props')['location']).toBe(fakeLocation)
    expect(wrapper.find('.child2').prop('data-props')['multiview_actived']).toBe('false')
  })

  it('check view change', async () => {
    const MultiView = await multiViewFactory(RB_CONTEXT)
    const Test = (props) => {
      return <div className='child2' data-props={props}>test</div>
    }
    const fakeLocation = {
      search: 'view=test'
    }

    const onChange = jest.fn()

    const wrapper = mount(
      <MultiView location={fakeLocation} viewNames={['', 'test']} onChange={onChange}>
        <div className='child1'>div1</div>
        <Test />
      </MultiView>
    )

    expect(wrapper.find('.multiview').length).toBe(1)
    expect(wrapper.find('.multiview-item').length).toBe(2)
    expect(wrapper.find('.multiview-item:first-child').prop('style').display).toBe('none')
    expect(wrapper.find('.multiview-item:last-child').prop('style').display).toBe('block')
    expect(wrapper.find('.child1').prop('multiview_actived')).toBe('false')
    expect(wrapper.find('.child1').prop('location')).toBe(fakeLocation)
    expect(wrapper.find('.child2').prop('data-props')['location']).toBe(fakeLocation)
    expect(wrapper.find('.child2').prop('data-props')['multiview_actived']).toBe('true')
    expect(onChange.mock.calls.length).toBe(1)
    expect(onChange.mock.calls[0]).toEqual([1, 'test', {
      preName: undefined,
      preView: 0
    }])

    wrapper.setProps({ location: { search: '' } })
    expect(onChange.mock.calls.length).toBe(2)
    expect(onChange.mock.calls[1]).toEqual([0, undefined, {
      preName: 'test',
      preView: 1
    }])
  })
})
