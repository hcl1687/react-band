import configFactory from '../config'

const config = configFactory()

describe('common/loading/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
