import configFactory from '../config'

const config = configFactory()

describe('common/decorators/i18n/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
