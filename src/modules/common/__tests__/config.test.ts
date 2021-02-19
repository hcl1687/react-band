import configFactory from '../config'

const config = configFactory()

describe('common/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
