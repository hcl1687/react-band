import React, { Component, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import PropTypes from 'prop-types'

type IArgs = [IParams] | [
  IParams,
  IResovle,
  IReject
]

type IObject = { [propName: string]: any }

interface IParams {
  [propName: string]: any
}

interface IResovle {
  (value?: any | PromiseLike<any>): void
}

type IReject = IResovle

interface ITarget {
  current: IObject
  [propName: string]: any
}

interface IProps {
  notification?: IObject
}

interface IInst {
  state: IObject
  setState?: (val: IObject) => void
}

type IUseNotice = [
  (childName: string) => { notification: any },
  (childName: string, methodName: string, params: IParams) => Promise<unknown>,
  (handlers: IObject, ref: any) => void
]

function _callMethod (methodName: string, args: IArgs, target: ITarget) {
  // args = [params, resolve, reject]
  const callbacks = args.slice(1) as [IResovle, IReject]
  args = args.slice(0, 1) as IArgs
  const comp = target && target.current
  const methodFunc = comp && comp[methodName]
  if (!methodFunc) {
    // method is not exsist
    // reject
    callbacks[1](new Error(`${methodName} is not exsist.`))
    return
  }

  const definedParams = _getMethodParams(methodFunc)
  // after uglified, the args' name has been changed.
  // so we can not pass the resolve method by the existence of the 'resolve'
  // we just check the args' length, if it's length larger than 1, we pass the resolve method.
  if (definedParams.length > 1) {
    // have resolve or reject params in the method's arguments
    new Promise((resolve, reject) => {
      args = args.concat([resolve, reject]) as IArgs
      methodFunc.call(comp, ...args)
    }).then(callbacks[0]).catch(callbacks[1])

    return
  }

  // have no resolve or reject params in the method's arguments
  new Promise((resolve, reject) => {
    try {
      const ret = methodFunc.call(comp, ...args)
      if (ret && ret.then) {
        ret.then(resolve).catch(reject)
      } else {
        resolve(ret)
      }
    } catch (err) {
      reject(err)
    }
  }).then(callbacks[0]).catch(callbacks[1])
}

function _getMethodParams (method: string) {
  const bodyRegex = /\{.*\}$/
  const paramsRegex = /\((.*)\)/
  let str = method.toString()
  str = str.replace(bodyRegex, '')
  const match = str.match(paramsRegex)
  if (!match) {
    return []
  }

  if (match[1].trim() === '') {
    return []
  }

  const params = match[1].split(',').map(param => param.trim())

  return params
}

function _handleNotification (
  { notification = {} }: IProps,
  preProps: IProps = {},
  target: ITarget
) {
  const { notification: pre } = preProps
  Object.keys(notification).forEach(methodName => {
    const action = notification[methodName]
    if (!pre[methodName] || action.id !== pre[methodName].id) {
      _callMethod(methodName, action.args, target)
    }
  })
}

function _getNotification (instance: IInst = { state: {} }) {
  return (childName: string) => {
    const { state } = instance
    const { childrenNotification } = state
    childrenNotification[childName] = childrenNotification[childName] || {}

    return {
      notification: childrenNotification[childName]
    }
  }
}

function _notify (instance: IInst = { state: {}, setState: () => {} }) {
  return (childName: string, methodName: string, params: IParams) => {
    const { state } = instance
    const { childrenNotification } = state

    // should use getNotification to register notification before using notify
    if (!childrenNotification[childName]) {
      return Promise.reject(new Error(`${childName} has not been registered.`))
    }

    return new Promise((resolve, reject) => {
      const args = [params].concat([resolve, reject])
      instance.setState({
        childrenNotification: {
          ...childrenNotification,
          [childName]: {
            [methodName]: {
              id: Date.now(),
              args
            }
          }
        }
      })
    })
  }
}

function shouldConstruct (Component: RB.IRBComponent) {
  const prototype = Component.prototype
  return !!(prototype && prototype.isReactComponent)
}

function setFakeNotifyHandler () {
  console.error('only functions that accept exactly two parameters: props and ref are support setNotifyHandler.')
}

export default async ({ getModule }: RB.IRBContext): Promise<RB.IRBDecoModule> => {
  const utils = await getModule('utils') || {}
  const { setDisplayName, wrapDisplayName } = utils

  return () => (WrappedComponent: RB.IRBComponent) => {
    class noticeClassDeco extends Component<IProps> {
      private target: React.RefObject<HTMLInputElement>

      private getNotification: (childName: string) => { notification: any }

      private notify: (childName: string, methodName: string, params: IParams) => Promise<unknown>

      static propTypes = {
        notification: PropTypes.object
      }

      static defaultProps = {
        notification: {}
      }

      constructor (props, context) {
        super(props, context)
        this.state = {
          childrenNotification: {}
        }

        this.target = React.createRef()
        this.getNotification = _getNotification(this)
        this.notify = _notify(this)
      }

      componentWillReceiveProps (nextProps) {
        _handleNotification(nextProps, this.props, this.target)
      }

      render () {
        // @ts-ignore
        return <WrappedComponent {...this.props} ref={this.target}
          getNotification={this.getNotification} notify={this.notify} />
      }
    }

    let WrappedComponentWithRef = null
    // if it's not a react component, it's function component
    if (!(typeof WrappedComponent === 'function' && shouldConstruct(WrappedComponent))) {
      // fix: forwardRef render functions accept exactly two parameters: props and ref. Did you forget to use the ref parameter?
      if (WrappedComponent.length === 2) {
        let propTypes
        let defaultProps
        if (WrappedComponent.propTypes) {
          propTypes = WrappedComponent.propTypes
          delete WrappedComponent.propTypes
        }
        if (WrappedComponent.defaultProps) {
          defaultProps = WrappedComponent.defaultProps
          delete WrappedComponent.defaultProps
        }

        // @ts-ignore
        WrappedComponentWithRef = forwardRef(WrappedComponent)

        // fix: forwardRef render functions do not support propTypes or defaultProps
        // https://stackoverflow.com/questions/59716140/using-forwardref-with-proptypes-and-eslint
        if (propTypes) {
          WrappedComponentWithRef.propTypes = propTypes
        }
        if (defaultProps) {
          WrappedComponentWithRef.defaultProps = defaultProps
        }
      }
    }
    function noticeFunctionDeco (props) {
      const targetRef = useRef()
      const prevPropsRef = useRef()
      useEffect(() => {
        prevPropsRef.current = props
      })
      const prevProps = prevPropsRef.current
      useEffect(() => {
        _handleNotification(props, prevProps, targetRef)
      })

      const [getNotification, notify, setNotifyHandler] = useNotice()

      return WrappedComponentWithRef ? <WrappedComponentWithRef {...props} ref={targetRef}
        getNotification={getNotification} notify={notify} setNotifyHandler={setNotifyHandler} />
        : <WrappedComponent {...props} getNotification={getNotification} notify={notify} setNotifyHandler={setFakeNotifyHandler} />
    }

    let noticeDeco: RB.IRBComponent = noticeFunctionDeco
    // if it's react component
    if (typeof WrappedComponent === 'function' && shouldConstruct(WrappedComponent)) {
      noticeDeco = noticeClassDeco
    }

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(WrappedComponent, 'noticeDeco'))(noticeDeco)
    }

    return noticeDeco
  }
}

export function useNotice (): IUseNotice {
  const [state, setState] = useState({ childrenNotification: {} })

  const getNotification = _getNotification({ state, setState })
  const notify = _notify({ state, setState })
  const setNotifyHandler = (handlers: IObject, ref: React.Ref<unknown>) => {
    useImperativeHandle(ref, () => (handlers))
  }

  return [getNotification, notify, setNotifyHandler]
}
