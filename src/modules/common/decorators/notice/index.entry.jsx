import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default async ({ getModule }) => {
  const utils = await getModule('utils') || {}
  const { setDisplayName, wrapDisplayName } = utils

  return ({ decoratorsConfig }) => WrappedComponent => {
    class noticeDeco extends Component {
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
      }

      componentWillReceiveProps (nextProps) {
        this.handleNotification(nextProps)
      }

      handleNotification = ({ notification = {} }) => {
        const { notification: pre } = this.props
        Object.keys(notification).forEach(methodName => {
          const action = notification[methodName]
          if (!pre[methodName] || action.id !== pre[methodName].id) {
            this._callMethod(methodName, action.args)
          }
        })
      }

      _callMethod (methodName, args) {
        // args = [params, resolve, reject]
        const callbacks = args.slice(1)
        args = args.slice(0, 1)
        const comp = this.target && this.target.current && this.target.current
        const methodFunc = comp && comp[methodName]
        if (!methodFunc) {
          // method is not exsist
          // reject
          callbacks[1](new Error(`${methodName} is not exsist.`))
          return
        }

        const definedParams = this._getMethodParams(methodFunc)
        // after uglified, the args' name has been changed.
        // so we can not pass the resolve method by the existence of the 'resolve'
        // we just check the args' length, if it's length larger than 1, we pass the resolve method.
        if (definedParams.length > 1) {
          // have resolve or reject params in the method's arguments
          new Promise((resolve, reject) => {
            args = args.concat([resolve, reject])
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

      _getMethodParams (method) {
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

      getNotification = (childName) => {
        const { childrenNotification } = this.state
        childrenNotification[childName] = childrenNotification[childName] || {}

        return {
          notification: childrenNotification[childName]
        }
      }

      notify = (childName, methodName, params) => {
        const { childrenNotification } = this.state

        // should use getNotification to register notification before using notify
        if (!childrenNotification[childName]) {
          return Promise.reject(new Error(`${childName} has not been registered.`))
        }

        return new Promise((resolve, reject) => {
          const args = [params].concat([resolve, reject])
          this.setState({
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

      render () {
        return <WrappedComponent {...this.props} ref={this.target}
          getNotification={this.getNotification} notify={this.notify} />
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(WrappedComponent, 'noticeDeco'))(noticeDeco)
    }

    return noticeDeco
  }
}
