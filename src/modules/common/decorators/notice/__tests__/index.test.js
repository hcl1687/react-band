import React, { Component } from 'react'
import { mount, render } from 'enzyme'
import noticeDecoFactory from '../index.entry'
import tools from '~/../tests/utils/index'
import utils from '~/../tests/utils/mockUtils'

class Test extends Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      text: ''
    }
  }

  show = (text) => {
    this.setState({
      text
    })
  }

  show1 = (text, resolve) => {
    this.setState({
      text
    }, () => {
      resolve()
    })
  }

  show2 = (text) => {
    return new Promise(resolve => {
      this.setState({
        text
      }, () => {
        resolve()
      })
    })
  }

  render () {
    return <div>{this.state.text}</div>
  }
}

const context = {
  getModule: async (key) => {
    if (key === 'utils') {
      return utils
    }
  }
}

describe('common/decorators/notice', () => {
  it('should render correctly', async () => {
    const NoticeDeco = await noticeDecoFactory(context)
    const TestWithNoticeDeco = await NoticeDeco({})(Test)
    const wrapper = render(<TestWithNoticeDeco />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should mount correctly', async () => {
    const NoticeDeco = await noticeDecoFactory(context)
    const TestWithNoticeDeco = await NoticeDeco({})(Test)
    const wrapper = mount(
      <TestWithNoticeDeco />
    )

    const inst = wrapper.instance()
    inst.getNotification('test')
    inst.notify('test', 'show', true)

    return tools.delay(() => {
      const test = inst.state.childrenNotification.test
      expect(test).not.toBeUndefined()
      expect(test.show).not.toBeUndefined()
      expect(test.show.args.length).toBe(3)
      expect(test.show.args[0]).toBe(true)
    })
  })

  it('should reject notify if not register first', async () => {
    const NoticeDeco = await noticeDecoFactory(context)
    const TestWithNoticeDeco = await NoticeDeco({})(Test)
    const wrapper = mount(
      <TestWithNoticeDeco />
    )

    const inst = wrapper.instance()
    inst.notify('test', 'show', true).catch(() => {
      expect(true).toBe(true)
    })
  })

  it('should handle notification', async () => {
    const NoticeDeco = await noticeDecoFactory(context)
    const TestWithNoticeDeco = await NoticeDeco({})(Test)
    const wrapper = mount(
      <TestWithNoticeDeco />
    )

    let resolveFun
    let rejectFun
    const p = new Promise((resolve, reject) => {
      resolveFun = resolve
      rejectFun = reject
    })

    p.then(() => {
      expect(true).toBe(true)
    })

    const resolveWrapper = () => {
      expect(true).toBe(true)
      resolveFun()
    }

    wrapper.setProps({
      notification: {
        show: {
          id: Date.now(),
          args: ['test', resolveWrapper, rejectFun]
        }
      }
    })

    return tools.delay(() => {
      expect(wrapper.text()).toEqual('test')
    })
  })

  it('should handle notification when child method contains multiple params', async () => {
    const NoticeDeco = await noticeDecoFactory(context)
    const TestWithNoticeDeco = await NoticeDeco({})(Test)
    const wrapper = mount(
      <TestWithNoticeDeco />
    )

    let resolveFun
    let rejectFun
    const p = new Promise((resolve, reject) => {
      resolveFun = resolve
      rejectFun = reject
    })

    p.then(() => {
      expect(true).toBe(true)
    })

    const resolveWrapper = () => {
      expect(true).toBe(true)
      resolveFun()
    }

    wrapper.setProps({
      notification: {
        show1: {
          id: Date.now(),
          args: ['test1', resolveWrapper, rejectFun]
        }
      }
    })

    return tools.delay(() => {
      expect(wrapper.text()).toEqual('test1')
    })
  })

  it('should handle notification when child method return promise', async () => {
    const NoticeDeco = await noticeDecoFactory(context)
    const TestWithNoticeDeco = await NoticeDeco({})(Test)
    const wrapper = mount(
      <TestWithNoticeDeco />
    )

    let resolveFun
    let rejectFun
    const p = new Promise((resolve, reject) => {
      resolveFun = resolve
      rejectFun = reject
    })

    p.then(() => {
      expect(true).toBe(true)
    })

    const resolveWrapper = () => {
      expect(true).toBe(true)
      resolveFun()
    }

    wrapper.setProps({
      notification: {
        show2: {
          id: Date.now(),
          args: ['test2', resolveWrapper, rejectFun]
        }
      }
    })

    return tools.delay(() => {
      expect(wrapper.text()).toEqual('test2')
    })
  })

  it('should handle not existed method', async () => {
    const NoticeDeco = await noticeDecoFactory(context)
    const TestWithNoticeDeco = await NoticeDeco({})(Test)
    const wrapper = mount(
      <TestWithNoticeDeco />
    )

    let resolveFun
    let rejectFun
    const p = new Promise((resolve, reject) => {
      resolveFun = resolve
      rejectFun = reject
    })
    p.catch(() => {
      expect(true).toBe(true)
    })

    const rejectWrapper = () => {
      expect(true).toBe(true)
      rejectFun()
    }

    wrapper.setProps({
      notification: {
        notExistedFunc: {
          id: Date.now(),
          args: ['test', resolveFun, rejectWrapper]
        }
      }
    })

    return tools.delay(() => {
      expect(wrapper.text()).toEqual('')
    })
  })
})

describe('common/decorators/notice/production', () => {
  const NODE_ENV = process.env.NODE_ENV
  beforeAll(() => {
    process.env.NODE_ENV = 'production'
  })
  afterAll(() => {
    process.env.NODE_ENV = NODE_ENV
  })
  it('should render correctly in production env', async () => {
    const NoticeDeco = await noticeDecoFactory(context)
    const TestWithNoticeDeco = await NoticeDeco({})(Test)
    const wrapper = render(<TestWithNoticeDeco />)
    expect(wrapper).toMatchSnapshot()
  })
})
