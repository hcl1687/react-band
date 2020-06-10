import { applyMiddleware, combineReducers, createStore } from 'redux'
import middlewares from './middleware'

const staticReducers = {
  // fix error:
  // Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.
  '@ini': (state = {}) => (state)
}
let store

function createReducer (asyncReducers) {
  return combineReducers({
    ...staticReducers,
    ...asyncReducers
  })
}

export default function getStore (initialState = {}) {
  if (store) {
    return store
  }

  store = createStore(createReducer(), initialState, applyMiddleware(
    ...middlewares
  ))
  store.asyncReducers = {}

  store.injectReducer = (key, asyncReducer) => {
    if (!key || store.asyncReducers[key]) {
      return
    }

    store.asyncReducers[key] = asyncReducer
    store.replaceReducer(createReducer(store.asyncReducers))
  }

  return store
}
