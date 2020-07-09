export default {
  login: {
    next (state, action) {
      return {
        ...state,
        AUTH: action.payload
      }
    },
    throw (state, action) {
      // handle error
      return {
        ...state
      }
    }
  },
  logout: {
    next (state, action) {
      return {
        ...state,
        AUTH: {}
      }
    }
  }
}
