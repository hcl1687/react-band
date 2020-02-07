import { combineReducers, createStore } from 'redux'

// function createReducerManager (initialReducers) {
//   const reducers = { ...initialReducers }
//   let combinedReducer = combineReducers(reducers)
//   let keysToAdd = {}
//   let keysToRemove = []

//   return {
//     getReducerMap: () => reducers,
//     reduce: (state, action) => {
//       if (keysToRemove.length > 0) {
//         state = { ...state }
//         for (const key of keysToRemove) {
//           delete state[key]
//         }
//         keysToRemove = []
//       }

//       const iniStates = {}
//       const keys = Object.keys(keysToAdd)
//       if (keys.length > 0) {
//         keys.forEach(key => {
//           const iniState = keysToAdd[key] || {}
//           iniStates[key] = { ...iniState }
//         })
//         state = { ...state, ...iniStates }
//         keysToAdd = {}
//       }

//       return combinedReducer(state, action)
//     },
//     add: (key, reducer, state) => {
//       if (!key || reducers[key]) {
//         return
//       }

//       keysToAdd[key] = state
//       reducers[key] = reducer
//       combinedReducer = combineReducers(reducers)
//     },
//     remove: key => {
//       if (!key || !reducers[key]) {
//         return
//       }

//       delete reducers[key]
//       keysToRemove.push(key)
//       combinedReducer = combineReducers(reducers)
//     }
//   }
// }

// export default function getStore (initialState = {}) {
//   if (store) {
//     return store
//   }

//   const reducerManager = createReducerManager(staticReducers)
//   store = createStore(reducerManager.reduce, initialState)
//   store.reducerManager = reducerManager

//   return store
// }

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

  store = createStore(createReducer(), initialState)
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
