import getStore from '../getStore'

describe('common/redux/getStore', () => {
  it('should render correctly', () => {
    const store = getStore()
    expect(store.asyncReducers).not.toBeUndefined()
    expect(typeof store.injectReducer).toEqual('function')
  })
})
