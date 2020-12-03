import React, { Children, Component, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { mount, render } from 'enzyme'
import noticeDecoFactory from '../index.entry'
import tools from '~/../tests/utils/index'
import utils from '~/../tests/utils/mockUtils'

const context = {
  getModule: async (key) => {
    if (key === 'utils') {
      return utils
    }
  }
}

async function TestFactory () {
  class ChildTest extends Component {
    constructor (props, context) {
      super(props, context)
  
      this.state = {
        text: ''
      }
    }
  
    show1 = (text) => {
      this.setState({
        text
      })
    }
  
    show2 = (text, resolve) => {
      this.setState({
        text
      }, () => {
        resolve()
      })
    }
  
    show3 = (text) => {
      return new Promise(resolve => {
        this.setState({
          text
        }, () => {
          resolve()
        })
      })
    }
  
    render () {
      return <div id='childTest' {...this.props}>{this.state.text}</div>
    }
  }

  class Test extends Component {
    constructor (props, context) {
      super(props, context)
  
      this.state = {
        msg: ''
      }
    }

    static propTypes = {
      notify: PropTypes.func.isRequired,
      getNotification: PropTypes.func.isRequired
    }
  
    handleBtn1 = () => {
      const { notify } = this.props
      notify('child', 'show1', 'show1').then(() => {
        this.setState({
          msg: 'show1'
        })
      })
    }
  
    handleBtn2 = () => {
      const { notify } = this.props
      notify('child', 'show2', 'show2').then(() => {
        this.setState({
          msg: 'show2'
        })
      })
    }
  
    handleBtn3 = () => {
      const { notify } = this.props
      notify('child', 'show3', 'show3').then(() => {
        this.setState({
          msg: 'show3'
        })
      })
    }

    handleBtn4 = () => {
      const { notify } = this.props
      notify('child1', 'show1', 'show1').catch((err) => {
        this.setState({
          msg: err.message
        })
      })
    }

    handleBtn5 = () => {
      const { notify } = this.props
      notify('child', 'show5', 'show5').catch((err) => {
        this.setState({
          msg: err.message
        })
      })
    }
  
    render () {
      const { getNotification } = this.props
      return <div id='test' {...this.props}>
        <ChildTestWithNoticeDeco {...getNotification('child')} />
        <div id='testResult'>{this.state.msg}</div>
        <button id='btn1' onClick={this.handleBtn1}>btn1</button>
        <button id='btn2' onClick={this.handleBtn2}>btn2</button>
        <button id='btn3' onClick={this.handleBtn3}>btn3</button>
        <button id='btn4' onClick={this.handleBtn4}>btn4</button>
        <button id='btn5' onClick={this.handleBtn5}>btn5</button>
      </div>
    }
  }

  const NoticeDeco = await noticeDecoFactory(context)
  const ChildTestWithNoticeDeco = await NoticeDeco({})(ChildTest)
  const TestWithNoticeDeco = await NoticeDeco({})(Test)

  return TestWithNoticeDeco
}

async function Test1Factory () {
  const NoticeDeco = await noticeDecoFactory(context)
  const ChildTest1WithNoticeDeco = await NoticeDeco({})(ChildTest1)
  const Test1WithNoticeDeco = await NoticeDeco({})(Test1)

  function Test1 (props) {
    const { notify, getNotification } = props
    const [msg, setMsg] = useState('')

    const handleBtn1 = () => {
      notify('child', 'show1', 'show1').then(() => {
        setMsg('show1')
      })
    }

    const handleBtn2 = () => {
      notify('child', 'show2', 'show2').then(() => {
        setMsg('show2')
      })
    }

    const handleBtn3 = () => {
      notify('child', 'show3', 'show3').then(() => {
        setMsg('show3')
      })
    }

    const handleBtn4 = () => {
      notify('child1', 'show1', 'show1').catch((err) => {
        setMsg(err.message)
      })
    }

    const handleBtn5 = () => {
      notify('child', 'show5', 'show5').catch((err) => {
        setMsg(err.message)
      })
    }
  
    return <div id='test' {...props}>
      <ChildTest1WithNoticeDeco {...getNotification('child')} />
      <div id='testResult'>{msg}</div>
      <button id='btn1' onClick={handleBtn1}>btn1</button>
      <button id='btn2' onClick={handleBtn2}>btn2</button>
      <button id='btn3' onClick={handleBtn3}>btn3</button>
      <button id='btn4' onClick={handleBtn4}>btn4</button>
      <button id='btn5' onClick={handleBtn5}>btn5</button>
    </div>
  }
  
  Test1.propTypes = {
    notify: PropTypes.func.isRequried,
    getNotification: PropTypes.func.isRequried
  }
  
  function ChildTest1 (props) {
    const { setNotifyHandler } = props
    const [text, setText] = useState('')
    const thisRef = useRef({})
  
    const show1 = (text) => {
      setText(text)
    }
  
    const show2 = (text, resolve) => {
      setText(text)
      if (thisRef && thisRef.current) {
        thisRef.current.show1Resolve = resolve
      }
    }
  
    const show3 = (text) => {
      return new Promise(resolve => {
        setText(text)
        if (thisRef && thisRef.current) {
          thisRef.current.show2Resolve = resolve
        }
      })
    }
  
    setNotifyHandler({
      show1,
      show2,
      show3
    })
  
    useEffect(() => {
      if (thisRef && thisRef.current) {
        if (thisRef.current.show1Resolve) {
          const resolve = thisRef.current.show1Resolve
          delete thisRef.current.show1Resolve
          resolve()
        } else if (thisRef.current.show2Resolve) {
          const resolve = thisRef.current.show2Resolve
          delete thisRef.current.show2Resolve
          resolve()
        }
      }
    }, [text])
  
    return <div id='childTest' {...props}>{text}</div>
  }
  
  ChildTest1.propTypes = {
    setNotifyHandler: PropTypes.func.isRequried
  }

  return Test1WithNoticeDeco
}

describe('common/decorators/notice test class', () => {
  it('should render correctly', async () => {
    const TestWithNoticeDeco = await TestFactory()
    const wrapper = render(<TestWithNoticeDeco />)
    expect(wrapper).toMatchSnapshot()
  })

  // it('should render function correctly', async () => {
  //   const Test1WithNoticeDeco = await Test1Factory()
  //   const wrapper = render(<Test1WithNoticeDeco />)
  //   expect(wrapper).toMatchSnapshot()
  // })

  it('should mount correctly', async () => {
    const TestWithNoticeDeco = await TestFactory()
    const wrapper = mount(
      <TestWithNoticeDeco />
    )

    expect(typeof wrapper.find('#test').prop('getNotification')).toBe('function')
    expect(typeof wrapper.find('#test').prop('notify')).toBe('function')
    expect(typeof wrapper.find('#childTest').prop('getNotification')).toBe('function')
    expect(typeof wrapper.find('#childTest').prop('notify')).toBe('function')
    expect(wrapper.find('#childTest').prop('notification')).toEqual({})
    wrapper.find('#btn1').simulate('click')

    return tools.delay(() => {
      expect(wrapper.find('#testResult').text()).toBe('show1')
      expect(wrapper.find('#childTest').text()).toBe('show1')
    })
  })

  it('should reject notify if not register first', async () => {
    const TestWithNoticeDeco = await TestFactory()
    const wrapper = mount(
      <TestWithNoticeDeco />
    )

    wrapper.find('#btn4').simulate('click')

    return tools.delay(() => {
      expect(wrapper.find('#testResult').text()).toBe('child1 has not been registered.')
    })
  })

  it('should handle notification when called function declares a resolve parameter.', async () => {
    const TestWithNoticeDeco = await TestFactory()
    const wrapper = mount(
      <TestWithNoticeDeco />
    )

    wrapper.find('#btn2').simulate('click')

    return tools.delay(() => {
      expect(wrapper.find('#testResult').text()).toBe('show2')
      expect(wrapper.find('#childTest').text()).toBe('show2')
    })
  })

  it('should handle notification when called function return a promise', async () => {
    const TestWithNoticeDeco = await TestFactory()
    const wrapper = mount(
      <TestWithNoticeDeco />
    )

    wrapper.find('#btn3').simulate('click')

    return tools.delay(() => {
      expect(wrapper.find('#testResult').text()).toBe('show3')
      expect(wrapper.find('#childTest').text()).toBe('show3')
    })
  })

  it('should handle not existed method', async () => {
    const TestWithNoticeDeco = await TestFactory()
    const wrapper = mount(
      <TestWithNoticeDeco />
    )

    wrapper.find('#btn5').simulate('click')

    return tools.delay(() => {
      expect(wrapper.find('#testResult').text()).toBe('show5 is not exsist.')
      expect(wrapper.find('#childTest').text()).toBe('')
    })
  })
})

describe('common/decorators/notice test function', () => {
  it('should render correctly', async () => {
    const Test1WithNoticeDeco = await Test1Factory()
    const wrapper = render(<Test1WithNoticeDeco />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should mount correctly', async () => {
    const Test1WithNoticeDeco = await Test1Factory()
    const wrapper = mount(
      <Test1WithNoticeDeco />
    )

    expect(typeof wrapper.find('#test').prop('getNotification')).toBe('function')
    expect(typeof wrapper.find('#test').prop('notify')).toBe('function')
    expect(typeof wrapper.find('#childTest').prop('getNotification')).toBe('function')
    expect(typeof wrapper.find('#childTest').prop('notify')).toBe('function')
    expect(wrapper.find('#childTest').prop('notification')).toEqual({})
    wrapper.find('#btn1').simulate('click')

    return tools.delay(() => {
      expect(wrapper.find('#testResult').text()).toBe('show1')
      expect(wrapper.find('#childTest').text()).toBe('show1')
    })
  })

  it('should reject notify if not register first', async () => {
    const Test1WithNoticeDeco = await Test1Factory()
    const wrapper = mount(
      <Test1WithNoticeDeco />
    )

    wrapper.find('#btn4').simulate('click')

    return tools.delay(() => {
      expect(wrapper.find('#testResult').text()).toBe('child1 has not been registered.')
    })
  })

  it('should handle notification when called function declares a resolve parameter.', async () => {
    const Test1WithNoticeDeco = await Test1Factory()
    const wrapper = mount(
      <Test1WithNoticeDeco />
    )

    wrapper.find('#btn2').simulate('click')

    return tools.delay(() => {
      expect(wrapper.find('#testResult').text()).toBe('show2')
      expect(wrapper.find('#childTest').text()).toBe('show2')
    })
  })

  it('should handle notification when called function return a promise', async () => {
    const Test1WithNoticeDeco = await Test1Factory()
    const wrapper = mount(
      <Test1WithNoticeDeco />
    )

    wrapper.find('#btn3').simulate('click')

    return tools.delay(() => {
      expect(wrapper.find('#testResult').text()).toBe('show3')
      expect(wrapper.find('#childTest').text()).toBe('show3')
    })
  })

  it('should handle not existed method', async () => {
    const Test1WithNoticeDeco = await Test1Factory()
    const wrapper = mount(
      <Test1WithNoticeDeco />
    )

    wrapper.find('#btn5').simulate('click')

    return tools.delay(() => {
      expect(wrapper.find('#testResult').text()).toBe('show5 is not exsist.')
      expect(wrapper.find('#childTest').text()).toBe('')
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
    const TestWithNoticeDeco = await TestFactory()
    const wrapper = render(<TestWithNoticeDeco />)
    expect(wrapper).toMatchSnapshot()
  })
})
