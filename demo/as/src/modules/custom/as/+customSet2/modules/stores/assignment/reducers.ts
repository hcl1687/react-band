export default {
  getAssignmentList: {
    next (state, action) {
      const { assignments = [], count = 0 } = action.payload

      return {
        ...state,
        assignments,
        count
      }
    },
    throw (state) {
      // handle error
      return {
        ...state
      }
    }
  },
  getAssignment: {
    next (state, action) {
      const assignment = action.payload

      return {
        ...state,
        assignment
      }
    },
    throw (state) {
      // handle error
      return {
        ...state
      }
    }
  },
  editAssignment: {
    next (state) {
      // handle error
      return {
        ...state
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
