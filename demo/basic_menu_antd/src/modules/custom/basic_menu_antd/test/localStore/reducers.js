export default {
  addItem: {
    next (state, action) {
      const item = action.payload || {}
      const { items = [] } = state

      return {
        ...state,
        items: [
          ...items,
          item
        ]
      }
    },
    throw (state, action) {
      return state
    }
  },
  deleteItem: {
    next (state, action) {
      const index = action.payload
      const { items = [] } = state
      items.splice(index, 1)

      return {
        ...state,
        items: [...items]
      }
    },
    throw (state, action) {
      return state
    }
  }
}
