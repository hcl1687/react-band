import configFactory from '../config'

const config = configFactory()

describe('common/decorators/theme/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
