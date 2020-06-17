import configFactory from '../config'

const config = configFactory()

describe('common/decorators/localStore/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
