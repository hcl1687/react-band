import configFactory from '../config'

const config = configFactory()

describe('common/decorators/layout/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
