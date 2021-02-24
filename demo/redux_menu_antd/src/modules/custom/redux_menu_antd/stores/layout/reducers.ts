export default {
  showLeft: {
    next (state, action) {
      return {
        ...state,
        LEFT_STATUS: action.payload
      }
    }
  },
  showHead: {
    next (state, action) {
      return {
        ...state,
        HEAD_STATUS: action.payload
      }
    }
  }
} as DecoRedux.IReduxReducers
