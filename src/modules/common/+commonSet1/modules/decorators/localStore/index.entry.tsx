import React, { useState } from 'react'
import get from 'lodash/get'
import { handleActions } from 'redux-actions'

const entry = async (RB_CONTEXT: RB.IRBContext): Promise<RB.IRBDecoModule> => {
  const { getModule } = RB_CONTEXT
  const utils = await getModule('utils') || {}
  const { promisify, setDisplayName, wrapDisplayName } = utils as Utils.IUtils

  const decoModule = ({ decoratorsConfig }: RB.IRBModuleConfig) => (WrappedComponent: RB.IRBComponent) => {
    const localStoreFactory = get(decoratorsConfig, '@localStore') as DecoLocalStore.ILocalStoreFactory
    const localStore = localStoreFactory(RB_CONTEXT) as DecoLocalStore.ILocalStore
    const { actions = {}, state = {}, reducers = {} } = localStore
    const _reducer = handleActions(reducers, state)

    const _actionsImp = {}
    Object.keys(actions).forEach(key => {
      const fun = promisify(actions[key])
      _actionsImp[key] = (_state: DecoLocalStore.ILocalState, _setState: React.Dispatch<DecoLocalStore.ILocalState>, ...args: any[]) => {
        return fun(...args).then((data: any) => {
          const action = {
            type: key,
            payload: data
          }
          const newState = _reducer(_state, action)
          _setState(newState)

          return action
        }).catch((err: Error) => {
          const action = {
            type: key,
            error: true,
            payload: err
          }
          const newState = _reducer(_state, action)
          _setState(newState)

          return Promise.reject(err)
        })
      }
    })

    function localStoreDeco (props) {
      const [_state, _setState] = useState({ ...state })
      const _actions = {}
      Object.keys(actions).forEach(key => {
        _actions[key] = function (...args: any[]) {
          return _actionsImp[key](_state, _setState, ...args)
        }
      })

      return <WrappedComponent {...props} {..._state} {..._actions} />
    }

    if (process.env.NODE_ENV !== 'production') {
      return setDisplayName(wrapDisplayName(WrappedComponent, 'localStoreDeco'))(localStoreDeco)
    }

    return localStoreDeco
  }

  return decoModule
}

export default {
  entry
}
