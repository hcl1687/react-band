import { createAction, handleActions } from 'redux-actions'
import React from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'
import getStore from '../getStore'

const entry = async ({ getModule }: RB.IRBContext): Promise<RB.IRBDecoModule> => {
  const utils = await getModule('utils') || {}
  const { setDisplayName, wrapDisplayName } = utils

  return ({ decoratorsConfig }: RB.IRBModuleConfig) => async (WrappedComponent: RB.IRBComponent) => {
    const storeConfig: DecoRedux.IReduxConfig = get(decoratorsConfig, '@reduxStore') || {}
    // fetch store component
    const { injectReducer }: DecoRedux.IReduxStore = getStore()
    const keys = Object.keys(storeConfig)
    const comps = {}
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      comps[key] = await getModule(key)
      // register store
      const { state = {}, reducers = {} }: DecoRedux.IReduxModule = comps[key]
      const reducer: DecoRedux.IReduxPlainReducer = handleActions(reducers, state)
      injectReducer(key, reducer)
    }

    // collect selected actions
    const selectedActions = {}
    keys.forEach(key => {
      const comp = comps[key] || {}
      const actions: DecoRedux.IReduxActionFactories = comp.actions || {}
      const actionsKey = storeConfig[key].actions || []
      actionsKey.forEach((akey: string) => {
        if (!actions[akey]) {
          return
        }
        selectedActions[akey] = createAction(akey, actions[akey])
      })
    })

    const mapDispatchToProps = (dispatch: (action: DecoRedux.IReduxAction) => void) => {
      return Object.keys(selectedActions).reduce((obj, key) => {
        obj[key] = (...args: Array<any>) => {
          const action = selectedActions[key](...args)
          dispatch(action)
          return Promise.resolve(action.payload)
        }
        return obj
      }, {})
    }

    const mapStateToProps = (state: DecoRedux.IReduxStore): DecoRedux.IReduxState => {
      const selectedState = {}
      keys.forEach(key => {
        const subState = state[key]
        const stateKeys = storeConfig[key].state || []
        stateKeys.forEach((subStateKey: string) => {
          selectedState[subStateKey] = !subState ? undefined : subState[subStateKey]
        })
      })
      return selectedState
    }

    const COMP = connect(mapStateToProps, mapDispatchToProps)(WrappedComponent)
    function reduxStoreDeco (props) {
      return <COMP {...props} />
    }

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(WrappedComponent, 'reduxStoreDeco'))(reduxStoreDeco)
    }

    return reduxStoreDeco
  }
}

export default {
  entry
}
