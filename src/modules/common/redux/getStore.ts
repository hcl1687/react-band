import { applyMiddleware, combineReducers, createStore } from 'redux'
import middlewares from './middleware'

export interface IState {
  [propName: string]: any
}

export interface IReducer {
  (state: IState, payload?: any): IState
}

const staticReducers = {
  // fix error:
  // Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.
  '@ini': (state = {}) => (state)
}
let store: IState

function createReducer (asyncReducers: { [propName: string]: IReducer } = {}) {
  return combineReducers({
    ...staticReducers,
    ...asyncReducers
  })
}

export default function getStore (initialState = {}): IState {
  if (store) {
    return store
  }

  store = createStore(createReducer(), initialState, applyMiddleware(
    ...middlewares
  ))
  store.asyncReducers = {}

  store.injectReducer = (key: string, asyncReducer: IReducer) => {
    if (!key || store.asyncReducers[key]) {
      return
    }

    store.asyncReducers[key] = asyncReducer
    store.replaceReducer(createReducer(store.asyncReducers))
  }

  return store
}
