import configFactory from '../config'

const config = configFactory()

describe('common/layout/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
