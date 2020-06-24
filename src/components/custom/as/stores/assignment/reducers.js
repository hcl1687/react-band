export default {
  getList: {
    next (state, action) {
      const { items = [], count = 0 } = action.payload

      return {
        ...state,
        items,
        count
      }
    },
    throw (state, action) {
      // handle error
      return {
        ...state
      }
    }
  }
}
