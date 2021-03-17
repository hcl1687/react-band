export default {
  setBreadcrumb: {
    next (state, action) {
      return {
        ...state,
        BREADCRUMBS: action.payload
      }
    }
  }
} as DecoRedux.IReduxReducers
