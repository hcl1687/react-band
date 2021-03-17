import { applyMiddleware, combineReducers, createStore } from 'redux'
import middlewares from './middleware'

const staticReducers: DecoRedux.IReduxPlainReducers = {
  // fix error:
  // Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.
  '@ini': (state = {}) => (state)
}
let store: DecoRedux.IReduxStore | DecoRedux.IReduxObject

function createReducer (asyncReducers: DecoRedux.IReduxPlainReducers = {}) {
  return combineReducers({
    ...staticReducers,
    ...asyncReducers
  })
}

export default function getStore (initialState: DecoRedux.IReduxState = {}): DecoRedux.IReduxStore {
  if (store) {
    return store as DecoRedux.IReduxStore
  }

  store = createStore(createReducer(), initialState, applyMiddleware(
    ...middlewares
  ))
  store.asyncReducers = {}

  store.injectReducer = (key: string, asyncReducer: DecoRedux.IReduxPlainReducer): void => {
    if (!key || store.asyncReducers[key]) {
      return
    }

    store.asyncReducers[key] = asyncReducer
    store.replaceReducer(createReducer(store.asyncReducers))
  }

  return store as DecoRedux.IReduxStore
}
