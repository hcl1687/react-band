import PropTypes, { InferProps } from 'prop-types'
import React, { useState } from 'react'
import { mount, render } from 'enzyme'
import localStoreDecoFactory from '../index.entry'
import tools from '~/../tests/utils/index'
import utils from '~/../tests/utils/mockUtils'

function Test (props: InferProps<typeof Test.propTypes>) {
  const { count, increase, decrease } = props
  const [msg, setMsg] = useState('')
  const hanldeBtn1 = () => {
    increase(count)
  }
  const handleBtn2 = () => {
    decrease().catch((err: Error) => {
      setMsg(err.message)
    })
  }

  return <div id='test' data-props={props}>
    <div id='result'>{count}</div>
    <div id='result1'>{msg}</div>
    <button id='btn1' onClick={hanldeBtn1}>increase</button>
    <button id='btn2' onClick={handleBtn2}>increase</button>
  </div>
}

Test.propTypes = {
  count: PropTypes.any,
  increase: PropTypes.any,
  decrease: PropTypes.any
}

const state: DecoLocalStore.ILocalState = {
  count: 0
}
const actions: DecoLocalStore.ILocalActionFactories = {
  increase: (data: number) => ++data,
  decrease: () => {
    throw new Error('error')
  }
}
const reducers: DecoLocalStore.ILocalReducers = {
  increase: {
    next (state: DecoLocalStore.ILocalState, action: DecoLocalStore.ILocalAction) {
      const count = action.payload

      return {
        ...state,
        count
      }
    },
    throw (state: DecoLocalStore.ILocalState) {
      return state
    }
  },
  decrease: {
    next (state: DecoLocalStore.ILocalState, action: DecoLocalStore.ILocalAction) {
      const count = action.payload

      return {
        ...state,
        count
      }
    },
    throw (state: DecoLocalStore.ILocalState) {
      return {
        ...state,
        count: -1
      }
    }
  }
}

function localStoreFactory (): DecoLocalStore.ILocalStore {
  return {
    state,
    actions,
    reducers
  }
}

const context: RB.IRBContext = {
  options: {},
  modules: {},
  i18ns: {},
  themes: {},
  packedModules: {},
  modulesConfig: {},
  routes: [],
  getModule: async (key) => {
    if (key === 'utils') {
      return utils
    }
  }
}

describe('common/decorators/localStore', () => {
  it('should render correctly', async () => {
    const LocalStoreDeco = await localStoreDecoFactory(context)
    const targetConfig = {
      name: 'test',
      decoratorsConfig: {
        '@localStore': localStoreFactory
      }
    }

    const TestWithLocalStoreDeco = await LocalStoreDeco(targetConfig, { name: '@localStore' }, context)(Test)
    const wrapper = render(<TestWithLocalStoreDeco />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should mount correctly', async () => {
    const LocalStoreDeco = await localStoreDecoFactory(context)
    const targetConfig = {
      name: 'test',
      decoratorsConfig: {
        '@localStore': localStoreFactory
      }
    }

    const TestWithLocalStoreDeco = await LocalStoreDeco(targetConfig, { name: '@localStore' }, context)(Test)
    const wrapper = mount(
      <TestWithLocalStoreDeco />
    )

    const dom = wrapper.find('#test')
    const props = dom.prop('data-props')
    expect(props['count']).toBe(0)

    expect(typeof props['increase']).toBe('function')
    expect(typeof props['decrease']).toBe('function')
  })

  it('should invoke action correctly', async () => {
    const LocalStoreDeco = await localStoreDecoFactory(context)
    const targetConfig = {
      name: 'test',
      decoratorsConfig: {
        '@localStore': localStoreFactory
      }
    }

    const TestWithLocalStoreDeco = await LocalStoreDeco(targetConfig, { name: '@localStore' }, context)(Test)
    const wrapper = mount(
      <TestWithLocalStoreDeco />
    )

    expect(wrapper.find('#test').prop('data-props')['count']).toBe(0)
    wrapper.find('#btn1').simulate('click')

    return tools.delay(() => {
      expect(wrapper.find('#result').text()).toEqual('1')
    }, 100)
  })

  it('should invoke action correctly when throw error', async () => {
    const LocalStoreDeco = await localStoreDecoFactory(context)
    const targetConfig = {
      name: 'test',
      decoratorsConfig: {
        '@localStore': localStoreFactory
      }
    }

    const TestWithLocalStoreDeco = await LocalStoreDeco(targetConfig, { name: '@localStore' }, context)(Test)
    const wrapper = mount(
      <TestWithLocalStoreDeco />
    )
    expect(wrapper.find('#test').prop('data-props')['count']).toBe(0)
    wrapper.find('#btn2').simulate('click')

    return tools.delay(() => {
      expect(wrapper.find('#result1').text()).toEqual('error')
      expect(wrapper.find('#result').text()).toEqual('-1')
    }, 100)
  })

  it('should support empty store', async () => {
    const LocalStoreDeco = await localStoreDecoFactory(context)
    const targetConfig = {
      name: 'test',
      decoratorsConfig: {
        '@localStore': () => ({})
      }
    }

    const TestWithLocalStoreDeco = await LocalStoreDeco(targetConfig, { name: '@localStore' }, context)(Test)
    const wrapper = mount(
      <TestWithLocalStoreDeco />
    )

    const { children } = wrapper.find('#test').props()
    expect((children as Array<React.ReactNode>).length).toEqual(4)
  })
})

describe('common/decorators/layout/production', () => {
  const NODE_ENV = process.env.NODE_ENV
  beforeAll(() => {
    process.env.NODE_ENV = 'production'
  })
  afterAll(() => {
    process.env.NODE_ENV = NODE_ENV
  })
  it('should render correctly', async () => {
    const LocalStoreDeco = await localStoreDecoFactory(context)
    const targetConfig = {
      name: 'test',
      decoratorsConfig: {
        '@localStore': localStoreFactory
      }
    }

    const TestWithLocalStoreDeco = await LocalStoreDeco(targetConfig, { name: '@localStore' }, context)(Test)
    const wrapper = render(<TestWithLocalStoreDeco />)
    expect(wrapper).toMatchSnapshot()
  })
})
