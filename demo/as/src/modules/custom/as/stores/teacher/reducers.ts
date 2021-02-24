export default {
  getTeacher: {
    next (state, action) {
      const data = action.payload

      return {
        ...state,
        teacher: data
      }
    },
    throw (state) {
      // handle error
      return {
        ...state
      }
    }
  },
  editTeacher: {
    next (state, action) {
      const data = action.payload

      return {
        ...state,
        teacher: data
      }
    },
    throw (state) {
      // handle error
      return {
        ...state
      }
    }
  }
} as DecoRedux.IReduxReducers
