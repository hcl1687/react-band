import PropTypes, { InferProps } from 'prop-types'
import React, { Component } from 'react'
import { mount, render } from 'enzyme'
import { IRBContext } from '~/interface'
import { Provider } from 'react-redux'
import getStore from '../../getStore'
import storeDecoFactory from '../index.entry'
import tools from '~/../tests/utils/index'
import utils from '~/../tests/utils/mockUtils'

const store = getStore()

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

interface IState {
  [propName: string]: any
}

const state = {
  count: 0
}
const actions = {
  increase: (data: number) => data,
  decrease: (data: number) => data
}
const reducers = {
  increase: {
    next (state: IState) {
      const { count } = state
      return {
        ...state,
        count: count + 1
      }
    },
    throw (state: IState) {
      return state
    }
  },
  decrease: {
    next (state: IState) {
      const { count } = state
      return {
        ...state,
        count: count - 1
      }
    },
    throw (state: IState) {
      return state
    }
  }
}

function mathStoreFactory () {
  return {
    state,
    actions,
    reducers
  }
}

const context: IRBContext = {
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
