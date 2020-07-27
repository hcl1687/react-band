import { mount, render } from 'enzyme'
import React from 'react'
import localStoreDecoFactory from '../index.entry'
import tools from '~/../tests/utils/index'
import utils from '~/../tests/utils/mockUtils'

function Test () {
  return <div>test</div>
}

const state = {
  count: 0
}
const actions = {
  increase: data => ++data,
  decrease: data => {
    throw new Error('error')
  }
}
const reducers = {
  increase: {
    next (state, action) {
      const count = action.payload

      return {
        ...state,
        count
      }
    },
    throw (state, action) {
      return state
    }
  },
  decrease: {
    next (state, action) {
      const count = action.payload

      return {
        ...state,
        count
      }
    },
    throw (state, action) {
      return {
        ...state,
        count: -1
      }
    }
  }
}

function localStoreFactory () {
  return {
    state,
    actions,
    reducers
  }
}

const context = {
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
      decoratorsConfig: {
        '@localStore': localStoreFactory
      }
    }

    const TestWithLocalStoreDeco = await LocalStoreDeco(targetConfig)(Test)
    const wrapper = render(<TestWithLocalStoreDeco />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should mount correctly', async () => {
    const LocalStoreDeco = await localStoreDecoFactory(context)
    const targetConfig = {
      decoratorsConfig: {
        '@localStore': localStoreFactory
      }
    }

    const TestWithLocalStoreDeco = await LocalStoreDeco(targetConfig)(Test)
    const wrapper = mount(
      <TestWithLocalStoreDeco />
    )
    expect(wrapper.state().count).toBe(0)
    const inst = wrapper.instance()
    expect(Object.keys(inst.actions)).toEqual(['increase', 'decrease'])
  })

  it('should invoke action correctly', async () => {
    const LocalStoreDeco = await localStoreDecoFactory(context)
    const targetConfig = {
      decoratorsConfig: {
        '@localStore': localStoreFactory
      }
    }

    const TestWithLocalStoreDeco = await LocalStoreDeco(targetConfig)(Test)
    const wrapper = mount(
      <TestWithLocalStoreDeco />
    )
    expect(wrapper.state().count).toBe(0)
    const inst = wrapper.instance()
    inst.actions.increase(0)

    expect(inst.state.count).toBe(0)
    return tools.delay(() => {
      expect(inst.state.count).toBe(1)
    }, 100)
  })

  it('should invoke action correctly when throw error', async () => {
    const LocalStoreDeco = await localStoreDecoFactory(context)
    const targetConfig = {
      decoratorsConfig: {
        '@localStore': localStoreFactory
      }
    }

    const TestWithLocalStoreDeco = await LocalStoreDeco(targetConfig)(Test)
    const wrapper = mount(
      <TestWithLocalStoreDeco />
    )
    expect(wrapper.state().count).toBe(0)
    const inst = wrapper.instance()
    inst.actions.decrease(1).catch((err) => {
      expect(err.message).toEqual('error')
    })

    expect(inst.state.count).toBe(0)
    return tools.delay(() => {
      expect(inst.state.count).toBe(-1)
    }, 100)
  })

  it('should support empty store', async () => {
    const LocalStoreDeco = await localStoreDecoFactory(context)
    const targetConfig = {
      decoratorsConfig: {
        '@localStore': () => ({})
      }
    }

    const TestWithLocalStoreDeco = await LocalStoreDeco(targetConfig)(Test)
    const wrapper = mount(
      <TestWithLocalStoreDeco />
    )
    expect(wrapper.state()).toEqual({})
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
      decoratorsConfig: {
        '@localStore': localStoreFactory
      }
    }

    const TestWithLocalStoreDeco = await LocalStoreDeco(targetConfig)(Test)
    const wrapper = render(<TestWithLocalStoreDeco />)
    expect(wrapper).toMatchSnapshot()
  })
})
