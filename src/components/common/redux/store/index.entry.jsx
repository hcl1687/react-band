import React, { Component } from 'react'
import { createAction, handleActions } from 'redux-actions'
import { connect } from 'react-redux'
import get from 'lodash/get'
import getStore from '../getStore'

export default async ({ getComponent }) => {
  const utils = await getComponent('utils') || {}
  const { setDisplayName, wrapDisplayName } = utils

  return ({ decoratorsConfig }) => async WrappedComponent => {
    const storeConfig = get(decoratorsConfig, '@reduxStore') || {}
    // fetch store component
    const { injectReducer } = getStore()
    const keys = Object.keys(storeConfig)
    const comps = {}
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      comps[key] = await getComponent(key)
      // register store
      const { state = {}, reducers = {} } = comps[key]
      const reducer = handleActions(reducers, state)
      injectReducer(key, reducer)
    }

    // collect selected actions
    const selectedActions = {}
    keys.forEach(key => {
      const comp = comps[key] || {}
      const actions = comp.actions || []
      const actionsKey = storeConfig[key].actions || []
      actionsKey.forEach(akey => {
        if (!actions[akey]) {
          return
        }
        selectedActions[akey] = createAction(akey, actions[akey])
      })
    })

    const mapDispatchToProps = dispatch => {
      return Object.keys(selectedActions).reduce((obj, key) => {
        obj[key] = (...args) => {
          const action = selectedActions[key](...args)
          dispatch(action)
          return Promise.resolve(action.payload)
        }
        return obj
      }, {})
    }

    const mapStateToProps = state => {
      const selectedState = {}
      keys.forEach(key => {
        const subState = state[key]
        const stateKeys = storeConfig[key].state || []
        stateKeys.forEach(subStateKey => {
          selectedState[subStateKey] = !subState ? undefined : subState[subStateKey]
        })
      })
      return selectedState
    }

    class reduxStoreDeco extends Component {
      constructor (props, context) {
        super(props, context)

        this.COMP = connect(mapStateToProps, mapDispatchToProps)(WrappedComponent)
      }

      render () {
        const COMP = this.COMP
        return <COMP {...this.props} />
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(WrappedComponent, 'reduxStoreDeco'))(reduxStoreDeco)
    }

    return reduxStoreDeco
  }
}
