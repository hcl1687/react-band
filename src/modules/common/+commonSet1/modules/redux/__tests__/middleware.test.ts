import middleware from '../middleware'

describe('common/redux/utils', () => {
  it('should render correctly', () => {
    expect(middleware.length).toEqual(2)
  })
})
