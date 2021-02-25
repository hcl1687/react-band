import config from '../index'

describe('config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
