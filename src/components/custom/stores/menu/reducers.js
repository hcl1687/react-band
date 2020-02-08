export default {
  showMenu: {
    next (state, action) {
      return {
        ...state,
        MENU_STATUS: action.payload
      }
    }
  },
  enableMenu: {
    next (state, action) {
      return {
        ...state,
        MENU_ENABLED: action.payload
      }
    }
  }
}
