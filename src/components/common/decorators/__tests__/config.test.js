import configFactory from '../config'

const config = configFactory()

describe('common/decorators', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
