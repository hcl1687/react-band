import React, { Component } from 'react'
import { handleActions } from 'redux-actions'

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
        this.reducer = handleActions(reducers, state)
        Object.keys(actions).forEach(key => {
          const fun = promisify(actions[key])
          this.actions[key] = (...args) => {
            return fun(...args).then(data => {
              const action = {
                type: key,
                payload: data
              }
              const newState = this.reducer(this.state, action)
              this.setState(newState)

              return action
            }).catch(err => {
              const action = {
                type: key,
                error: true,
                payload: err
              }
              const newState = this.reducer(this.state, action)
              this.setState(newState)

              return Promise.reject(err)
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
