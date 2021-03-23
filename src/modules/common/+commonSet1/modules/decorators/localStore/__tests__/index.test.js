import React, { useState } from 'react'
import { mount, render } from 'enzyme'
import PropTypes from 'prop-types'
import module from '../index.entry'
import tools from '~/../tests/utils/index'
import utils from '~/../tests/utils/mockUtils'

const localStoreDecoFactory = module.entry
function Test (props) {
  const { count, increase, decrease } = props
  const [msg, setMsg] = useState('')
  const hanldeBtn1 = () => {
    increase(count)
  }
  const handleBtn2 = () => {
    decrease().catch(err => {
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

    const dom = wrapper.find('#test')
    const props = dom.prop('data-props')
    expect(props['count']).toBe(0)

    expect(typeof props['increase']).toBe('function')
    expect(typeof props['decrease']).toBe('function')
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

    expect(wrapper.find('#test').prop('data-props')['count']).toBe(0)
    wrapper.find('#btn1').simulate('click')

    return tools.delay(() => {
      expect(wrapper.find('#result').text()).toEqual('1')
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
      decoratorsConfig: {
        '@localStore': () => ({})
      }
    }

    const TestWithLocalStoreDeco = await LocalStoreDeco(targetConfig)(Test)
    const wrapper = mount(
      <TestWithLocalStoreDeco />
    )

    const { children } = wrapper.find('#test').props()
    expect(children.length).toEqual(4)
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
