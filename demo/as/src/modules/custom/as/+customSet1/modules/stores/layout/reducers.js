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
  },
  setLayout: {
    next (state, action) {
      return {
        ...state,
        LAYOUT_MODE: action.payload
      }
    }
  }
}
