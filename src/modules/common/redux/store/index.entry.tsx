import { IRBComponent, IRBContext, IRBDecoModule, IRBModuleConfig } from '~/interface'
import { createAction, handleActions } from 'redux-actions'
import getStore, { IState } from '../getStore'
import React from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'

export default async ({ getModule }: IRBContext): Promise<IRBDecoModule> => {
  const utils = await getModule('utils') || {}
  const { setDisplayName, wrapDisplayName } = utils

  return ({ decoratorsConfig }: IRBModuleConfig) => async (WrappedComponent: IRBComponent) => {
    const storeConfig = get(decoratorsConfig, '@reduxStore') || {}
    // fetch store component
    const { injectReducer } = getStore()
    const keys = Object.keys(storeConfig)
    const comps = {}
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      comps[key] = await getModule(key)
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
      actionsKey.forEach((akey: string) => {
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

    const mapStateToProps = (state: IState) => {
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
