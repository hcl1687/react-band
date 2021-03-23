import PropTypes, { InferProps } from 'prop-types'
import React, { Component } from 'react'
import { mount, render } from 'enzyme'
import { Provider } from 'react-redux'
import getStore from '../../getStore'
import module from '../index.entry'
import tools from '~/../tests/utils/index'
import utils from '~/../tests/utils/mockUtils'

const storeDecoFactory = module.entry
const store: DecoRedux.IReduxStore = getStore()

class Test extends Component<InferProps<typeof Test.propTypes>> {
  static propTypes = {
    increase: PropTypes.func,
    decrease: PropTypes.func,
    count: PropTypes.number
  }

  componentDidMount () {
    const { increase } = this.props
    increase && increase()
  }

  handleAdd = () => {
    const { increase } = this.props
    increase()
  }

  handleSubstract = () => {
    const { decrease } = this.props
    decrease()
  }

  render () {
    return <div className='test'>{this.props.count}</div>
  }
}

const state: DecoRedux.IReduxState = {
  count: 0
}
const actions: DecoRedux.IReduxActionFactories = {
  increase: (data: number) => data,
  decrease: (data: number) => data
}
const reducers: DecoRedux.IReduxReducers = {
  increase: {
    next (state: DecoRedux.IReduxState) {
      const { count } = state
      return {
        ...state,
        count: count + 1
      }
    },
    throw (state: DecoRedux.IReduxState) {
      return state
    }
  },
  decrease: {
    next (state: DecoRedux.IReduxState) {
      const { count } = state
      return {
        ...state,
        count: count - 1
      }
    },
    throw (state: DecoRedux.IReduxState) {
      return state
    }
  }
}

function mathStoreFactory (): DecoRedux.IReduxModule {
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
  getModule: async (key: string) => {
    if (key === 'utils') {
      return utils
    } else if (key === 'mathStore') {
      return mathStoreFactory()
    }
  }
}

describe('common/redux/store', () => {
  it('should render correctly', async () => {
    const StoreDeco = await storeDecoFactory(context)
    const targetConfig = {
      name: 'test',
      decoratorsConfig: {
        '@reduxStore': {
          mathStore: {
            actions: ['increase', 'decrease'],
            state: ['count']
          }
        }
      }
    }

    const TestWithStoreDeco = await StoreDeco(targetConfig, { name: '@reduxStore' }, context)(Test)
    const wrapper = render(
      <Provider store={store}>
        <TestWithStoreDeco />
      </Provider>
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should mount correctly', async () => {
    const storeDeco = await storeDecoFactory(context)
    const targetConfig = {
      name: 'test',
      decoratorsConfig: {
        '@reduxStore': {
          mathStore: {
            actions: ['increase', 'decrease'],
            state: ['count']
          }
        }
      }
    }

    const TestWithStoreDeco = await storeDeco(targetConfig, { name: '@reduxStore' }, context)(Test)
    const wrapper = mount(
      <Provider store={store}>
        <TestWithStoreDeco />
      </Provider>
    )

    await tools.delay(() => {
      expect(wrapper.find('.test').text()).toEqual('1')
    })
  })
})

describe('common/redux/store/production', () => {
  const NODE_ENV = process.env.NODE_ENV
  beforeAll(() => {
    process.env.NODE_ENV = 'production'
  })
  afterAll(() => {
    process.env.NODE_ENV = NODE_ENV
  })
  it('should render correctly', async () => {
    const StoreDeco = await storeDecoFactory(context)
    const targetConfig = {
      name: 'test',
      decoratorsConfig: {
        '@reduxStore': {
          mathStore: {
            actions: ['increase', 'decrease'],
            state: ['count']
          }
        }
      }
    }

    const TestWithStoreDeco = await StoreDeco(targetConfig, { name: '@reduxStore' }, context)(Test)
    const wrapper = render(
      <Provider store={store}>
        <TestWithStoreDeco />
      </Provider>
    )
    expect(wrapper).toMatchSnapshot()
  })
})
