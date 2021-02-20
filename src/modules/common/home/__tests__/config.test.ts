import configFactory from '../config'

const config = configFactory()

describe('common/home/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
