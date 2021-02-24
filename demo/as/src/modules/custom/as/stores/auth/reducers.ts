export default {
  login: {
    next (state, action) {
      return {
        ...state,
        AUTH: action.payload
      }
    },
    throw (state) {
      // handle error
      return {
        ...state
      }
    }
  },
  logout: {
    next (state) {
      return {
        ...state,
        AUTH: {}
      }
    }
  }
} as DecoRedux.IReduxReducers
