import React, { Component } from 'react'

export default async ({ getComponent }) => {
  const utils = await getComponent('utils') || {}
  const { promisify, setDisplayName, wrapDisplayName } = utils

  return ({ decoratorsConfig: { localStore = {} } }) => WrappedComponent => {
    const { actions = {}, state = {}, reducers = {} } = localStore
    class localStoreDeco extends Component {
      constructor (props, context) {
        super(props, context)
        this.state = {
          ...state
        }

        this.actions = {}
        Object.keys(actions).forEach(key => {
          const fun = promisify(actions[key])
          this.actions[key] = (...args) => {
            return fun(...args).then(data => {
              const action = {
                payload: data
              }
              const reducder = reducers[key]
              if (reducder) {
                let state = this.state
                if (typeof reducder === 'function') {
                  state = reducder(this.state, action)
                } else if (reducder['next']) {
                  state = reducder['next'](this.state, action)
                }
                this.setState(state)
              }

              return data
            }).catch(err => {
              const action = {
                payload: err
              }
              const reducder = reducers[key]
              if (reducder && reducder['throw']) {
                const state = reducder['throw'](this.state, action)
                this.setState(state)
              }

              throw err
            })
          }
        })
      }

      render () {
        return <WrappedComponent {...this.props} {...this.state} {...this.actions} />
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(WrappedComponent, 'localStoreDeco'))(localStoreDeco)
    }

    return localStoreDeco
  }
}
